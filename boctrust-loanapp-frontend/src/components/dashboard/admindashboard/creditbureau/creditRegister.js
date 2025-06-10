import axios from "axios";

const fetchCreditReport = async () => {
  const apiUrl =
    "https://api.creditregistry.com/nigeria/AutoCred/Test/v8/api/GetReport200";

  // Define the request payload
  const requestBody = {
    SessionCode: "string",
    CustomerRegistryIDList: ["string"],
    EnquiryReason: "KYCCheck",
    HistoryLengthInMonths: 0,
  };

  try {
    // Send the POST request
    const { data } = await axios.post(apiUrl, requestBody);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default fetchCreditReport;
