const express = require("express");
const router = express.Router();
const Loan = require("../models/Loan"); // Import Loan model
const Customer = require("../models/Customer");
const {
  handleInterBankTransfer,
  getLoanAccountStatement,
  handleGetTransactionQuery,
  getBankoneCommercialBanks,
} = require("../services/bankoneOperationsServices");
const { generateTransactionRef } = require("../utils/generateTransactionRef");
const Employer = require("../models/EmployersManager");
const { default: axios } = require("axios");
const CreditAnalysis = require("../models/CreditAnalysis");
const {
  calculateOverdueLoansfromRepaymentSchedule,
  handleApproveBooking,
} = require("../services/loanServices.service");
const LoanDisbursement = require("../models/LoanDisbursment");
const NDDMandate = require("../models/NDDMandate");
const BankoneCollection = require("../models/BankoneCollection");
const LoanRepayment = require("../models/LoanRepayment");
const {
  nameEnquiry,
  getEasyPayInstitutionCode,
} = require("../services/nibss.service");

// create new loan
router.post("/", async (req, res) => {
  try {
    const {
      loanamount,
      monthlyrepayment,
      loanproduct,
      numberofmonth,
      loantotalrepayment,
      loanpurpose,
      deductions,
    } = req.body;

    if (
      !req.user ||
      !loanamount ||
      !monthlyrepayment ||
      !loanproduct ||
      !numberofmonth ||
      !loantotalrepayment ||
      !loanpurpose
    ) {
      return res.status(400).json({ error: "Please Provide All Details" });
    }

    const newLoan = await Loan.create({
      customer: req.user._id,
      loanstatus: "with credit",
      loanproduct: loanproduct,
      loanamount: loanamount,
      monthlyrepayment: monthlyrepayment,
      numberofmonth: numberofmonth,
      loantotalrepayment: loantotalrepayment,
      loanpurpose: loanpurpose,
      deductions: deductions,
    });

    await CreditAnalysis.create({
      customer: req.user._id,
      loan: newLoan._id,
    });

    return res
      .status(201)
      .json({ message: "Loan Application Submitted Successfully" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get all loan
router.get("/", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $ne: "with operations" },
    })
      .populate({
        path: "customer",
        populate: {
          path: "employer", // Populating employer within customer
          model: "Employer",
        },
      })
      .populate("loanproduct")
      .sort({ createdAt: -1 })
      .lean();

    loans.forEach((loan) => {
      if (!loan?.customer) {
        loan.customer = {};
      }
      if (!loan?.customer?.employer) {
        const psuedoEmployer = new Employer({
          employersId: `E00${Math.floor(Math.random() * 100) + 1} `,
          employersName: loan.customer?.otheremployername,
          employersAddress: loan.customer?.employeraddress,
        });

        loan.customer.employer = psuedoEmployer;
      }
    });

    return res.status(200).json(loans);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Get all loan
router.get("/all", async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate({
        path: "customer", // Populate customer details
        populate: {
          path: "employer", // Nested populate for employer details
          model: "Employer",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all loan
router.get("/my/:customerId", async (req, res) => {
  const { customerId } = req.params;

  const bankOneBaseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  const mfbcode = "100579";

  try {
    let loans = await Loan.find({
      customer: customerId,
    })
      .populate("customer")
      .populate("loanproduct")
      .sort({ createdAt: -1 });

    if (loans.length > 0) {
      const acccountBalUrl = `${bankOneBaseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${loans[0]?.customer?.banking?.accountDetails?.CustomerID}`;
      const getLoanUrl = `${bankOneBaseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=${mfbcode}&CustomerID=${loans[0]?.customer?.banking?.accountDetails?.CustomerID}`;

      const { data: accountsBalance } = await axios.get(acccountBalUrl);
      const { data: loansInfo } = await axios.get(getLoanUrl);

      loans = loans.map((loan) => {
        const balance = accountsBalance?.Message?.find(
          (bal) => bal.LoanAccountNo == loan.loanAccountNumber
        );
        const loanInfo = loansInfo?.Message?.find(
          (loanD) => loanD.Number == loan.loanAccountNumber
        );

        return {
          ...loan.toJSON(),
          accountBalance: balance,
          loanInfo,
        };
      });
    }

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all pending laons loan
router.get("/pending", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["with credit", "with coo"] },
    })
      .populate("customer")
      .sort({ createdAt: -1 });
    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Unbooked laons
router.get("/unbooked", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: "unbooked",
      // deductions: { $ne: "remita" },
    })
      .populate("customer")
      .sort({ updatedAt: -1 });

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Booked loans
router.get("/booked", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: "booked",
      // deductions: { $ne: "remita" },
    })
      .populate("customer")
      .sort({ updatedAt: -1 });

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Disbursed laons loan
router.get("/disbursed", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: "completed",
    })
      .populate("customer")
      .sort({ updatedAt: -1 });

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const calcDaysDiffFromNow = (refDate) => {
  let Difference_In_Time = new Date().getTime() - new Date(refDate).getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
};

// repayment schedule
router.get("/overdue", async (req, res) => {
  const token = process.env.BANKONE_TOKEN;
  const { search, dateFilter, sort = "latest" } = req.query;

  try {
    const loans = await Loan.find({
      loanstatus: "completed",
    })
      .populate("customer")
      .sort({ createdAt: -1 });

    let overdueLoans = [];

    await Promise.all(
      loans.map(async (loan) => {
        if (loan?.loanAccountNumber) {
          const { data: repaymentSchedule } = await axios.get(
            `${process.env.BANKONE_BASE_URL}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loan.loanAccountNumber}`
          );

          let { overdueLoans: loanRepaymentSchedule } =
            calculateOverdueLoansfromRepaymentSchedule(repaymentSchedule);

          if (loanRepaymentSchedule.length > 0) {
            const requestUrl = `${process.env.BANKONE_BASE_URL}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${loan.customer?.banking?.accountDetails?.CustomerID}`;
            const { data } = await axios.get(requestUrl);
            let accountBalance = data.Message.find(
              (item) => item.LoanAccountNo === loan.loanAccountNumber
            );

            const reqUrl = `${process.env.BANKONE_BASE_URL}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=${process.env.BANKONE_MFB_CODE}&CustomerID=${loan.customer?.banking?.accountDetails?.CustomerID}`;
            const { data: loanInfoRes } = await axios.get(reqUrl);

            let loanInfo = loanInfoRes.Message.find(
              (item) => item.Number === loan.loanAccountNumber
            );

            const payload = {
              ...loan.toJSON(),
              repaymentSchedule: loanRepaymentSchedule,
              accountBalance,
              dateCreated: loanInfo.DateCreated,
              disbursedAmount: loanInfo.LoanAmount,
            };

            overdueLoans.push(payload);
          }
        }
      })
    );
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive search

      overdueLoans = overdueLoans.filter((loan) => {
        const { customer } = loan;
        if (!customer) return false;

        return (
          searchRegex.test(customer.firstname) ||
          searchRegex.test(customer.lastname) ||
          searchRegex.test(customer.username) ||
          searchRegex.test(customer.email)
        );
      });
    }

    return res.status(200).json(overdueLoans);
  } catch (error) {
    console.log(error);
    console.log(error?.response?.data, "Over due");
    return res.status(500).json({ error: error.message });
  }
});

// Get all Disbursed laons loan
router.get("/declined-terminated", async (req, res) => {
  try {
    const loans = await Loan.find({
      loanstatus: { $in: ["declined", "terminated"] },
    }).populate("customer");

    return res.status(200).json(loans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new loan
router.post("/", async (req, res) => {
  try {
    const newLoanData = req.body;
    const newLoan = await Loan.create(newLoanData);
    return res
      .status(201)
      .json({ success: "Loan created successfully", loan: newLoan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update loan
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res
      .status(200)
      .json({ success: "Loan updated successfully", loan: updatedLoan });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update loan
router.put("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { loanstatus } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      {
        loanstatus,
      },
      {
        new: true,
      }
    ).populate("customer");

    if (!updatedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res
      .status(200)
      .json({ success: "Loan Status updated successfully", loan: updatedLoan });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Delete loan
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLoan = await Loan.findByIdAndDelete(id).populate("customer");

    if (!deletedLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    return res.status(200).json({ success: "Loan deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// add new loan operations
// Endpoint to add a new loan to the allLoans array of a customer
router.post("/:customerId", async (req, res) => {
  const { customerId } = req.params;
  const newLoan = req.body; // Assuming the loan object is sent in the request body

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Add the new loan to the allLoans array
    // customer.allLoans.push(newLoan);

    const addedLoan = await Loan.create(newLoan);

    // Save the updated customer document
    // await customer.save();

    res
      .status(201)
      .json({ message: "Loan added successfully", loan: addedLoan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to fetch all loans for a customer
router.get("/:customerId", async (req, res) => {
  const { customerId } = req.params;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const customerLoans = await Loan.find({ customer: customer._id }).populate(
      "customer"
    );

    // Return the allLoans array
    res.status(200).json(customerLoans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to update a loan object in the allLoans array
router.put("/:customerId/update/:loanId", async (req, res) => {
  const { customerId, loanId } = req.params;
  const loanUpdates = req.body;

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const loanFound = Loan.findOneAndUpdate(
      { _id: loanId, customer: customer._id },
      loanUpdates,
      {
        new: true,
      }
    );

    if (!loanFound) {
      return res.status(404).json({ error: "Customer Loan not Found" });
    }

    res.status(200).json({
      message: "Loan updated successfully",
      loan: loanFound,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to Book loans by Operations Officers
router.put("/book/:loanId", async (req, res) => {
  const { loanId } = req.params;
  try {
    let updateData = { ...req.body, bookingInitiated: true };
    // Find the customer by ID
    const loan = await Loan.findByIdAndUpdate(loanId, updateData, {
      new: true,
    });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(loan);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to Approve Booked loans by COO
router.put("/approved-book/:loanId", async (req, res) => {
  const { loanId } = req.params;

  try {
    if (!loanId) {
      return res.status(400).json({ error: "Please provid a loanId" });
    }

    const loan = await handleApproveBooking(loanId);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint for Operations to disburse loans
router.put("/disburse/:loanId", async (req, res) => {
  const { loanId } = req.params;
  const { amount, debitAccount, notes, creditAccountName } = req.body;
  if (!amount || !debitAccount || !notes || !creditAccountName) {
    return res.status(400).json({ error: "Missing Fields" });
  }

  try {
    // Find the customer by ID
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.isTopUpLoan) {
      const parentLoanObj = await Loan.findOne({
        _id: loan.parentLoan,
      });

      if (!parentLoanObj) {
        return res
          .status(404)
          .json({ error: "Parent Loan Not Found for Top up loan" });
      }
      if (parentLoanObj.loanstatus !== "terminated") {
        return res
          .status(400)
          .json({ error: "Parent Loan has not been Terminated!" });
      }
    }

    loan.disbursementstatus = "disbursed";
    loan.debursementDetails = req.body;

    await loan.save();

    // Update monthsSinceLastLoan for the customer
    await Customer.findByIdAndUpdate(loan.customer, {
      $set: {
        "topUpLoanEligibility.monthsSinceLastLoan": 0, // Reset since this is a new loan
      },
    });

    // Return the allLoans array
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to get loan from the account number
router.get("/getLoanFromAccountNumber/:accNumber", async (req, res) => {
  const { accNumber } = req.params;

  if (!accNumber) {
    return res.status(400).json({ error: "Missing Field" });
  }

  try {
    // Find the customer by ID
    const loan = await Loan.findOne({
      loanAccountNumber: accNumber,
    }).populate("customer");

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Return the allLoans array
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to check if user has taken remita loan
router.get("/getUserRemitaLoans/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ error: "Missing Field" });
  }

  try {
    // Find the customer by ID
    const customerRemitaLoan = await Loan.find({
      customer: customerId,
      deductions: "remita",
    }).populate("customer");

    // Return the allLoans array
    res.status(200).json(customerRemitaLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

// Endpoint for Operations to disburse loans
router.put("/approve-disburse/:loanId", async (req, res) => {
  const { loanId } = req.params;
  const token = process.env.BANKONE_TOKEN;

  try {
    const loanAndCustomer = await Loan.findById(loanId).populate("customer");

    if (!loanAndCustomer)
      return res.status(404).json({ message: "Customer not found" });

    if (!loanAndCustomer?.debursementDetails?.amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const reference = `TF${
      loanAndCustomer?.customer?.banking?.accountDetails?.CustomerID
    }${generateTransactionRef()}`;

    const bankoneCommercialBanks = await getBankoneCommercialBanks();
    const bankName = bankoneCommercialBanks?.find(
      (bank) => bank.Code == loanAndCustomer.customer.bankcode
    )?.Name;

    const destinationInstitutionCode = await getEasyPayInstitutionCode(
      bankName
    );

    const data = await nameEnquiry({
      accountNumber: loanAndCustomer.customer.disbursementaccountnumber,
      destinationInstitutionCode,
    });

    const transferRequestPayload = {
      Amount: loanAndCustomer.debursementDetails.amount * 100,
      PayerAccountNumber: loanAndCustomer.debursementDetails.debitAccount,
      Payer: loanAndCustomer.customer.banking.accountDetails.CustomerName,
      ReceiverAccountNumber: loanAndCustomer.customer.disbursementaccountnumber,
      ReceiverBankCode: loanAndCustomer.customer.bankcode,
      ReceiverName: loanAndCustomer.debursementDetails.creditAccountName,
      Narration: loanAndCustomer.debursementDetails.notes,
      TransactionReference: reference,
      NIPSessionID: data.sessionID,
      Token: token,
    };

    const transferRes = await handleInterBankTransfer(transferRequestPayload);

    console.log(transferRes, "transferRes");

    if (transferRes.IsSuccessFul && transferRes.Status === "Successful") {
      await new LoanDisbursement({
        loan: loanAndCustomer._id,
        customer: loanAndCustomer.customer._id,
        collectionId: reference,
        status: transferRes.Status,
        amount: Number(loanAndCustomer.debursementDetails.amount),
        reference,
        paymentDate: new Date(),
      }).save();

      await new NDDMandate({
        loan: loanAndCustomer._id,
        customer: loanAndCustomer.customer._id,
      }).save();

      await Loan.findByIdAndUpdate(loanId, {
        disbursementstatus: "approved",
        loanstatus: "completed",
      });

      return res.json(transferRes);
    } else if (
      transferRes.Status === "Pending" ||
      transferRes.ResponseCode == "91" ||
      transferRes.ResponseCode == "06"
    ) {
      const tsqRes = await handleGetTransactionQuery({
        amount: Number(loanAndCustomer.debursementDetails.amount),
        date: formatDate(new Date()),
        ref: reference,
      });

      console.log(tsqRes, "tsqRes 1");

      if (tsqRes.Status == "Successful") {
        await new LoanDisbursement({
          loan: loanAndCustomer._id,
          customer: loanAndCustomer.customer._id,
          collectionId: reference,
          status: tsqRes.Status,
          amount: Number(loanAndCustomer.debursementDetails.amount),
          reference,
          paymentDate: new Date(),
        }).save();

        await new NDDMandate({
          loan: loanAndCustomer._id,
          customer: loanAndCustomer.customer._id,
        }).save();

        await Loan.findByIdAndUpdate(loanId, {
          disbursementstatus: "approved",
          loanstatus: "completed",
        });

        return res.json(tsqRes);
      } else {
        return res
          .status(500)
          .json({ error: tsqRes.ResponseMessage || "Something Went Wrong" });
      }
    } else {
      return res
        .status(500)
        .json({ error: transferRes.ResponseMessage || "Something Went Wrong" });
    }
  } catch (err) {
    console.log(err, "err");
    res
      .status(500)
      .json({ error: err?.response?.data?.message || err.message });
  }
});

// Endpoint to get Customer loan and balance
router.get("/report/loans-and-account-balances", async (req, res) => {
  let { customerId, accountNumber } = req.query;

  const token = process.env.BANKONE_TOKEN;
  const baseUrl = process.env.BANKONE_BASE_URL;

  try {
    if (!customerId && !accountNumber) {
      return res.status(400).json({
        error: "Please provide either customerId or Loan Account Number",
      });
    }

    if (accountNumber && !customerId) {
      const customer = await Customer.findOne({
        "banking.accountDetails.AccountNumber": accountNumber,
      });

      customerId = customer?.banking.accountDetails.CustomerID;
    }

    const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${customerId}`;

    const { data } = await axios.get(apiUrl);
    if (typeof data.Message == "string" || !data.Message) {
      return res
        .status(500)
        .json({ error: data?.Message || "Something Went wrong" });
    }
    const accountBalances = data.Message;

    const loanPayload = await Promise.all(
      accountBalances.map(async (balance) => {
        const loan = await Loan.findOne({
          loanAccountNumber: balance.LoanAccountNo,
        })
          .populate("customer")
          .populate("loanproduct")
          .lean();

        const { data: productData } = await axios.get(
          `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${loan.loanproduct.productCode}`
        );

        loan.accountBalance = balance;
        loan.loanproduct = productData;

        return loan;
      })
    );

    // Return the allLoans array
    res.status(200).json(loanPayload);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: err.message || "Something went wrong with the request" });
  }
});

router.post("/create/collection", async (req, res) => {
  const {
    loan,
    customer,
    collectionId,
    status,
    amount,
    reference,
    repaymentScheduleIds,
  } = req.body;

  try {
    const newCollection = await new BankoneCollection({
      loan,
      customer,
      collectionId,
      status,
      amount,
      reference,
      repaymentScheduleIds,
      paymentDate: new Date(),
    }).save();

    await new LoanRepayment({
      collectionRef: newCollection._id,
      collectionType: "BankoneCollection",
    }).save();

    return res.status(200).json(newCollection);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: err.message || "Something went wrong with the request" });
  }
});

module.exports = router;
