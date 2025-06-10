const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer"); // Import customer model
const Loan = require("../models/Loan");
const CreditAnalysis = require("../models/CreditAnalysis");

// update kyc details
router.put("/kyc/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: {
          "kyc.isFacialMatch": updates.isFacialMatch,
          "kyc.isIdCardValid": updates.isIdCardValid,
          "kyc.isKycApproved": updates.isKycApproved,
          "kyc.isOtherDocsValidated": updates.isOtherDocsValidated,
          "kyc.isPhotoCaptured": updates.isPhotoCaptured,
          "kyc.isSignatureValid": updates.isSignatureValid,
        },
        $currentDate: { "kyc.timestamps": true },
      },
      { new: true }
    );

    const loan = await Loan.findOneAndUpdate(
      {
        customer: customerId,
      },
      {
        loanstatus: "with credit",
      }
    );

    await CreditAnalysis.create({
      customer: customerId,
      loan: loan._id,
    });

    res.json(customer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update kyc details" });
  }
});

// update bankone account details
router.put("/banking/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { banking: updates },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update account details" });
  }
});

// update remita account details
router.put("/remita/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const updates = req.body;

    // Prepare the update object to set only the desired fields
    const updateObject = {};

    if (updates.hasOwnProperty("isRemitaCheck")) {
      updateObject["remita.isRemitaCheck"] = updates.isRemitaCheck;
    }

    if (updates.hasOwnProperty("remitaStatus")) {
      updateObject["remita.remitaStatus"] = updates.remitaStatus;
    }
    if (updates.hasOwnProperty("loanStatus")) {
      updateObject["remita.loanStatus"] = updates.loanStatus;
    }

    if (updates.hasOwnProperty("remitaDetails")) {
      updateObject["remita.remitaDetails"] = updates.remitaDetails;
    }

    if (updates.hasOwnProperty("disbursementDetails")) {
      updateObject["remita.disbursementDetails"] = updates.disbursementDetails;
    }

    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { $set: updateObject },
      { new: true }
    );
    console.log(customer);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update account details" });
  }
});

// update remita stop loan status
router.put("/remita/:customerId/stoploan", async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const stopLoanStatus = req.body.stopLoanStatus;

    // Find the customer by customerId and update the loanstatus
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { "remita.stopLoanStatus": stopLoanStatus },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update loanstatus" });
  }
});

module.exports = router;
