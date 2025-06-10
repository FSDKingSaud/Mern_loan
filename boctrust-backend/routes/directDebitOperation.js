const express = require('express');
const router = express.Router();
const Customer = require("../models/Customer");
const Loan = require("../models/Loan");
const fetchAccessToken = require('../utils/nddAccessToken');

const BASE_URL = process.env.NIBSS_BASE_URL;

// Endpoint to create a direct debit mandate
router.post("/create-mandate", async (req, res) => {
  console.log(req.body);
  const { startDate, endDate, customerId} = req.body;

  try {
    // generate access token
     const accessToken = await fetchAccessToken();

     console.log("Access token", accessToken);
     console.log("Api key", process.env.NIBSS_DD_API_KEY)

    if (!accessToken) {
      return res.status(401).json({ error: "Access token could not be retrieved" });
    }

    // find customer loan by id
    const loan = await Loan.findById(customerId);

    if (!loan) {
      return res.status(404).json({ error: "Customer loan not found" });
    }

    // find customer by id
    const customer = await Customer.findById(loan.customer);

    // Create a new mandate request
    // console.log("Creating mandate request for customer:", customer);

    // Define the payload using the provided test data
    // const payload = {
    //   payerName: "test",
    //   narration: "payment",
    //   payerEmail: "payermail@gmail.com",
    //   bankCode: "76768",
    //   productId: "1",
    //   mandateImageFile: "http://localhost:3030/public/filesUpload/1723669274974-CreditDBCheck.pdf",
    //   billerId: "1",
    //   startDate: "2025-01-09T15:19:44.855Z",
    //   endDate: "2025-01-12T15:19:44.855Z",
    //   subscriberCode: "RJ5W4G4VNTWG",
    //   accountNumber: "0937258920",
    //   phoneNumber: "56120003622",
    //   amount: "1000.00",
    //   accountName: "TestAccount",
    //   payerAddress: "Lagos",
    // };

    // Create a new mandate request
    const FormData = require("form-data");
    const formData = new FormData();
    formData.append("payerName", "test");
    formData.append("narration", "payment");
    formData.append("payerEmail", "payermail@gmail.com");
    formData.append("bankCode", "76768");
    formData.append("productId", "1");
    formData.append("mandateImageFile", "http://localhost:3030/public/filesUpload/1723669274974-CreditDBCheck.pdf");
    formData.append("billerId", "1");
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("subscriberCode", "RJ5W4G4VNTWG");
    formData.append("accountNumber", "0937258920");
    formData.append("phoneNumber", "56120003622");
    formData.append("amount", "1000.00");
    formData.append("accountName", "TestAccount");
    formData.append("payerAddress", "Lagos");

    // Make a POST request to the external API
    const response = await fetch(
      `${BASE_URL}/ndd/v2/api/MandateRequest/CreateMandateDirectDebit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          // apiKey: process.env.NIBSS_DD_API_KEY,
          "content-type": "multipart/form-data",
          "accept": "application/json"
        },
        body: formData,
      }
    );

    // Handle the response
    if (!response.ok) {
      console.log(response)
      const errorText = await response.text();
      console.log("Res Error", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log("Data", data)
    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating mandate:", error);
    res.status(500).json({ error: "An error occurred while creating the mandate." });
  }
});

// Route to create a mandate direct debit
// router.post('/create-mandate', async (req, res) => {
//   // console.log(req.body);
//   const { startDate, endDate, customerId} = req.body;

//   try {
//     const accessToken = await fetchAccessToken();

//     if (!accessToken) {
//       return res.status(401).json({ error: "Access token could not be retrieved" });
//     }

//     // find customer loan by id
//     const loan = await Loan.findById(customerId);

//     if (!loan) {
//       return res.status(404).json({ error: "Customer loan not found" });
//     }

//     // find customer by id
//     const customer = await Customer.findById(loan.customer);

//     // Create a new mandate request
//     // console.log("Creating mandate request for customer:", customer);

//     const data = {
     
//       mandateRequests: [
//         {
//           accountNumber: "1780004070",
//           productId: "3",
//           bankCode: "2348029039468",
//           payerName: "Adeola",
//           payerAddress: "Adeola Hopewell",
//           accountName: "Mobolaji Temabo Ake",
//           amount: "10000",
//           payeeName: "OG Advertising agency",
//           Narration: "3 months ad payment",
//           payeeAddress: "Ahmadu bello way",
//           phoneNumber: "08023640703",
//           emailAddress: "make@nibss-plc.com.ng",
//           subscriberCode: "OGIBVBNN-001BJ",
//           startDate: "2025-01-09T16:37:43.109Z",
//           endDate: "2025-01-09T17:37:43.109Z",
//           fileExtension: ".pdf",
//           mandateFile:
//             "http://localhost:3030/public/filesUpload/1723669274974-CreditDBCheck.pdf",
//         },
//       ],
//     };

//     const response = await fetch(`${BASE_URL}/create`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         Accept: "application/json",
//         "Content-Type": "multipart/form-data",
//         apiKey: process.env.NIBSS_DD_API_KEY
//       },
//       body: JSON.stringify(data), // Fixed here
//     });

//     const responseData = await response.json();
//     console.log("server res", responseData)

//     if (!response.ok) {
//       console.error("API Error Response:", { status: response.status, responseData });
//       return res.status(response.status).json({
//         error: response.statusText,
//         details: responseData,
//       });
//     }

//     console.log("Mandate Created Successfully:", responseData);
//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error("Internal Server Error:", error.message);
//     res.status(500).json({ error: "Internal Server Error", details: error.message });
//   }
// });

// endpoint to fetch mandate details
router.post('/fetchMandateDetails', async (req, res) => {
  try {
    const accessToken = await fetchAccessToken();
    const { page, pageSize, billerId, accountNumber } = req.body;

    const response = await fetch(`${BASE_URL}/api/MandateRequest/FetchMandate?page=${page}&pageSize=${pageSize}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ billerId, accountNumber })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to update mandate status
router.post("/updateMandateStatus", async (req, res) => {
  const { auth, mandateUpdateRequests } = req.body;

  // Validate request body
  if (!auth || !mandateUpdateRequests || !Array.isArray(mandateUpdateRequests)) {
    return res.status(400).json({ error: "Invalid request body format" });
  }

  try {
    // Make a POST request to the external API using fetch
    const apiResponse = await fetch(`${BASE_URL}/status`, {
      method: "POST",
      headers: {
        "Authorization": "Bearer <BEARER_TOKEN>", // Replace with actual token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth: {
          username: auth.username,
          password: auth.password,
          apiKey: auth.apiKey,
        },
        mandateUpdateRequests,
      }),
    });

    // Parse the JSON response
    const responseData = await apiResponse.json();

    // Respond back to the client
    if (apiResponse.ok) {
      res.status(200).json(responseData);
    } else {
      res.status(apiResponse.status).json({
        error: "Failed to update mandate status",
        details: responseData,
      });
    }
  } catch (error) {
    console.error("Error updating mandate status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

// e-mandate implementation
// dd/v2/api/MandateRequest/CreateEmandate
// return $client->createEMandate([
    //       "productId"=> 1,

    //       "billerId"=> 1,

    //       "accountNumber"=> "2222222222",

    //       "bankCode"=> "058",

    //       "payerName"=> "Alex lopez",

    //       "mandateType"=> 2,

    //       "payerAddress"=> "maryland Ikeja computer village",

    //       "accountName"=> "Micheal lopez",

    //       "amount"=> 100000,

    //       "frequency"=> 48,

    //       "narration"=> "test e mandate response",

    //       "phoneNumber"=> "08028134486",

    //       "subscriberCode"=> "12003074001",

    //       "startDate"=> "2025-01-09T16:37:43.109Z",

    //       "endDate"=> "2025-06-09T16:37:43.109Z",

    //     "payerEmail" => "senenerst@gmail.com"

    // ]);