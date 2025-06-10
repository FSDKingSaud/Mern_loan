const express = require("express");
const router = express.Router();
const NDDMandate = require("../models/NDDMandate");
const NDDPayment = require("../models/NDDPayment");
const {
  balanceEnquiry,
  nameEnquiry,
  approvedMandateByBiller,

  stopMandate,
  restartMandate,
  createDebitAndBalanceMandate,
  createDebitMandateOnly,
  createBalanceMandateOnly,
  checkAndUpdateMandateStatus,
  handleNDDPaginationSearchSortFilter,
  fundTransfer,
  handleNDDPaymentPaginationSortFilter,
  callTSQ,
  getAccessToken,
  getInstitutions,
  createBiller,
  createBillerProduct,
  getEasyPayInstitutionCode,
  getDateRange,
} = require("../services/nibss.service");
const {
  generateEasyPayTransactionId,
} = require("../utils/generateTransactionRef");
const {
  handleInterBankTransfer,
  handleGetTransactionQuery,
  getBankoneCommercialBanks,
} = require("../services/bankoneOperationsServices");

const {
  createOrUpdateLoanRepaymentAndCollection,
} = require("../services/loanServices.service");
const { default: axios } = require("axios");
const { getErrorText } = require("../utils/getNibssError");
const { handleGeneratingFile } = require("../utils/generateMandateFile");

// Get all NDD Mandates
router.get("/", async (req, res) => {
  try {
    const { sortOptions, queryObj, pageNumber, pageSize, skip } =
      handleNDDPaginationSearchSortFilter(req.query);

    let nddMadates = [];
    if (req.query.search) {
      nddMadates = await NDDMandate.find(queryObj)
        .populate("loan")
        .populate({
          path: "customer",
          match: {
            $or: [
              { firstname: { $regex: req.query.search, $options: "i" } },
              { lastname: { $regex: req.query.search, $options: "i" } },
            ],
          },
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      nddMadates = nddMadates.filter((mandate) => mandate.customer);
    } else {
      nddMadates = await NDDMandate.find(queryObj)
        .populate("loan")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);
    }

    const totalMandates = nddMadates.length;
    const totalPages = Math.ceil(totalMandates / pageSize) || 1;

    return res.status(200).json({
      mandates: nddMadates,
      totalMandates,
      page: pageNumber,
      totalPages,
      limit: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/debit-transactions", async (req, res) => {
  try {
    const { sortOptions, queryObj, pageNumber, pageSize, skip } =
      handleNDDPaymentPaginationSortFilter(req.query);

    let nddDebitTransaction = [];
    if (req.query.search) {
      nddDebitTransaction = await NDDPayment.find(queryObj)
        .populate({
          path: "mandate",
          populate: [
            {
              path: "customer",
              model: "Customer",
              match: {
                $or: [
                  { firstname: { $regex: req.query.search, $options: "i" } },
                  { lastname: { $regex: req.query.search, $options: "i" } },
                ],
              },
            },
            { path: "loan", model: "Loan" },
          ],
        })

        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      nddDebitTransaction = nddDebitTransaction.filter(
        (transaction) => transaction.mandate?.customer
      );
    } else {
      nddDebitTransaction = await NDDPayment.find(queryObj)
        .populate({
          path: "mandate",
          populate: [
            { path: "customer", model: "Customer" },
            { path: "loan", model: "Loan" },
          ],
        })

        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);
    }

    const totalPayments = nddDebitTransaction.length;
    const totalPages = Math.ceil(totalPayments / pageSize) || 1;

    return res.status(200).json({
      nddDebitTransaction,
      totalPayments,
      page: pageNumber,
      totalPages,
      limit: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/collection-summary", async (req, res) => {
  try {
    const searchQuery = req.query.search;
    const sortOrder = req.query.sortOrder === "oldest" ? 1 : -1;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const matchStage = searchQuery
      ? {
          $match: {
            $or: [
              { "customer.firstname": { $regex: searchQuery, $options: "i" } },
              { "customer.lastname": { $regex: searchQuery, $options: "i" } },
            ],
          },
        }
      : null; // Skip if no search query

    const pipeline = [
      {
        $group: { _id: "$mandate", amountDebited: { $sum: "$amount" } },
      },
      {
        $lookup: {
          from: "nddmandate",
          localField: "_id",
          foreignField: "_id",
          as: "mandate",
        },
      },
      { $unwind: "$mandate" },
      {
        $lookup: {
          from: "loans",
          localField: "mandate.loan",
          foreignField: "_id",
          as: "loan",
        },
      },
      { $unwind: "$loan" },
      {
        $lookup: {
          from: "customers", // Assuming your customer collection is named "customers"
          localField: "mandate.customer",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
    ];

    if (matchStage) {
      pipeline.push(matchStage);
    }

    pipeline.push(
      { $sort: { createdAt: sortOrder } },
      { $skip: skip },
      { $limit: pageSize }
    );

    const nddDebitTransaction = await NDDPayment.aggregate(pipeline);

    const totalPayments = nddDebitTransaction.length;
    const totalPages = Math.ceil(totalPayments / pageSize) || 1;

    return res.status(200).json({
      nddDebitTransaction,
      totalPayments,
      page,
      totalPages,
      limit: pageSize,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;

    const singleMandate = await NDDMandate.findOne({
      _id: mandateId,
    })
      .populate("customer")
      .populate("loan");
    return res.status(200).json(singleMandate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/by-loanId/:loanId", async (req, res) => {
  try {
    const { loanId } = req.params;

    const singleMandate = await NDDMandate.findOne({
      loan: loanId,
    })
      .populate("customer")
      .populate("loan");

    return res.status(200).json(singleMandate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { mandateId } = req.body;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const { debitMandate, balanceMandate } = await createDebitAndBalanceMandate(
      mandateId
    );

    await approvedMandateByBiller(debitMandate.mandateCode);
    await approvedMandateByBiller(balanceMandate.mandateCode);

    await checkAndUpdateMandateStatus(mandateId, "balance");
    await checkAndUpdateMandateStatus(mandateId, "debit");
    return res.status(200).json({ debitMandate, balanceMandate });
  } catch (error) {
    return res
      .status(error?.status || 500)
      .json({ error: error?.response?.data?.message || error.message });
  }
});

router.post("/debit-mandate", async (req, res) => {
  try {
    const { mandateId } = req.body;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { debitMandate } = await createDebitMandateOnly(mandateId);

    await approvedMandateByBiller(debitMandate.mandateCode);

    await checkAndUpdateMandateStatus(mandateId, "debit");
    return res.status(200).json({ debitMandate });
  } catch (error) {
    console.log(error.response?.data?.errors, "debit error");
    console.log(error, "debit error");
    return res
      .status(error?.status || 500)
      .json({ error: error?.response?.data?.message || error.message });
  }
});

router.post("/balance-mandate", async (req, res) => {
  try {
    const { mandateId } = req.body;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const { balanceMandate } = await createBalanceMandateOnly(mandateId);

    await approvedMandateByBiller(balanceMandate.mandateCode);

    await checkAndUpdateMandateStatus(mandateId, "balance");

    return res.status(200).json({ balanceMandate });
  } catch (error) {
    console.log(error, "balance error");
    return res
      .status(error?.status || 500)
      .json({ error: error?.response?.data?.message || error.message });
  }
});

router.post("/stop-mandate/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await stopMandate(mandateId, "balance");
    await stopMandate(mandateId, "debit");

    return res.status(200).json({ message: "Mandate Updated" });
  } catch (error) {
    console.log(error, "jhkqjhweqkjw");
    console.log(error?.response?.data, "Errororororoororo");
    return res
      .status(500)
      .json({ error: error?.response?.data?.message || error?.message });
  }
});

router.post("/restart-mandate/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await restartMandate(mandateId, "balance");
    // await restartMandate(mandateId, "debit");

    return res.status(200).json({ message: "Mandate Updated" });
  } catch (error) {
    console.log(error?.response?.data, "Errororororoororo");
    return res
      .status(500)
      .json({ error: error?.response?.data?.message || error?.message });
  }
});

router.get("/balance-enquiry/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;

    const {
      targetAccountNumber,
      targetBankVerificationNumber,
      targetAccountName,
      destinationInstitutionCode,
    } = req.query;

    if (
      !targetAccountNumber ||
      !targetBankVerificationNumber ||
      !targetAccountName ||
      !destinationInstitutionCode
    ) {
      return res.status(400).json({ error: "Please send all query params" });
    }

    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const foundMandate = await NDDMandate.findById(mandateId);

    const data = await balanceEnquiry({
      targetAccountName,
      mandateCode: foundMandate.balanceMandate.code,
      targetAccountNumber,
      targetBankVerificationNumber,
      destinationInstitutionCode,
    });

    if (data.responseCode == "00") {
      return res.status(200).json(data);
    } else {
      const error = getErrorText(data?.responseCode);
      return res.status(500).json({
        error,
      });
    }
  } catch (error) {
    console.log(error.response);
    return res
      .status(500)
      .json({ error: error?.response?.data?.message || error.message });
  }
});

router.get("/name-enquiry/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const foundMandate = await NDDMandate.findById(mandateId).populate(
      "customer"
    );

    const bankoneCommercialBanks = await getBankoneCommercialBanks();
    const bankName = bankoneCommercialBanks?.find(
      (bank) => bank.Code == foundMandate.customer.bankcode
    )?.Name;

    const destinationInstitutionCode = await getEasyPayInstitutionCode(
      bankName
    );

    const data = await nameEnquiry({
      accountNumber: foundMandate.customer.salaryaccountnumber,
      destinationInstitutionCode,
    });

    if (data?.responseCode == "00") {
      return res.status(200).json(data);
    } else {
      const error = getErrorText(data?.responseCode);
      return res.status(500).json({
        error,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error?.response?.data?.message || error.message });
  }
});

router.post("/perform-debit", async (req, res) => {
  try {
    const {
      mandateId,
      amount,
      originatorKYCLevel,
      nameEnquiryRef,
      accountName,
      accountNumber,
      originatorBankVerificationNumber,
      transactionLocation,
      repaymentIds,
    } = req.body;

    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const foundMandate = await NDDMandate.findById(mandateId)
      .populate("loan")
      .populate("customer");

    const transactionId = generateEasyPayTransactionId(
      process.env.BOC_NIBSS_INSTITUTION_CODE
    );

    const sourceInstitutionCode = getEasyPayInstitutionCode();

    const data = await fundTransfer({
      beneficiaryAccountNumber: foundMandate.loan.loanAccountNumber,
      beneficiaryAccountName:
        foundMandate.customer.banking.accountDetails.CustomerName,
      beneficiaryBankVerificationNumber: foundMandate.customer.bvnnumber,
      amount,
      originatorAccountName: accountName,
      originatorAccountNumber: accountNumber,
      originatorKYCLevel,
      originatorBankVerificationNumber,
      mandateReferenceNumber: foundMandate.debitMandate.code,
      // sourceInstitutionCode: `999${foundMandate.customer.bankcode}`,
      sourceInstitutionCode: `999998`,
      nameEnquiryRef,
      transactionLocation,
      transactionId,
    });

    if (!data) {
      const tData = await callTSQ(transactionId);
      if (tData?.responseCode == "00") {
        await NDDPayment.create({
          mandate: mandateId,
          transactionId: data.transactionId,
          nameEnquiryRef,
          amount: amount,
          transactionLocation,
          paymentReference: data.paymentReference,
          status: tData?.responseCode == "00" ? "Success" : "Failed",
          meta: {
            repaymentIds,
          },
        });
      } else {
        const error = getErrorText(tData?.responseCode);
        return res.status(500).json({
          error,
        });
      }
    } else if (data && data.responseCode == "00") {
      await NDDPayment.create({
        mandate: mandateId,
        transactionId: data.transactionId,
        nameEnquiryRef,
        amount: amount,
        transactionLocation,
        paymentReference: data.paymentReference,
        status: data?.responseCode == "00" ? "Success" : "Failed",
        meta: {
          repaymentIds,
        },
      });
    } else {
      const error = getErrorText(data?.responseCode);
      return res.status(500).json({
        error,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.log(error, "error");

    const errorText = getErrorText(error?.response?.data.responseCode);
    return res.status(500).json({
      error: errorText,
    });
  }
});

router.post("/check-update-mandate-status/:mandateId", async (req, res) => {
  try {
    const { mandateId } = req.params;
    if (!mandateId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    await checkAndUpdateMandateStatus(mandateId, "balance");
    await checkAndUpdateMandateStatus(mandateId, "debit");

    const foundMandate = await NDDMandate.findById(mandateId);

    return res.status(200).json(foundMandate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/interbankTransfer/:paymentId", async (req, res) => {
  try {
    const token = process.env.BANKONE_TOKEN;
    const { paymentId } = req.params;

    const payment = await NDDPayment.findById(paymentId).populate({
      path: "mandate",
      populate: [
        { path: "customer", model: "Customer" },
        { path: "loan", model: "Loan" },
      ],
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Define the interbank transfer request payload here
    const transferRequestPayload = {
      Amount: payment.amount * 100,
      PayerAccountNumber: process.env.BOC_NIBSS_COLLECTION_ACC,
      Payer: process.env.BOC_NIBSS_COLLECTION_ACC_NAME,
      ReceiverAccountNumber: payment.mandate.loan.loanAccountNumber,
      ReceiverBankCode: "090117",
      ReceiverName: `${payment.mandate.customer.firstname} ${payment.mandate.customer.lastname}`,
      Narration: `Transfer from  ${process.env.BOC_NIBSS_COLLECTION_ACC} to ${payment.mandate.loan.loanAccountNumber} `,
      TransactionReference: `TF${
        payment.mandate.customer?.banking?.accountDetails?.CustomerID
      }-${new Date().getMilliseconds()}`,
      Token: token,
    };

    const transferRes = await handleInterBankTransfer(transferRequestPayload);

    if (transferRes.IsSuccessFul && transferRes.Status === "Successful") {
      await NDDPayment.findOneAndUpdate(
        {
          _id: paymentId,
        },
        {
          hasBalancedLoanAcc: true,
        }
      );

      await createOrUpdateLoanRepaymentAndCollection({
        loan,
        repaymentScheduleIds: payment.meta.repaymentIds,
        repaymentTotal: payment.amount,
        transferRes,
      });

      await newRepayment.save();

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
          repaymentScheduleIds: payment.meta.repaymentIds,
          repaymentTotal: payment.amount,
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
        .json({ error: transferRes.ResponseMessage || "Something Went Wrong" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/ndd-mandate-test", async (req, res) => {
  try {
    const { loan, customer } = req.body;

    const mandate = await NDDMandate.findOne({
      loan,
      customer,
    });

    if (mandate) {
      return res.status(400).json({ error: "Exist" });
    }

    const foundMandate = await NDDMandate.create({
      loan,
      customer,
    });

    return res.status(200).json(foundMandate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/ndd-payment-test", async (req, res) => {
  try {
    const payment = await NDDPayment.create(req.body);

    return res.status(200).json(payment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.post("/ndd/gettoken-test", async (req, res) => {
  try {
    const data = await getAccessToken();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/ndd/get-institutions", async (req, res) => {
  try {
    const data = await getInstitutions();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/easypay/get-institutions", async (req, res) => {
  try {
    const data = await getInstitutions();

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/ndd/create-biller", async (req, res) => {
  try {
    const {
      rcNumber,
      name,
      address,
      email,
      phoneNumber,
      accountNumber,
      accountName,
      bankCode,
      mandateStatusNotificationUrl,
    } = req.body;

    if (
      !rcNumber ||
      !name ||
      !address ||
      !email ||
      !phoneNumber ||
      !accountNumber ||
      !accountName ||
      !bankCode ||
      !mandateStatusNotificationUrl
    ) {
      return res.status(400).json({ error: "Provide all fields" });
    }

    const data = await createBiller(req.body);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post("/ndd/create-biller-product", async (req, res) => {
  try {
    const { billerId, productName } = req.body;

    if (!billerId || !productName) {
      return res.status(400).json({ error: "Provide all fields" });
    }

    const data = await createBillerProduct(req.body);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});



module.exports = router;
