const express = require("express");
const Customer = require("../models/Customer");
const Loan = require("../models/Loan");
const { default: axios } = require("axios");
const router = express.Router();
const nodemailer = require("nodemailer");
const EmailTemplate = require("../utils/emailTemp");
const {
  getCustomerAccountInfoByTrackingRef,
  handleInterBankTransfer,
  getAccountProduct,
  getLoanProduct,
  generateTrackingId,
  getLoanAccountStatement,
  handleGetTransactionQuery,
  getBankoneCommercialBanks,
  handleGetTransactionQueryCore,
} = require("../services/bankoneOperationsServices");
const {
  authenticateStaffToken,
  authenticateToken,
} = require("../middleware/auth");
const defaultEmailConfig = require("../config/email");
const Settings = require("../models/Settings");
const {
  createOrUpdateLoanRepaymentAndCollection,
  createLoanDisbursmentMandateAndUpdateLoanStatus,
  handleApproveBooking,
} = require("../services/loanServices.service");
const {
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("../services/notification.service");

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const baseUrl = process.env.BANKONE_BASE_URL;

const mfbcode = "100579";
const password = process.env.EMAIL_PASSWORD;

// Create customer account endpoint (Done)
router.post("/createCustomerAccount", async (req, res) => {
  // destructure the request body
  const {
    _id,
    bvnnumber,
    firstname,
    lastname,
    email,
    phonenumber,
    dob,
    stateoforigin,
    houseaddress,
  } = req.body;

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      TransactionTrackingRef: _id,
      AccountOpeningTrackingRef: _id,
      ProductCode: "104",
      CustomerID: _id,
      LastName: lastname,
      OtherNames: firstname,
      BVN: bvnnumber,
      PhoneNo: phonenumber,
      Gender: 0,
      PlaceOfBirth: stateoforigin,
      DateOfBirth: dob,
      Address: houseaddress,
      AccountOfficerCode: "001",
      Email: email,
      NotificationPreference: 3,
      TransactionPermission: "0",
      AccountTier: "3",
    }),
  };

  try {
    const response = await fetch(
      `${baseUrl}/BankOneWebAPI/api/Account/CreateAccountQuick/2?authToken=${token}`,
      options
    );

    if (!response) {
      throw new Error(
        `HTTP error! BankOne Account creation failed. Status: ${response.status}`
      );
    }
    const result = await response.json();
    res.status(200).json({
      message: "Account created successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error BankOne Account creation" });
  }
});

const createLoanRequest = async (apiUrl, options) => {
  const response = await fetch(apiUrl, options);

  if (!response) {
    throw new Error(
      `HTTP error! BankOne Loan creation failed. Status: ${response.status}`
    );
  }
  return response;
};

// loan creation endpoint (verify)
router.post("/createLoan/:loanId", authenticateStaffToken, async (req, res) => {
  const { loanId } = req.params;

  if (!loanId)
    return res.status(400).json({ error: "Bad Request! No LoanId " });

  try {
    const loanAndCustomer = await Loan.findById(loanId)
      .populate("customer")
      .populate("loanproduct");

    if (!loanAndCustomer)
      return res.status(404).json({ error: "Loan Does not Exist" });

    const loanProduct = await getLoanProduct({
      careertype: loanAndCustomer.customer.careertype,
      deductions: loanAndCustomer.deductions,
      otheremployername: loanAndCustomer.customer.otheremployername,
      loanproduct: 305,
    });

    // get the loan creation request payload from the request body
    const {
      _id,
      customer: { banking, bankcode },
      numberofmonth,
      loanamount,
      collateralDetails,
      collateralType,
      computationMode,
      interestAccrualCommencementDate,
      principalPaymentFrequency,
      interestPaymentFrequency,
      moratorium,
    } = loanAndCustomer;

    // console.log(loanProductDetails, "loanProductDetails")

    const customerId = banking?.accountDetails?.CustomerID;

    const accountNumber = banking?.accountDetails?.AccountNumber;

    // convert number of month to number of days
    // const tenure = Number(numberofmonth) * 30;
    const tenure = Number(numberofmonth);

    const trackingRef = generateTrackingId();

    // Define the loan creation request payload here
    const loanRequestPayload = {
      TransactionTrackingRef: trackingRef,
      // LoanProductCode: loanProductDetails.ProductCode,
      LoanProductCode:
        loanAndCustomer.loanproduct.productCode || loanProduct.productCode,
      CustomerID: customerId,
      LinkedAccountNumber: accountNumber,
      CollateralDetails: collateralDetails,
      CollateralType: collateralType,
      ComputationMode: computationMode,
      Tenure: tenure,
      Moratorium: moratorium,
      InterestAccrualCommencementDate: new Date(
        interestAccrualCommencementDate
      ).toISOString(),
      Amount: loanamount,
      InterestRate: loanProduct.interestRate,
      PrincipalPaymentFrequency: principalPaymentFrequency,
      InterestPaymentFrequency: interestPaymentFrequency,
    };

    console.log(loanRequestPayload, "loanRequestPayload");

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(loanRequestPayload),
    };

    // Construct the URL for loan creation
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanApplication/LoanCreationApplication2/2?authToken=${token}`;

    const response = await createLoanRequest(apiUrl, options);

    const result = await response.json();

    console.log(result, "result");

    if (!result.IsSuccessful) {
      return res.status(400).json({ error: result.Message });
    }

    await new Promise((resolve) => setTimeout(resolve, 30000));
    const secondResponse = await createLoanRequest(apiUrl, options);
    const secondResult = await secondResponse.json();
    console.log(secondResult, "secondResult");
    if (!secondResult.IsSuccessful) {
      return res.status(400).json({ error: secondResult.Message });
    }

    await Loan.findOneAndUpdate(
      { _id: loanId },
      {
        loanAccountNumber: secondResult.Message.AccountNumber,
      }
    );

    if (bankcode === mfbcode) {
      await createLoanDisbursmentMandateAndUpdateLoanStatus({
        loanId,
        customerId: loanAndCustomer.customer._id,
        amount: loanamount,
        reference: trackingRef,
        status: result.IsSuccessful ? "Successful" : "Failed",
        uniqueIdentifier: result.TransactionTrackingRef,
      });
    } else {
      await handleApproveBooking(loanId);
    }

    const usersToSend = await getUsersToSendNotificationFromTarget("admins");

    await saveAndSendNotification({
      targetUsers: usersToSend,
      message: `A loan (ID: ${loanId} ) has been booked  for the amount ${loanamount}  `,
      type: "loan",
      metadata: loanId,
    });

    const emailConfig = await Settings.findOne({});

    const host = emailConfig.smptHost || defaultEmailConfig.smptHost;
    const port = emailConfig.smtpPort || defaultEmailConfig.smtpPort;
    const user = emailConfig.smtpUsername || defaultEmailConfig.smtpUsername;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port == 465 ? true : false,
      auth: {
        user,
        pass: password,
      },
    });

    const mailOptionsCustomer = {
      from: `"${emailConfig.fromName || defaultEmailConfig.fromName}" <${
        emailConfig.fromEmail || defaultEmailConfig.fromEmail
      }>`,
      to: loanAndCustomer.customer?.email,
      subject: "Your Loan Has Been Booked for Disbursement",
      html: EmailTemplate({}),
    };

    const mailOptionsCOO = {
      from: `"${emailConfig.fromName || defaultEmailConfig.fromName}" <${
        emailConfig.fromEmail || defaultEmailConfig.fromEmail
      }>`,
      to: "operations@boctrustmfb.com",
      // to: "okpabicounsel@gmail.com",
      subject: "Customer Loan Booked for Disbursement",
      html: `
        <p>Dear COO,</p>
        <p>A loan has been successfully booked for disbursement.</p>
        <p><strong>Customer Details:</strong></p>
        <ul>
          <li>Name: ${loanAndCustomer.customer?.firstname} ${
        loanAndCustomer.customer?.lastname
      }  </li>
          <li>Email: ${loanAndCustomer.customer?.email || "N/A"}</li>
          <li>Loan Amount: ${loanamount || "N/A"}</li>
          <li>Loan Account: ${
            secondResult?.Message?.AccountNumber || "N/A"
          }</li>
        </ul>
        <p>Kindly proceed with the necessary steps for disbursement.</p>
        <p>Thank you.</p>
      `,
    };

    // Send email to the customer
    transporter.sendMail(mailOptionsCustomer, (error, info) => {
      if (error) {
        console.log(error, "Customer email error");
        return res
          .status(500)
          .json({ message: "Failed to send email to customer" });
      }

      // Send email to the COO
      transporter.sendMail(mailOptionsCOO, (errorCOO, infoCOO) => {
        if (errorCOO) {
          console.log(errorCOO, "COO email error");
          return res.status(500).json({
            message: "Customer email sent, but failed to send email to COO",
          });
        }

        // Both emails sent successfully
        res.status(201).json({
          message: "Loan created successfully and Emails Sent",
          data: result,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        error?.message ||
        error ||
        "Internal Server Error BankOne Loan creation",
    });
  }
});

const handleUpdateAccFromBankone = async ({
  bvn,
  accountNumber,
  customerId,
}) => {
  const { data } = await axios.get(
    `${baseUrl}/BankOneWebAPI/api/Customer/GetCustomerByBVN/2?authToken=${token}&BVN=${bvn}`
  );

  if (data?.Message?.Accounts?.length == 0) {
    throw new Error("There are no account for this BVN");
  }

  let foundAccount;

  if (accountNumber) {
    foundAccount = data?.Message?.Accounts?.find(
      (acc) => acc.AccountNumber === accountNumber
    );
  } else {
    foundAccount = data?.Message?.Accounts[0];
  }

  if (!foundAccount) {
    throw new Error("The Account number does not exist on the BVN");
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(
    customerId,
    {
      "banking.accountDetails": {
        AccessLevel: foundAccount?.AccessLevel || "N/A",
        AccountNumber: foundAccount?.AccountNumber || "N/A",
        AccountStatus: foundAccount?.AccountStatus || "N/A",
        AccountType: foundAccount?.AccountType || "N/A",
        CustomerID: foundAccount?.CustomerID || "N/A",
        CustomerName: foundAccount?.CustomerName || "N/A",
        AccountTier: foundAccount?.AccountTier || "N/A",
        DateCreated: foundAccount?.DateCreated || "N/A",
        AccountProductCode: "N/A",
      },
      "banking.isAccountCreated": true,
    },
    {
      new: true,
    }
  );
  return updatedCustomer;
};

// create customer and account endpoint (Done)
router.post(
  "/newCustomerAccount/:customerId",
  authenticateStaffToken,
  async (req, res) => {
    const { customerId } = req.params;

    try {
      const customer = await Customer.findById(customerId);
      const loan = await Loan.findOne({ customer: customer?._id });

      if (!customer)
        return res.status(500).json({ error: "No Customer with provided ID" });

      if (
        customer?.preferredAccountNumber &&
        customer?.preferredAccountNumber != "undefined"
      ) {
        const updatedCustomerInfo = await handleUpdateAccFromBankone({
          bvn: customer.bvnnumber,
          accountNumber: customer.preferredAccountNumber,
          customerId,
        });

        return res.json(updatedCustomerInfo);
      } else if (
        customer?.useAnyAccount &&
        customer?.useAnyAccount != "undefined"
      ) {
        const updatedCustomerInfo = await handleUpdateAccFromBankone({
          bvn: customer.bvnnumber,
          customerId,
        });

        return res.json(updatedCustomerInfo);
      }

      const accountProduct = await getAccountProduct({
        careertype: customer.careertype,
        deductions: loan.deductions,
        otheremployername: customer.otheremployername,
      });

      // dev
      // const accountOfficerCode = "1001";

      // prod
      const accountOfficerCode = "52";

      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          TransactionTrackingRef: customer._id,

          AccountOpeningTrackingRef: customer._id,

          ProductCode: accountProduct.ProductCode,

          LastName: customer.firstname,

          OtherNames: customer.lastname,

          BVN: customer.bvnnumber,

          PhoneNo: customer.phonenumber,

          PlaceOfBirth: customer.stateoforigin,

          DateOfBirth: customer.dob,

          Address: customer.houseaddress,

          NextOfKinPhoneNo: customer.nkinphonenumber,

          NextOfKinName: `${customer.nkinfirstname} ${customer.nkinlastname}`,

          HasSufficientInfoOnAccountInfo: true,

          Email: customer.email,

          Gender: customer.gender || "male",

          AccountOfficerCode: accountOfficerCode,

          NotificationPreference: "3",

          TransactionPermission: "0",

          AccountTier: 3,
        }),
      };

      const response = await fetch(
        `${baseUrl}/BankOneWebAPI/api/Account/CreateCustomerAndAccount/2?authToken=${token}`,
        options
      );

      const newAccSuccessData = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      if (!newAccSuccessData.IsSuccessful) {
        return res.status(400).json({ error: newAccSuccessData.Message });
      }

      const accountInfo = await getCustomerAccountInfoByTrackingRef(
        newAccSuccessData?.TransactionTrackingRef || customer._id
      );

      const updatedCustomer = await Customer.findByIdAndUpdate(
        customer._id,
        {
          "banking.accountDetails": {
            AccessLevel: accountInfo.AccessLevel,
            AccountNumber: accountInfo.AccountNumber,
            AccountStatus: accountInfo.AccountStatus,
            AccountType: accountInfo.AccountType,
            CustomerID: accountInfo.CustomerID,
            CustomerName: accountInfo.CustomerName,
            AccountTier: accountInfo.AccountTier,
            DateCreated: accountInfo.DateCreated,
            AccountProductCode: accountProduct.ProductCode,
          },
          "banking.isAccountCreated": true,
        },
        {
          new: true,
        }
      );

      res.json(updatedCustomer);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err?.message });
    }
  }
);

// bankone balance enquiry endpoint  (Done)
router.get("/balanceEnquiry/:accountNumber", authenticateToken, (req, res) => {
  const { accountNumber } = req.params; // Get the account number from the URL parameters

  // Construct the URL with the provided account number
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Account/GetAccountByAccountNumber/2?authtoken=${token}&accountNumber=${accountNumber}&computewithdrawableBalance=false`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed

      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    });
});

router.post("/accountEnquiry", authenticateToken, async (req, res) => {
  try {
    const { accountNumber } = req.body; // Get the account number from the URL parameters

    if (!accountNumber)
      return res.status(400).json({ error: "Please Provide an Account" });

    // Construct the URL with the provided account number
    const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/Account/AccountEnquiry`;

    const { data } = await axios.post(apiUrl, {
      AccountNo: accountNumber,
      AuthenticationCode: token,
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        error?.message ||
        error ||
        "Internal Server Error BankOne Loan creation",
    });
  }
});

// get customer by id endpoint (Done)
router.get("/getCustomerById/:customerId", authenticateToken, (req, res) => {
  const { customerId } = req.params; // Get the customer ID from the URL parameters

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  // Construct the URL with the provided customer ID
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Customer/GetByCustomerID/2?authToken=${token}&CustomerID=${customerId}`;

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    });
});

// get customer by id endpoint (Done)
router.get("/getLoansById/:customerId", authenticateToken, (req, res) => {
  const { customerId } = req.params; // Get the customer ID from the URL parameters

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  // Construct the URL with the provided customer ID
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=${mfbcode}&CustomerID=${customerId}`;

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle the data as needed
      res.json(data); // Send the response to the client
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    });
});

//  Return list of all the account a customer has

router.get(
  "/getCustomerAccountsByBankoneId/:customerId",
  authenticateToken,
  async (req, res) => {
    const { customerId } = req.params;
    try {
      const response = await axios.get(
        `${baseUrl}/BankOneWebAPI/api/Account/GetAccountsByCustomerId/2?customerId=${customerId}&authToken=${token}`
      );

      return res.json(response.data);
    } catch (error) {
      console.log(error, "error");
      res.status(500).json({ error: error?.response?.data || error.message });
    }
  }
);

router.post("/accountNameEnquiry", async (req, res) => {
  const { bankCode, accountNumber } = req.body;
  try {
    const response = await axios.post(
      `${baseUrl}/thirdpartyapiservice/apiservice/Transfer/NameEnquiry`,

      {
        AccountNumber: accountNumber,

        BankCode: bankCode,

        Token: token,
      }
    );

    return res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(
  "/getUserTransactions/:accountNumber",
  authenticateToken,
  async (req, res) => {
    const { accountNumber } = req.params;
    const { fromDate, toDate, numberOfItems } = req.query;
    console.log(
      fromDate,
      toDate,
      numberOfItems,
      " fromDate, toDate, numberOfItems"
    );
    let url = `${baseUrl}/BankOneWebAPI/api/Account/GetTransactions/2?authtoken=${token}&accountNumber=${accountNumber}`;
    if (fromDate) {
      url += `&fromDate=${fromDate}`;
      if (toDate) url += `&toDate=${toDate}`;
      if (numberOfItems) url += `&numberOfItems=${numberOfItems}`;
    } else {
      url + `?numberOfItems=${numberOfItems}`;
    }

    try {
      const response = await axios.get(url);

      return res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

router.post("/transactionStatusQuery", authenticateToken, async (req, res) => {
  try {
    const { ref, date, amount } = req.body;

    // const data = await handleGetTransactionQuery({ ref, date, amount });
    const data = await handleGetTransactionQueryCore({ ref, date, amount });

    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

const formatDate = (date) => {
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

// interbank transfer endpoint
router.post(
  "/interbankTransfer/:customerId",
  authenticateToken,
  async (req, res) => {
    const { customerId } = req.params;
    const { amount, creditAccount, debitAccount, notes, creditAccountName } =
      req.body;

    if (!amount || !debitAccount || !notes || !creditAccountName) {
      return res.status(400).json({ message: "Missing Details" });
    }

    const customer = await Customer.findById(customerId);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // Define the interbank transfer request payload here
    const transferRequestPayload = {
      Amount: amount * 100,
      PayerAccountNumber: debitAccount,
      Payer: customer?.banking?.accountDetails?.CustomerName,
      ReceiverAccountNumber:
        creditAccount || customer?.disbursementaccountnumber,
      ReceiverBankCode: customer.bankcode,
      ReceiverName: creditAccountName,
      Narration: notes,
      TransactionReference: `TF${
        customer?.banking?.accountDetails?.CustomerID
      }-${new Date().getMilliseconds()}`,
      Token: token,
    };

    handleInterBankTransfer(transferRequestPayload)
      .then((data) => {
        if (data.IsSuccessFul) {
          return res.json(data);
        } else {
          return res.status(500).json({ error: "Something Went Wrong" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
      });
  }
);

// interbank transfer endpoint
router.post(
  "/repayLoanFromSalaryAcc/:loanId",
  authenticateToken,
  async (req, res) => {
    const { loanId } = req.params;
    const { repaymentScheduleId, notes } = req.body;

    try {
      const loan = await Loan.findById(loanId).populate("customer");
      if (!loan) {
        res.status(404).json({ error: "Loan Does not Exist" });
      }

      if (!loan.loanAccountNumber) {
        res.status(400).json({ error: "Loan has not been booked" });
      }
      const apiUrl = `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loan.loanAccountNumber}`;
      const { data } = await axios.get(apiUrl);

      const foundRepaymentSchedule = data.find(
        (schedule) => schedule.Id == repaymentScheduleId
      );

      if (!foundRepaymentSchedule) {
        res.status(400).json({ error: "Invalid repyment Schedule for loan" });
      }

      const { salaryaccountname, salaryaccountnumber, banking } = loan.customer;

      const { Total } = foundRepaymentSchedule;
      const reference = `TF${
        banking?.accountDetails?.CustomerID
      }-${new Date().getMilliseconds()}`;

      // Define the interbank transfer request payload here
      const transferRequestPayload = {
        Amount: Number(Total.replace(/,/g, "")) * 100,
        PayerAccountNumber: salaryaccountname,
        Payer: salaryaccountnumber,
        ReceiverAccountNumber: loan.loanAccountNumber,
        ReceiverBankCode: "090117",
        ReceiverName: banking?.accountDetails?.CustomerName.replace(/,/g, ""),
        Narration: notes,
        TransactionReference: reference,
        Token: token,
      };

      const transferRes = await handleInterBankTransfer(transferRequestPayload);

      if (transferRes.IsSuccessFul && transferRes.Status === "Successful") {
        await createOrUpdateLoanRepaymentAndCollection({
          loan,
          repaymentScheduleId,
          repaymentTotal: Number(Total.replace(/,/g, "")),
          transferRes,
        });

        return res.json(transferRes);
      } else if (
        transferRes.Status === "Pending" ||
        transferRes.ResponseCode == "91" ||
        transferRes.ResponseCode == "06"
      ) {
        const tsqRes = await handleGetTransactionQuery({
          amount: Number(Total.replace(/,/g, "")) * 100,
          date: formatDate(new Date()),
          ref: reference,
        });

        if (tsqRes.Status == "Successful") {
          await createOrUpdateLoanRepaymentAndCollection({
            loan,
            repaymentScheduleId,
            repaymentTotal: Number(Total.replace(/,/g, "")),
            transferRes,
          });

          await newRepayment.save();
        } else {
          console.log(tsqRes, "tsqRes");
          return res
            .status(500)
            .json({ error: tsqRes.ResponseMessage || "Something Went Wrong" });
        }
      } else {
        return res
          .status(500)
          .json({ error: data.ResponseMessage || "Something Went Wrong" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
    }
  }
);

// intra bank transfer endpoint (Boctrust)

// get loan by account number (Done)
router.get(
  "/getLoanByAccount/:accountNumber",
  authenticateToken,
  (req, res) => {
    const { accountNumber } = req.params; // Get the id number from the URL parameters

    // Construct the URL with the provided customer id number
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=0118&CustomerId=${accountNumber}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    };

    fetch(apiUrl, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Handle the data as needed
        res.json(data); // Send the response to the client
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
      });
  }
);

// https://staging.mybankone.com/BankOneWebAPI/api/Loan/GetLoanRepaymentSchedule/2?authToken=0552974c-0abe-4ff9-a9ef-5ee363b52b53&loanAccountNumber=00960014010003932

// get loan repayment schedule (Verify)
router.get(
  "/getLoanRepaymentSchedule/:loanAccountNumber",
  authenticateToken,
  async (req, res) => {
    const { loanAccountNumber } = req.params; // Get the loan account number from the URL parameters

    try {
      // Construct the URL with the provided loan account number
      const apiUrl = `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loanAccountNumber}`;

      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };

      const response = await fetch(apiUrl, options);

      if (!response) {
        throw new Error(
          `HTTP error! BankOne Loan repayment schedule failed. Status: ${response.status}`
        );
      }

      const data = await response.json();

      res.json(data); // Send the response to the client
    } catch (err) {
      console.error(err.response?.data);
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    }
  }
);

router.get(
  "/getLoanRepaymentSchedule/all/:customerId",
  authenticateToken,
  async (req, res) => {
    const { customerId } = req.params; // Get the loan account number from the URL parameters

    try {
      const loanAccUrl = `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=${mfbcode}&CustomerID=${customerId}`;

      const { data: loanAccounts } = await axios.get(loanAccUrl);
      // Construct the URL with the provided loan account number

      const data = await Promise.all(
        loanAccounts?.Message.map(async (item) => {
          const apiUrl = `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${item.Number}`;
          const { data: accountInfo } = await axios.get(apiUrl);
          return accountInfo;
        })
      );

      res.json(data); // Send the response to the client
    } catch (err) {
      console.error(err.response?.data, "from here");
      res.status(500).json({ error: err.message }); // Handle errors and send a response to the client
    }
  }
);

// get total loan repayment
// complete loan repayment

// loan account balance (verify!)
router.get(
  "/loanAccountBalance/:customerId",
  authenticateToken,
  async (req, res) => {
    try {
      const { customerId } = req.params; // Get the customer ID from the URL parameters

      // Construct the URL with the provided customer ID
      const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountBalance2/2?authToken=${token}&customerIDInString=${customerId}`;

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      };

      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        const res = await response.json();

        throw new Error(
          `HTTP error! BankOne Loan account Balance failed. Status: ${
            res?.Message || response.status
          }`
        );
      }

      const data = await response.json();

      // Handle the data as needed

      res.json(data); // Send the response to the client
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" }); // Handle errors and send a response to the client
    }
  }
);

// loan account statement (Done)
// http://52.168.85.231/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authtoken=6bcc4b69-e1a1-415d-bab8-0bfd3eb01b5f&accountNumber=00830013021008172&fromDate=2023-07-09&toDate=2023-09-09&numberOfItems=5

router.get("/loanAccountStatement", async (req, res) => {
  try {
    const { accountNumber, fromDate, toDate } = req.query; // Get parameters from the URL

    const data = await getLoanAccountStatement({
      accountNumber: accountNumber,
      fromDate: fromDate,
      toDate: toDate,
    });

    res.json(data.Message); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

router.get("/accountStatement", authenticateToken, async (req, res) => {
  try {
    const { accountNumber, fromDate, toDate } = req.query;
    if (!accountNumber || !fromDate || !toDate || !institutionCode) {
    }

    // Construct the URL with the provided parameters
    const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authToken=${token}&accountNumber=${loanAccountNumber}&fromDate=${fromDate}&toDate=${toDate}&institutionCode=${institutionCode}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": "d7cb51d9-aab4-46f9-a45f-f7d8ca886695",
      },
    };

    const response = await fetch(apiUrl, options);

    if (!response) {
      console.log("server error");
      throw new Error(response);
    }

    // Check content-type header to ensure the response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response format. Expected JSON.");
    }

    const data = await response.json();

    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

router.get("/commercialbanks", async (req, res) => {
  try {
    const data = await getBankoneCommercialBanks();

    res.json(data); // Send the response to the client
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err }); // Handle errors and send a response to the client
  }
});

router.get("/checkBvnExist/:bvn", async (req, res) => {
  try {
    if (!req.params.bvn) {
      return res.status(400).json({ error: "Please Provide a Valid BVN" });
    }
    const { data } = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Customer/GetCustomerByBVN/2?authToken=${token}&BVN=${req.params.bvn}`
    );

    return res.json({ message: data.IsSuccessful });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error?.response?.data?.Message || "Unable to validate bvn ",
    });
  }
});

router.get("/checkAccountValid/:bvn/:accountNumber", async (req, res) => {
  try {
    if (!req.params.bvn || !req.params.accountNumber) {
      return res
        .status(400)
        .json({ error: "Please Provide a Valid BVN and Account Number" });
    }
    const { data } = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Customer/GetCustomerByBVN/2?authToken=${token}&BVN=${req.params.bvn}`
    );

    const foundAccount = data?.Message?.Accounts?.find(
      (acc) => acc.AccountNumber === req.params.accountNumber
    );
    if (!foundAccount) {
      return res
        .status(400)
        .json({ error: "The Account number does not exist on the BVN " });
    }

    return res.json({ message: data.IsSuccessful });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to validate bvn " });
  }
});

router.put("/updateAccFromBankone", async (req, res) => {
  const { bvn, accountNumber, customerId } = req.body;
  try {
    if (!customerId || !bvn || !accountNumber) {
      return res.status(400).json({
        error: "Please Provide a Valid Customer Id, Account Number and BVN",
      });
    }

    const updatedCustomer = await handleUpdateAccFromBankone({
      bvn,
      accountNumber,
      customerId,
    });

    return res.json({ message: "Update Successfull", updatedCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Unable to validate bvn " });
  }
});

module.exports = router;
