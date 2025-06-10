const axios = require("axios");
const qs = require("qs");
const NDDMandate = require("../models/NDDMandate");
const fs = require("fs");
const FormData = require("form-data");
const {
  generateSubscriberCode,
  generateEasyPayTransactionId,
} = require("../utils/generateTransactionRef");

const https = require("https");
const moment = require("moment");
const { search } = require("fast-fuzzy");
const Settings = require("../models/Settings");
const { handleGeneratingFile } = require("../utils/generateMandateFile");

// const agent = new https.Agent({
//   rejectUnauthorized: false, // Ignore SSL errors (Not recommended for production)
//   // minVersion: "TLSv1.2", // Force TLS 1.2 or higher

//   ca: fs.readFileSync("C:/ssl/localhost-cert.pem"),
// });

const agent = new https.Agent({
  keepAlive: false,
  // ciphers: "DEFAULT:@SECLEVEL=0",
  // minVersion: "TLSv1.2", // Ensure TLS 1.2 is used
  // secureOptions: require("crypto").constants.SSL_OP_LEGACY_SERVER_CONNECT, // Optional
});

const handleNDDPaginationSearchSortFilter = (query) => {
  let { sortBy, page, limit, filter } = query;

  const queryObj = {};
  if (filter && filter != "all") {
    if (filter == "awaiting") {
      queryObj["balanceMandate.isActive"] = false;
      queryObj["debitMandate.isActive"] = false;
    } else if (filter == "created") {
      queryObj["balanceMandate.isActive"] = true;
      queryObj["debitMandate.isActive"] = true;
    } else {
      queryObj["balanceMandate.status"] = "Mandate Authorized by Bank";
      queryObj["debitMandate.status"] = "Mandate Authorized by Bank";
    }
  }

  let sortOptions = {};
  switch (sortBy) {
    case "newest":
      sortOptions.createdAt = -1;
      break;
    case "oldest":
      sortOptions.createdAt = -1;
      break;
    default:
      sortOptions.createdAt = -1; // Default: Newest first
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  return {
    sortOptions,
    queryObj,
    pageNumber,
    pageSize,
    skip,
  };
};
const handleNDDPaymentPaginationSortFilter = (query) => {
  let { sortBy, page, limit, todayRecord, startDate, endDate } = query;

  const queryObj = {};
  if (todayRecord) {
    const startOfDay = moment().startOf("day").toDate();
    const endOfDay = moment().endOf("day").toDate();

    queryObj["createdAt"] = { $gte: startOfDay, $lte: endOfDay };
  }

  if (startDate && endDate) {
    queryObj["createdAt"] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  let sortOptions = {};
  switch (sortBy) {
    case "newest":
      sortOptions.createdAt = -1;
      break;
    case "oldest":
      sortOptions.createdAt = 1;
      break;
    default:
      sortOptions.createdAt = -1; // Default: Newest first
  }

  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  return {
    sortOptions,
    queryObj,
    pageNumber,
    pageSize,
    skip,
  };
};

let authToken = "";
let easyPayAuthToken = "";

let tokenExpirationTime = 1741352583641 + 3599 * 1000;
let easyPayTokenExpirationTime = 1741352583641 + 3599 * 1000;

const tempProductCode = 1;
const tempBillerId = 1;

function getDateRange(noOfMonths) {
  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + noOfMonths);

  // Format as YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

function isTokenExpired(fromEasyPay) {
  return fromEasyPay
    ? !easyPayAuthToken || Date.now() >= easyPayTokenExpirationTime
    : !authToken || Date.now() >= tokenExpirationTime;
}

const getAccessToken = async (fromEasyPay) => {
  const payload = qs.stringify({
    client_id: fromEasyPay
      ? process.env.NIBSS_EASYPAY_CLIENT_ID
      : process.env.NIBSS_DD_CLIENT_ID,
    scope: fromEasyPay
      ? `${process.env.NIBSS_EASYPAY_CLIENT_ID}/.default`
      : `${process.env.NIBSS_DD_CLIENT_ID}/.default`,
    client_secret: fromEasyPay
      ? process.env.NIBSS_EASYPAY_CLIENT_SECRET
      : process.env.NIBSS_DD_CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  if (isTokenExpired(fromEasyPay)) {
    const { data } = await axios.post(
      `${process.env.NIBSS_BASE_URL}/v2/reset`,
      payload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apikey: fromEasyPay
            ? process.env.NIBSS_EASYPAY_API_KEY
            : process.env.NIBSS_DD_API_KEY,
        },

        httpsAgent: agent,
      }
    );

    if (fromEasyPay) {
      easyPayAuthToken = data.access_token;
      easyPayTokenExpirationTime = Date.now() + data.expires_in * 1000;
    } else {
      authToken = data.access_token;
      tokenExpirationTime = Date.now() + data.expires_in * 1000;
    }

    return data;
  } else {
    console.log("Running Else");
    return { access_token: fromEasyPay ? easyPayAuthToken : authToken };
  }
};

const createDebitMandateOnly = async (mandateId) => {
  const foundMandate = await NDDMandate.findById(mandateId)
    .populate("loan")
    .populate("customer");

  if (!foundMandate) {
    throw new Error("Mandate with id:" + mandateId + " Does not exist");
  }

  const { endDate, startDate } = getDateRange(foundMandate.loan.numberofmonth);

  const formData = new FormData();

  const subscriberCode = generateSubscriberCode();

  formData.append("accountNumber", foundMandate.customer.salaryaccountnumber);
  // formData.append("accountNumber", "0112345678");
  formData.append("productid", process.env.NIBSS_PRODUCT_ID);
 
  formData.append("bankCode", foundMandate.customer.bankcode);
  // formData.append("bankCode", "998");
  formData.append(
    "payerName",
    `${foundMandate.customer.salaryaccountname.trim()}`
  );
  formData.append("payerAddress", foundMandate.customer.houseaddress);
  formData.append(
    "accountName",
    `${foundMandate.customer.salaryaccountname.trim()}`
  );
  formData.append("amount", Number(foundMandate.loan.loantotalrepayment));
  formData.append("Narration", "Loan Repayment");
  formData.append("phoneNumber", foundMandate.customer.phonenumber);
  formData.append("payerEmail", foundMandate.customer.email);
  formData.append("billerid", process.env.NIBSS_BILLER_ID);
  formData.append("SubscriberCode", subscriberCode);
  formData.append("StartDate", startDate);
  formData.append("endDate", endDate);

  const filePath = `public/filesUpload/${foundMandate.customer.signature}`;
  const settings = await Settings.findOne({});
  const witnessSignature = `uploads/${settings.mandateWitnessSignature}`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Signature not found: ${filePath}`);
  }
  if (!fs.existsSync(witnessSignature)) {
    throw new Error(`Witness Signature not found: ${witnessSignature}`);
  }

  const blob = await handleGeneratingFile({
    name: foundMandate.customer.salaryaccountname.trim(),
    address: foundMandate.customer.houseaddress,
    bankCode: foundMandate.customer.bankcode,
    branch: foundMandate.customer?.salarybankbranch || foundMandate.customer.branch || "Lagos",
    accountNumber: foundMandate.customer.salaryaccountnumber,
    amount: Number(foundMandate.loan.loantotalrepayment),
    startDate,
    endDate, 
    customerSignature: filePath,
    witnessName:  settings.mandateWitnessName ,
    witnessAddress: settings.mandateWitnessAddress,
    witnessOccupation: settings.mandateWitnessOcupation,
    witnessSignature,
  });
  const arrayBuffer = await blob.arrayBuffer(); // Convert Blob to ArrayBuffer
 
  const pdfBuffer = Buffer.from(arrayBuffer);


  formData.append("MandateImageFile", pdfBuffer, "mandate.pdf");

  const { access_token } = await getAccessToken();

  const { data: debitMandate } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/CreateMandateDirectDebit`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  foundMandate.endDate = endDate;
  foundMandate.startDate = startDate;
  foundMandate.debitMandate.subscriberCode = subscriberCode;
  foundMandate.debitMandate.code = debitMandate.data.mandateCode;

  await foundMandate.save();

  return {
    debitMandate: debitMandate.data,
  };
};

const createBalanceMandateOnly = async (mandateId) => {
  const foundMandate = await NDDMandate.findById(mandateId)
    .populate("loan")
    .populate("customer");

  if (!foundMandate) {
    throw new Error("Mandate with id:" + mandateId + " Does not exist");
  }

  const { endDate, startDate } = getDateRange(foundMandate.loan.numberofmonth);

  const formData = new FormData();

  const subscriberCode = generateSubscriberCode();

  formData.append("accountNumber", foundMandate.customer.salaryaccountnumber);
  // formData.append("accountNumber", "0112345678");
  formData.append("productid", process.env.NIBSS_PRODUCT_ID);
  
  formData.append("bankCode", foundMandate.customer.bankcode);
  // formData.append("bankCode", "998");
  formData.append(
    "payerName",
    `${foundMandate.customer.salaryaccountname.trim()}`
  );
  formData.append("payerAddress", foundMandate.customer.houseaddress);
  formData.append(
    "accountName",
    `${foundMandate.customer.salaryaccountname.trim()}`
  );
  formData.append("amount", Number(foundMandate.loan.loantotalrepayment));
  formData.append("Narration", "Loan Repayment");
  formData.append("phoneNumber", foundMandate.customer.phonenumber);
  formData.append("payerEmail", foundMandate.customer.email);
  formData.append("billerid", process.env.NIBSS_BILLER_ID);
  formData.append("SubscriberCode", subscriberCode);
  formData.append("StartDate", startDate);
  formData.append("endDate", endDate);

  const filePath = `public/filesUpload/${foundMandate.customer.signature}`;
  const settings = await Settings.findOne({});
  const witnessSignature = `uploads/${settings.mandateWitnessSignature}`;

  if (!fs.existsSync(filePath)) {
    throw new Error(`Signature not found: ${filePath}`);
  }
  if (!fs.existsSync(witnessSignature)) {
    throw new Error(`Witness Signature not found: ${filePath}`);
  }

 
  const blob = await handleGeneratingFile({
    name: foundMandate.customer.salaryaccountname.trim(),
    address: foundMandate.customer.houseaddress,
    bankCode: foundMandate.customer.bankcode,
    branch: foundMandate.customer?.salarybankbranch || foundMandate.customer.branch || "Lagos",
    accountNumber: foundMandate.customer.salaryaccountnumber,
    amount: Number(foundMandate.loan.loantotalrepayment),
    startDate,
    endDate, 
    customerSignature: filePath,
    witnessName:  settings.mandateWitnessName ,
    witnessAddress: settings.mandateWitnessAddress,
    witnessOccupation: settings.mandateWitnessOcupation,
    witnessSignature,
  });

  const arrayBuffer = await blob.arrayBuffer(); // Convert Blob to ArrayBuffer
  const pdfBuffer = Buffer.from(arrayBuffer);

  formData.append("MandateImageFile", pdfBuffer, "mandate.pdf");


  const { access_token } = await getAccessToken();

  const { data: balanceMandate } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/CreateMandateBalanceEnquiry`,
    formData,
    {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${access_token}`,
        Connection: "close",
      },
      httpsAgent: agent,
    }
  );

  foundMandate.balanceMandate.subscriberCode = subscriberCode;
  foundMandate.balanceMandate.code = balanceMandate.data.mandateCode;

  await foundMandate.save();

  return {
    balanceMandate: balanceMandate.data,
  };
};

const checkMandateStatus = async (mandateCode) => {
  const { access_token } = await getAccessToken();
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/MandateStatus?MandateCode=${mandateCode}`,
    {},
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  if (data.responseCode == "00") {
    return data.data;
  } else {
    throw new Error("Something went wrong");
  }
};

const approvedMandateByBiller = async (mandateCode) => {
  const { access_token } = await getAccessToken();
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/BillersProcessMandate`,
    {
      billerId: process.env.NIBSS_BILLER_ID,
      mandateCode: mandateCode,
      workflowStatus: 2,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  return data.data;
};

const balanceEnquiry = async ({
  targetAccountName,
  mandateCode,
  targetAccountNumber,
  targetBankVerificationNumber,
  destinationInstitutionCode,
}) => {
  const transactionId = generateEasyPayTransactionId(
    process.env.BOC_NIBSS_INSTITUTION_CODE
  );

  // const payload = {
  //   channelCode: "1",
  //   targetAccountName: "vee Test" || targetAccountName,
  //   targetAccountNumber: "0112345678" || targetAccountNumber,
  //   targetBankVerificationNumber: "33000000032" || targetBankVerificationNumber,
  //   authorizationCode: "MA-0112345678-2022315-53097" || mandateCode,
  //   destinationInstitutionCode: "999998" || destinationInstitutionCode,
  //   billerId:
  //     "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59" || process.env.NIBSS_BILLER_ID,
  //   transactionId,
  // };
  const payload = {
    channelCode: "1",
    targetAccountName: targetAccountName,
    targetAccountNumber: targetAccountNumber,
    targetBankVerificationNumber: targetBankVerificationNumber,
    authorizationCode: mandateCode,
    destinationInstitutionCode: destinationInstitutionCode,
    billerId: process.env.NIBSS_BILLER_ID,
    transactionId,
  };

  const { access_token } = await getAccessToken(true);

  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/balanceenquiry`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  return data;
};

const nameEnquiry = async ({ accountNumber, destinationInstitutionCode }) => {
  const transactionId = generateEasyPayTransactionId(
    process.env.BOC_NIBSS_INSTITUTION_CODE
  );
  // const payload = {
  //   accountNumber: "0112345678",
  //   channelCode: "1",
  //   destinationInstitutionCode: `999998`,
  //   transactionId,
  // };
  const payload = {
    accountNumber,
    channelCode: "1",
    destinationInstitutionCode,
    transactionId,
  };

  const { access_token } = await getAccessToken(true);
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/nameenquiry`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  return data;
};

const fundTransfer = async ({
  beneficiaryAccountName,
  beneficiaryAccountNumber,
  beneficiaryBankVerificationNumber,
  amount,
  originatorAccountName,
  originatorAccountNumber,
  originatorKYCLevel,
  originatorBankVerificationNumber,
  mandateReferenceNumber,
  sourceInstitutionCode,
  nameEnquiryRef,
  transactionLocation,
  transactionId,
}) => {
  const paymentRef = generateEasyPayTransactionId(
    process.env.BOC_NIBSS_INSTITUTION_CODE
  );
  const payload = {
    amount,
    beneficiaryAccountName,
    beneficiaryAccountNumber,
    beneficiaryBankVerificationNumber,
    beneficiaryKYCLevel: 1,
    channelCode: 1,
    originatorAccountName,
    originatorAccountNumber,
    originatorKYCLevel,
    mandateReferenceNumber,
    paymentReference: paymentRef,
    transactionLocation,
    originatorNarration: `Payment from ${originatorAccountNumber} to ${beneficiaryAccountNumber}`,
    beneficiaryNarration: `Payment to ${beneficiaryAccountNumber} from ${originatorAccountNumber}`,
    billerId: process.env.NIBSS_BILLER_ID,
    destinationInstitutionCode: process.env.BOC_NIBSS_INSTITUTION_CODE,
    sourceInstitutionCode,
    transactionId,
    originatorBankVerificationNumber,
    nameEnquiryRef,
    InitiatorAccountName: originatorAccountName,
    InitiatorAccountNumber: originatorAccountNumber,
  };

  // const payload = {
  //   amount: "100",
  //   beneficiaryAccountName: "Ake Mobolaji Temabo",
  //   beneficiaryAccountNumber: "1780004070",
  //   beneficiaryBankVerificationNumber: "22000000026",
  //   beneficiaryKYCLevel: "1",
  //   channelCode: "1",
  //   originatorAccountName: "vee Test",
  //   originatorAccountNumber: "0112345678",
  //   originatorKYCLevel: "1",
  //   mandateReferenceNumber: "MA-0112345678-2022315-53097",
  //   paymentReference: "1/999999191106195503191106195503/6015007956/0231116887",
  //   transactionLocation: "1.38716,3.05117",
  //   originatorNarration: "Payment from 0112345678 to 1780004070",
  //   beneficiaryNarration: "Payment to 0112345678 from 1780004070",
  //   billerId: "ADC19BDC-7D3A-4C00-4F7B-08DA06684F59",
  //   destinationInstitutionCode: "999998",
  //   sourceInstitutionCode: "999998",
  //   transactionId: paymentRef,
  //   originatorBankVerificationNumber: "33000000032",
  //   nameEnquiryRef: "999999191106195503191106195503",
  //   InitiatorAccountName: "vee Test",
  //   InitiatorAccountNumber: "0112345678",
  // };
  const { access_token } = await getAccessToken(true);
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/fundstransfer`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  return data;
};

const transactionStatusQuery = async (transactionId) => {
  const { access_token } = await getAccessToken(true);
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/tsq`,
    {
      transactionId,
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  return data;
};

const checkAndUpdateMandateStatus = async (mandateId, type) => {
  const foundMandate = await NDDMandate.findById(mandateId);

  const data = await checkMandateStatus(
    type == "balance"
      ? foundMandate.balanceMandate.code
      : foundMandate.debitMandate.code
  );

  let updatePayload = {};

  if (type === "balance") {
    updatePayload["balanceMandate.isActive"] =
      data.mandateStatus === "Active" ? true : false;
    updatePayload["balanceMandate.status"] = data.workflowStatus;
  } else {
    updatePayload["debitMandate.isActive"] =
      data.mandateStatus === "Active" ? true : false;
    updatePayload["debitMandate.status"] = data.workflowStatus;
  }

  await NDDMandate.findByIdAndUpdate(mandateId, updatePayload);
  return data;
};

const stopMandate = async (mandateId, type) => {
  const foundMandate = await NDDMandate.findById(mandateId).populate(
    "customer"
  );

  const { access_token } = await getAccessToken();

  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/UpdateMandateStatus`,
    {
      MandateCode:
        type === "balance"
          ? foundMandate.balanceMandate.code
          : foundMandate.debitMandate.code,
      BillerID: process.env.NIBSS_BILLER_ID,
      ProductID: process.env.NIBSS_PRODUCT_ID,
      AccountNumber: foundMandate.customer.salaryaccountnumber,
      MandateStatus: "2",
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  let updatePayload = {};

  if (type === "balance") {
    updatePayload["balanceMandate.isActive"] = false;
  } else {
    updatePayload["debitMandate.isActive"] = false;
  }

  await NDDMandate.findByIdAndUpdate(mandateId, updatePayload);
  return data;
};

const restartMandate = async (mandateId, type) => {
  const foundMandate = await NDDMandate.findById(mandateId).populate(
    "customer"
  );

  const { access_token } = await getAccessToken();

  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/MandateRequest/UpdateMandateStatus`,
    {
      MandateCode:
        type === "balance"
          ? foundMandate.balanceMandate.code
          : foundMandate.debitMandate.code,
      BillerID: process.env.NIBSS_BILLER_ID,
      ProductID: process.env.NIBSS_PRODUCT_ID,
      AccountNumber: foundMandate.customer.salaryaccountnumber,
      MandateStatus: "1",
    },
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },

      httpsAgent: agent,
    }
  );

  let updatePayload = {};

  if (type === "balance") {
    updatePayload["balanceMandate.isActive"] = true;
  } else {
    updatePayload["debitMandate.isActive"] = true;
  }

  await NDDMandate.findByIdAndUpdate(mandateId, updatePayload);
  return data;
};

async function callTSQ(transactionId, attempt = 1) {
  try {
    const { access_token } = await getAccessToken(true);

    const response = await axios.post(
      `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/tsq`,
      {
        transactionId,
      },
      {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );

    const responseCode = response.data.responseCode;

    if (responseCode === "00") {
      return response.data;
    } else if (responseCode === "25") {
      console.log(`Unable to locate transaction record (Response Code: 25).`);

      if (attempt < 3) {
        console.log(`Retrying TSQ in 60 seconds... (Attempt ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 60 seconds
        return callTSQ(transactionId, attempt + 1);
      } else {
        console.log(
          `TSQ failed 3 times. Transaction ${transactionId} can be reversed.`
        );
        return { status: "reversal_allowed" };
      }
    } else {
      console.log(`Unexpected response code: ${responseCode}`);
      return response.data;
    }
  } catch (error) {
    console.error("Error calling TSQ:", error.message);
    return { status: "error", message: error.message };
  }
}

const getInstitutions = async () => {
  const { access_token } = await getAccessToken(true);

  const response = await fetch(
    `${process.env.NIBSS_BASE_URL}/nipservice/v1/nip/institutions`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return data;
};

const getEasyPayInstitutionCode = async (bankName) => {
  const institutions = await getInstitutions();
  console.log(institutions[0], "sajaksdh");

  const institutionMap = new Map(
    institutions.map((bank) => [
      bank.institutionName.toLowerCase(),
      bank.institutionCode,
    ])
  );

  const fuzzyMatcher = search(
    bankName,
    institutions.map((bank) => bank.institutionName)
  );

  const nameMatch = fuzzyMatcher[0];

  console.log(nameMatch, "nameMatch");

  const institutionCode = institutionMap.get(nameMatch.toLowerCase());
  return institutionCode;
};

const createBiller = async (payload) => {
  const { access_token } = await getAccessToken();
  console.log(access_token, "access_token");
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/Biller/CreateBiller`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${access_token.trim()}`,
      },
    }
  );

  return data;
};

const createBillerProduct = async (payload) => {
  const { access_token } = await getAccessToken();
  const { data } = await axios.post(
    `${process.env.NIBSS_BASE_URL}/ndd/api/Biller/CreateProduct`,
    payload,
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return data;
};

module.exports = {
  handleNDDPaginationSearchSortFilter,
  handleNDDPaymentPaginationSortFilter,
  callTSQ,
  getAccessToken,
  createDebitMandateOnly,
  createBalanceMandateOnly,
  checkMandateStatus,
  checkAndUpdateMandateStatus,
  approvedMandateByBiller,
  balanceEnquiry,
  nameEnquiry,
  fundTransfer,
  transactionStatusQuery,
  stopMandate,
  restartMandate,
  getInstitutions,
  getEasyPayInstitutionCode,
  createBiller,
  createBillerProduct,
  getDateRange
};
