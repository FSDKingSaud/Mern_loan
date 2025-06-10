const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const dotenv = require("dotenv");
const Loan = require("../models/Loan");
const Customer = require("../models/Customer");
const RemitaCollection = require("../models/RemitaCollection");
const { default: axios } = require("axios");
const {
  handleInterBankTransfer,
} = require("../services/bankoneOperationsServices");
const { generateTransactionRef } = require("../utils/generateTransactionRef");
const LoanRepayment = require("../models/LoanRepayment");

// configure dotenv
dotenv.config();

const merchantId = process.env.REMITA_MERCHANT_ID;
const apiKey = process.env.REMITA_API_KEY;
const apiToken = process.env.REMITA_TOKEN;
const baseUrl = "https://login.remita.net/";

// Generate a unique requestId
const generateRequestId = () => {
  return Date.now().toString();
};

// Generate the authorization header
const generateAuthorization = () => {
  const requestId = generateRequestId();

  const dataToHash = apiKey + requestId + apiToken;
  const apiHash = crypto.createHash("sha512").update(dataToHash).digest("hex");

  // authorization code format
  const authorizationToken =
    "remitaConsumerKey=" + apiKey + ",remitaConsumerToken=" + apiHash;

  // return authorizationToken and requestId
  return {
    authorizationToken,
    requestId,
  };
};

// generate authorization toke
// const { authorizationToken, requestId: requestedId } = generateAuthorization();

// comment this out for deployment
// const testAuthCode = "844743";
// const testauthorizationToken =
//   "remitaConsumerKey=QzAwMDAxMDg3MzgxMjM0fEMwMDAwMTA4NzM4,remitaConsumerToken=30098e011ba49849de5013325415bb047a1d59a6cbc08d10c768cdf18142628aac62c618de8ef7dc2bd0d7f84561dc37596a421ded4cef6033efe4fb406efc3a";
// const testRemitaDetails = {
//   status: "success",
//   hasData: false,
//   responseId: "1737447603283/1737447603283",
//   responseDate: "21-01-2025 08:22:38+0000",
//   requestDate: null,
//   responseCode: "00",
//   responseMsg: "SUCCESS",
//   data: {
//     customerId: "12339968030",
//     bankCode: "058",
//     bvn: "22427322862",
//     companyName: "FGN IPPIS",
//     customerName: "ABBA  SHARIF M",
//     salaryPaymentDetails: [],
//     loanHistoryDetails: [],
//   },
// };

// check salary endpoint
router.post("/get-salary-history", async (req, res) => {
  // extract the customer details from the request body
  const {
    firstName,
    lastName,
    accountNumber,
    bankCode,
    bvn,
    authorisationChannel,
    loanId,
  } = req.body;

  try {
    const authorisationCode = Math.floor(Math.random() * 1101233);
    // generate authorization token
    const { authorizationToken, requestId: requestedId } =
      generateAuthorization();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestedId);
    myHeaders.append("Authorization", authorizationToken);

    const raw = JSON.stringify({
      authorisationCode,
      firstName,
      lastName,
      accountNumber,
      bankCode,
      bvn,
      authorisationChannel,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/salary/history/ph`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    console.log(result, "result")

    // Update the Loan model with the API result
    const loanUpdated = await Loan.findByIdAndUpdate(
      loanId, // Ensure loanId is passed in the request body
      {
        $set: {
          "remita.isRemitaCheck": true,
          "remita.authorizationToken": authorizationToken,
          "remita.authorizationCode": authorisationCode,
          "remita.remitaDetails": result,
        },
      },
      { new: true } // Return the updated document
    );

    // Comment this out for depoyment
    // const loanUpdated = await Loan.findByIdAndUpdate(
    //   loanId, // Ensure loanId is passed in the request body
    //   {
    //     $set: {
    //       "remita.isRemitaCheck": true,
    //       "remita.authorizationToken": testauthorizationToken,
    //       "remita.authorizationCode": testAuthCode,
    //       "remita.remitaDetails": testRemitaDetails,
    //     },
    //   },
    //   { new: true } // Return the updated document
    // );

    res.status(200).json({
      message: "Salary history API called successfully",
      data: loanUpdated,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

router.put("/initiate-check/:loanId", async (req, res) => {
  const { loanId } = req.params;
  try {
    let updateData = { ...req.body, "remita.remitaStatus": "check_approval" };
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

router.put("/approve-check/:loanId", async (req, res) => {
  const { loanId } = req.params;
  try {
    let updateData = { ...req.body, "remita.remitaStatus": "booking" };
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

// new endpoint
// Update loanStatus endpoint
router.put("/update-loan-status", async (req, res) => {
  const { loanId, loanStatus } = req.body;

  try {
    // Validate input
    if (!loanId || !loanStatus) {
      return res.status(400).json({
        success: false,
        message: "loanId and loanStatus are required.",
      });
    }

    // Find and update the loan
    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId, // ID of the loan to update
      {
        $set: {
          "remita.remitaStatus": loanStatus, // Update remita.remitaStatus to match loanStatus
        },
      }, // Update the loanStatus field
      { new: true } // Return the updated document
    );


    // If loan not found
    if (!updatedLoan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found.",
      });
    }

    if (loanStatus === "rejected") {
      updatedLoan.loanstatus === "declined";
      await updatedLoan.save();
    }

    // Respond with the updated loan
    res.status(200).json({
      success: true,
      message: "Loan status updated successfully.",
      data: updatedLoan,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// format date function
const formatDateToAPIFormat = (date) => {
  const pad = (num) => num.toString().padStart(2, "0");
  const offset = date.getTimezoneOffset(); // Offset in minutes
  const absOffset = Math.abs(offset);
  const sign = offset > 0 ? "-" : "+";
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;

  return `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()} ${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}:${pad(date.getSeconds())}${sign}${pad(hours)}${pad(minutes)}`;
};

// Loan Disbursement Notification Endpoint
router.post("/loan-disbursement-notification", async (req, res) => {
  try {
    // Validate request body for `loanId`
    const { loanId } = req.body;
    if (!loanId) {
      return res
        .status(400)
        .json({ error: "loanId is required in the request body" });
    }

    // Fetch loan details
    const customerLoan = await Loan.findById(loanId);
    if (!customerLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Check if the customer reference exists
    if (!customerLoan.customer) {
      return res
        .status(404)
        .json({ error: "Customer reference not found in the loan" });
    }

    // Fetch customer details
    const customer = await Customer.findById(customerLoan.customer.toString());
    if (!customer) {
      return res.status(404).json({ error: "Customer details not found" });
    }

    // Extract customer and loan data
    const loanAmount = customerLoan.loanamount.toString();
    const collectionAmount = customerLoan.loantotalrepayment.toString();
    const numberOfRepayments = customerLoan.numberofmonth.toString();
    const customerId = customerLoan.remita.remitaDetails?.data?.customerId;
    const bcode = "039";
    const accNumber = "0017502813";
    const authorisationCode = customerLoan.remita.authorizationCode;

    // Generate authorization token
    const { authorizationToken, requestId } = generateAuthorization();

    // Format dates
    const dateOfDisbursement = formatDateToAPIFormat(new Date());
    const dateOfCollection = formatDateToAPIFormat(
      new Date(
        new Date().setDate(
          new Date().getDate() + Number(customerLoan.moratorium) + 30
        )
      )
    );

    // Request headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestId);
    myHeaders.append("Authorization", authorizationToken);

    // Create payload
    const raw = JSON.stringify({
      customerId,
      authorisationCode,
      authorisationChannel: "WEB",
      phoneNumber: customer.phonenumber,
      accountNumber: accNumber,
      currency: "NGN",
      loanAmount,
      collectionAmount,
      dateOfDisbursement,
      dateOfCollection,
      totalCollectionAmount: collectionAmount,
      numberOfRepayments,
      bankCode: bcode,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // Send POST request to the external API
    const response = await fetch(
      `${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/post/loan`,
      requestOptions
    );

    // Check response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      return res.status(response.status).json({
        error: `API call failed with status ${response.status}`,
        details: errorText,
      });
    }

    // Parse response body
    const result = await response.json();

    // Check if `result.status` is "success"
    let updatedData;
    if (result.status === "success") {
      // Update `customerLoan` with required fields

      customerLoan.remita.remitaStatus = "disbursement";
      customerLoan.remita.stopLoanStatus = "active";
      customerLoan.remita.disbursementDetails = result;

      // Save the updated loan
      updatedData = await customerLoan.save();
    }

    // Return success response
    res.status(200).json({
      message: "Loan disbursement notification processed successfully",
      data: result,
      updateLoan: updatedData,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res
      .status(500)
      .json({ error: "An internal error occurred", details: error.message });
  }
});

// collection notification endpoint (webhooks in process )
router.post("/webhook", async (req, res) => {
  try {
    // Handle the incoming collection notification data
    const collectionData = req.body;

    const {
      id,
      amount,
      dateNotificationSent,
      netSalary,
      totalCredit,
      balanceDue,
      customer_id,
      payment_date,
      mandateRef,
    } = collectionData;

    // get loan
    const loan = await Loan.findOne({
      "disbursementDetails.data.mandateReference": mandateRef,
    });

    if (loan) {
      const remitaCollection = await RemitaCollection.create({
        amount,
        balanceDue,
        collectionId: id,
        customer: loan.customer,
        dateNotificationSent,
        loan: loan._id,
        mandateRef,
        netSalary,
        paymentDate: payment_date,
        remitaCustomerId: customer_id,
        totalCredit,
      });

      const repayment = new LoanRepayment({
        collectionRef: remitaCollection._id,
        collectionType: "RemitaCollection",
      });
      await repayment.save();

      // Transfer Money from Boctrust Remita Collection Account to the Customer Loan Account
      const transferRequestPayload = {
        Amount: loan?.monthlyrepayment,
        PayerAccountNumber: process.env.BOC_REMITA_COLLECTION_ACC,
        Payer: process.env.BOC_REMITA_COLLECTION_ACC_NAME,
        ReceiverAccountNumber: loan?.loanAccountNumber,
        ReceiverBankCode: "100579",
        ReceiverName: loan?.customer?.banking.accountDetails.CustomerName,
        Narration: "LoanRepayment from Remita",
        TransactionReference: `TF${
          loan?.customer?.banking?.accountDetails?.CustomerID
        }${generateTransactionRef()}`,
        Token: process.env.BANKONE_TOKEN,
      };

      await handleInterBankTransfer(transferRequestPayload);

      const { data: repaymentSchedule } = await axios.get(
        `${process.env.BANKONE_BASE_URL}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${process.env.BANKONE_TOKEN}&loanAccountNumber=${loan.loanAccountNumber}`
      );

      const scheduledToBePaid = repaymentSchedule.find(
        (loanSchedule) =>
          !loanSchedule.IsPrincipalApplied ||
          loanSchedule.IsInterestApplied ||
          loanSchedule.IsFeeApplied
      );

      loan.paymentRecord.push({
        bankoneRecordId: scheduledToBePaid.Id,
        paymentDate: new Date(),
      });

      await loan.save();
    }

    // Respond with an acknowledgment
    const acknowledgment = {
      Response_code: "00",
      response_descr: "Successful",
      ack_id: "00",
    };

    res.status(200).json(acknowledgment);
  } catch (error) {
    console.error("Error handling collection notification:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the notification" });
  }
});

router.get("/collection-notification", async (req, res) => {
  try {
    const { loanId } = req.query;

    if (!loanId) {
      res.status(400).json({ error: "Please Provide loanId as Query Params" });
    }

    const collections = await RemitaCollection.find({
      loan: loanId,
    })
      .populate("loans")
      .populate("customer");

    res.status(200).json(collections);
  } catch (error) {
    console.error("Error handling collection notification:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the notification" });
  }
});

router.get("/completed-loans", async (req, res) => {
  try {
    const compledtedLoan = await Loan.find({
      deductions: "remita",
      loanstatus: "completed",
    }).populate("customer");

    res.status(200).json(compledtedLoan);
  } catch (error) {
    console.error("Error handling collection notification:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the notification" });
  }
});

// mandate history endpoint (Done)
router.post("/mandate-history", async (req, res) => {
  try {
    // Validate request body for `loanId`
    const { loanId } = req.body;
    if (!loanId) {
      return res
        .status(400)
        .json({ error: "loanId is required in the request body" });
    }

    // Fetch loan details
    const customerLoan = await Loan.findById(loanId);
    if (!customerLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Generate authorization token
    const { authorizationToken, requestId } = generateAuthorization();

    // Request headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestId);
    myHeaders.append("Authorization", authorizationToken);

    // extract data from customer loan
    const authorisationCode = customerLoan.remita.authorizationCode;
    const customerId = customerLoan.remita.remitaDetails.data.customerId;
    const mandateRef =
      customerLoan.remita.disbursementDetails.data.mandateReference;

    const raw = JSON.stringify({
      authorisationCode: authorisationCode,
      customerId: customerId,
      mandateRef: mandateRef,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/loan/payment/history`,
      requestOptions
    );

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    res.status(200).json({
      message: "Mandate history api called successfully",
      data: result,
    });
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ error: "An error occurred" });
  }
});

// stop loan collection endpoint (Done)
router.post("/stop-loan-collection", async (req, res) => {
  try {
    // Validate request body for `loanId`
    const { loanId } = req.body;
    if (!loanId) {
      return res
        .status(400)
        .json({ error: "loanId is required in the request body" });
    }

    // Fetch loan details
    const customerLoan = await Loan.findById(loanId);
    if (!customerLoan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    // Generate authorization token
    const { authorizationToken, requestId } = generateAuthorization();

    // Request headers
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Api_Key", apiKey);
    myHeaders.append("Merchant_id", merchantId);
    myHeaders.append("Request_id", requestId);
    myHeaders.append("Authorization", authorizationToken);

    // extract data from customer loan
    const authorisationCode = customerLoan.remita.authorizationCode;
    const customerId = customerLoan.remita.remitaDetails.data.customerId;
    const mandateRef =
      customerLoan.remita.disbursementDetails.data.mandateReference;

    const raw = JSON.stringify({
      authorisationCode: authorisationCode,
      customerId: customerId,
      mandateRef: mandateRef,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    const response = await fetch(
      `${baseUrl}remita/exapp/api/v1/send/api/loansvc/data/api/v2/payday/stop/loan`,
      requestOptions
    );

    if (!response) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();

    let updatedData;
    if (result.status === "success") {
      // Update `customerLoan` with required fields
      customerLoan.remita.stopLoanStatus = "stopped";

      // Save the updated loan
      updatedData = await customerLoan.save();
    }

    res.status(200).json({
      message: "Stop loan collection api called successfully",
      data: result,
      loanData: updatedData,
    });
  } catch (error) {
    // Handle any errors that occur during the request
    res.status(500).json({ error: "An error occurred" });
  }
});

// Endpoint to check if user has taken remita loan
router.get("/getCustomerRemitaCollection/:customerId", async (req, res) => {
  const { customerId } = req.params;

  if (!customerId) {
    return res.status(400).json({ error: "Missing Field" });
  }

  try {
    // Find the customer by ID
    const customerRemitaCollection = await RemitaCollection.find({
      customer: customerId,
    })
      .populate("customer")
      .populate("loan");

    // Return the allLoans array
    res.status(200).json(customerRemitaCollection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; // export the router
