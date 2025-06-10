const { default: axios } = require("axios");
const Product = require("../models/Product");

const getCustomerAccountInfoByTrackingRef = async (trackinRef) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  };

  const res = await fetch(
    `${baseUrl}/BankOneWebAPI/api/Account/GetAccountByTransactionTrackingRef/2?authToken=${token}&transactionTrackingRef=${trackinRef}`,
    options
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data);
  }

  return data;
};

const handleInterBankTransfer = async (transferRequestPayload) => {
  // Construct the URL for interbank transfer

  const baseUrl = process.env.BANKONE_BASE_URL;

  const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/Transfer/InterBankTransfer`;

  try {
    const response = await axios.post(apiUrl, transferRequestPayload);

    return response.data;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.response?.statusText || error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getAccountProduct = async ({
  careertype,
  deductions,
  otheremployername,
}) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;

  try {
    // const customerAccountProductCode = 102;
    const customerAccountProductCode =
      careertype == "government employee" &&
      deductions == "ippis" &&
      !otheremployername
        ? 107
        : careertype !== "business owner" && otheremployername
        ? 200
        : 201;

    const response = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${customerAccountProductCode}`
    );

    return response?.data;
  } catch (error) {
    console.log(error);
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.response?.statusText || error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getLoanProduct = async ({
  careertype,
  deductions,
  otheremployername,
  loanproduct,
}) => {
  // const baseUrl = process.env.BANKONE_BASE_URL;
  // const token = process.env.BANKONE_TOKEN;

  // * IPPIS Loan: 306
  // * ROSCA Loan: 303
  // * Salary Loan: 301
  // * Term Loan: 305

  try {
    // const customerAccountProductCode = 401;
    const customerAccountProductCode =
      careertype == "government employee" &&
      deductions == "ippis" &&
      !otheremployername
        ? 306
        : loanproduct;

    // const { data } = await axios.get(
    //   `${baseUrl}/BankOneWebAPI/api/Product/GetByCode/2?authToken=${token}&productCode=${customerAccountProductCode}`
    // );

    // get product
    let product = await Product.findOne({
      productCode: customerAccountProductCode,
    });

    return product;
  } catch (error) {
    console.log(
      "There was a problem with the fetch operation:",
      error.response.statusText
    );

    throw error?.response?.statusText || error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getLoanByCustomerId = async (customerId) => {
  // Construct the URL for interbank transfer

  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;

  try {
    const { data } = await axios.get(
      `${baseUrl}/BankOneWebAPI/api/Loan/GetLoansByCustomerId/2?authToken=${token}&institutionCode=${
        process.env.BANKONE_MFB_CODE
      }&CustomerId=${customerId}&addStartAndEndDate=${true}`
    );

    return data.Message;
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error?.message
    );
    throw error?.response?.statusText || error?.message || "Error"; // Optionally, rethrow the error if you want to handle it further up
  }
};

const getLoanAccountStatement = async ({ accountNumber, fromDate, toDate }) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  // Construct the URL with the provided parameters
  const apiUrl = `${baseUrl}/BankOneWebAPI/api/LoanAccount/LoanAccountStatement/2?authToken=${token}&accountNumber=${accountNumber}`;

  if (fromDate) {
    apiUrl + `&fromDate=${fromDate}`;
  }
  if (toDate) {
    apiUrl + `&toDate=${toDate}`;
  }

  const { data } = await axios(apiUrl);

  return data;
};

const getRepaymentSchdule = async (accountNumber) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  const { data } = await axios.get(
    `${baseUrl}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${accountNumber}`
  );
  return data;
};

const getLoanAccountBalance = async (customerId) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
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
  return data;
};

function generateTrackingId() {
  // Get the current timestamp in milliseconds
  const timestamp = Date.now().toString();

  // Generate a random number and convert it to a string
  const randomValue = Math.random().toString(36).substring(2, 15);

  // Combine timestamp and random value to create a unique traceId
  const traceId = timestamp + randomValue;

  return traceId;
}

const handleGetTransactionQuery = async ({ ref, date, amount }) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  // Construct the URL with the provided parameters
  const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/Transactions/TransactionStatusQuery`;

  const { data } = await axios.post(apiUrl, {
    RetrievalReference: ref,
    TransactionDate: date,
    Amount: amount,
    Token: token,
  });

  return data;
};

const handleGetTransactionQueryCore = async ({ ref, date, amount }) => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  // Construct the URL with the provided parameters
  const apiUrl = `${baseUrl}/thirdpartyapiservice/apiservice/CoreTransactions/TransactionStatusQuery`;

  const { data } = await axios.post(apiUrl, {
    RetrievalReference: ref,
    TransactionDate: date,
    Amount: amount,
    Token: token,
  });

  return data;
};

const getBankoneCommercialBanks = async () => {
  const baseUrl = process.env.BANKONE_BASE_URL;
  const token = process.env.BANKONE_TOKEN;
  // Construct the URL with the provided parameters
  const apiUrl = `${baseUrl}/ThirdPartyAPIService/APIService/BillsPayment/GetCommercialBanks/${token}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const response = await fetch(apiUrl, options);

  if (!response) {
    throw new Error(response);
  }

  // Check content-type header to ensure the response is JSON
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Unexpected response format. Expected JSON.");
  }

  const data = await response.json();

  return data;
};

module.exports = {
  getCustomerAccountInfoByTrackingRef,
  handleInterBankTransfer,
  getAccountProduct,
  getLoanProduct,
  getLoanByCustomerId,
  generateTrackingId,
  getLoanAccountStatement,
  getLoanAccountBalance,
  getRepaymentSchdule,
  handleGetTransactionQuery,
  handleGetTransactionQueryCore,
  getBankoneCommercialBanks
};
