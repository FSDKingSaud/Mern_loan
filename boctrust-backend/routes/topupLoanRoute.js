// top up loan update here
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Loan = require("../models/Loan"); // Import Loan model
const CreditAnalysis = require("../models/CreditAnalysis");
const AdminUser = require("../models/AdminUser");

const {
  getUserLoanForTopUp,
  calculateTopUpLoanValues,
} = require("../services/topUp.service");
const {
  getRepaymentSchdule,
} = require("../services/bankoneOperationsServices.js");
const {
  getAmountAndDurationOfPaymentLeft,
} = require("../services/loanServices.service.js");
const {
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("../services/notification.service.js");

// Submit Top-up Loan Request
router.post("/top-up-request", async (req, res) => {
  const { customerId, loanAmount, loanDuration, note } = req.body;
  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);
    if (!customer.topUpLoanEligibility.isEligible) {
      return res.status(400).json({
        error:
          "You are not Eligible to apply for a Top up loan or you have applied already",
      });
    }

    const userTopUpLoan = await getUserLoanForTopUp(customerId);

    if (!userTopUpLoan) {
      return res
        .status(404)
        .json({ error: "Loan Matching Top Up Criteria not found" });
    }

    // find current loan product interest rate
    const product = await Product.findById(userTopUpLoan.loanproduct);

    //get amount customer has paid
    const repaymentSchedule = await getRepaymentSchdule(
      userTopUpLoan.loanAccountNumber
    );
    const { amountLeft } = getAmountAndDurationOfPaymentLeft(repaymentSchedule);

    // calculate new loan total repaymentn
    const { totalPayment, monthlyPayment } = calculateTopUpLoanValues(
      parseFloat(loanAmount),
      product.interestRate,
      Number(loanDuration),
      amountLeft
    );

    const topupLoan = await Loan.create({
      customer: customer._id,
      loanproduct: customer.loanproduct,
      loanamount: loanAmount,
      monthlyrepayment: monthlyPayment, // update
      numberofmonth: loanDuration,
      loantotalrepayment: totalPayment, // update
      loanpurpose: customer.loanpurpose,
      deductions: customer.deductions,
      isTopUpLoan: true,
      parentLoan: userTopUpLoan._id,
    });

    customer.topUpLoanEligibility.isEligible = false;
    customer.topUpLoanEligibility.hasTopUpLoan = true;
    await customer.save();

    const targetUsers = await getUsersToSendNotificationFromTarget("admins");
    targetUsers.push(customer);

    await saveAndSendNotification({
      message: "New Top Application!!",
      metadata: { loanId: topupLoan._id },
      targetUsers,
      type: "topuploan",
    });
    return res
      .status(201)
      .json({ message: "Loan Application Submitted Successfully" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
});

// endpoint to fetch all top-up loans
router.get("/top-up-loans", async (req, res) => {
  try {
    const topUpLoans = await Loan.find({ isTopUpLoan: true })
      .populate("customer")
      .sort({
        createdAt: -1,
      });
    res.status(200).json(topUpLoans);
  } catch (error) {
    console.error("Error fetching top-up loans:", error);
    res.status(500).json({ error: error.message });
  }
});

// update isTopUpLoanSent status
router.put("/send-to-credit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    await CreditAnalysis.create({
      customer: loan.customer,
      loan: loan._id,
    });

    loan.loanstatus = "with credit";
    loan.isTopUpLoanSent = true;
    await loan.save();

    return res
      .status(200)
      .json({ message: "Loan status updated successfully" });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return res.status(500).json({ error: error.message });
  }
});

// endpoint to fetch customer existing loans
router.get("/existing-loans/:customerId", async (req, res) => {
  const { customerId } = req.params;
  try {
    const loans = await Loan.find({ customer: customerId });
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching customer loans:", error);
    res.status(500).json({ error: error.message });
  }
});

// Terminate existing loan and add outstanding balance to a pending top-up loan
router.put("/approve-terminate-for-topup/:loanId", async (req, res) => {
  const { loanId } = req.params;

  try {
    const userMakingRquest = await AdminUser.findById(req.user._id).populate(
      "userRole"
    );

    if (
      userMakingRquest.userRole.value !== "coo" &&
      userMakingRquest.userRole.value !== "super_admin"
    ) {
      return res.status(403).json({ error: "Permission Denied" });
    }

    // Find the customer by ID
    const topupLoan = await Loan.findById(loanId);

    if (!topupLoan) {
      return res.status(404).json({ error: "Top up Loan not found" });
    }

    // Check if the customer has an active loan
    const existingLoan = await Loan.findOne({
      _id: topupLoan.parentLoan,
      customer: topupLoan.customer,
      loanstatus: { $in: ["completed"] },
    });

    if (!existingLoan) {
      return res
        .status(404)
        .json({ error: "No active loan found for this customer." });
    }

    // Update the existing loan to "terminated/completed"
    existingLoan.loanstatus = "terminated";
    await existingLoan.save();

    topupLoan.currentLoanTerminationStatus = "completed";
    await topupLoan.save();

    return res.status(200).json({
      message: "Loan terminated Successfully.",
      terminatedLoan: existingLoan,
      updatedTopUpLoan: topupLoan,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

// Update currentLoanTerminationStatus for a top-up loan
router.put("/start-termination/:loanId", async (req, res) => {
  const { loanId } = req.params;
  const { currentLoanTerminationStatus } = req.body;

  // Validate input
  if (!currentLoanTerminationStatus) {
    return res.status(400).json({ error: "Termination status is required." });
  }

  const validStatuses = ["pending", "initiated", "completed"];
  if (!validStatuses.includes(currentLoanTerminationStatus)) {
    return res.status(400).json({
      error:
        "Invalid termination status. Must be 'pending', 'initiated', or 'completed'.",
    });
  }

  try {
    // Find the loan by ID and ensure it is a top-up loan
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found." });
    }

    if (!loan.isTopUpLoan) {
      return res
        .status(400)
        .json({ error: "The specified loan is not a top-up loan." });
    }

    // Update the currentLoanTerminationStatus
    loan.currentLoanTerminationStatus = currentLoanTerminationStatus;
    await loan.save();

    return res.status(200).json({
      message: "Termination status updated successfully.",
      loan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while updating the termination status.",
    });
  }
});

module.exports = router;
