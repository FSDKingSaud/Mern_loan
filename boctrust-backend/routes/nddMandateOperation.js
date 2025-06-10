const express = require('express');
const router = express.Router();
const Customer = require("../models/Customer");
const unirest = require("unirest");
const multer = require("multer");
const getAccessToken = require('../utils/nddAccessToken');
const NIBSSCLIENT = require('../utils/nibssClient');

const BASE_URL = 'https://apitest.nibss-plc.com.ng/ndd/v2/api';

// Create a new NIBSSClient instance
const nibssClient = new NIBSSCLIENT();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// API Endpoint to handle Direct Debit Mandate Creation
router.post("/nncreate-mandate", async (req, res) => {
  console.log("create-mandate");
  try {
    const data = req.body; // Assuming mandate data is sent in the request body
    console.log(data);
    const response = await nibssClient.createMandateDirectDebit(data);
    res.json(response);
  } catch (error) {
    console.error("Error creating mandate:", error);
    res.status(500).json({ error: "Failed to create mandate" });
  }
});

// API Endpoint to handle Direct Debit Mandate Creation
router.post("/create-mandate", async (req, res) => {
  try {
    // Fetch the access token
    const token = await getAccessToken(); // Wait for the token to resolve
    console.log("auth token", token);

    const {
      productId,
      accountNumber,
      bankCode,
      payerName,
      payerEmail,
      payerAddress,
      accountName,
      amount,
      narration,
      phoneNumber,
      subscriberCode,
      startDate,
      endDate,
      billerId,
    } = req.body;

    console.log(req.body);

    // const filePath = req.file ? req.file.path : null; // Uploaded file path

    // Ensure all required fields are present
    if (
      !productId ||
      !accountNumber ||
      !bankCode ||
      !payerName ||
      !payerEmail ||
      !accountName ||
      !amount ||
      !phoneNumber ||
      !subscriberCode ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({ error: "All fields are required, including the file." });
    }


    // Create unirest request
    const reqUnirest = unirest("POST", `${BASE_URL}/MandateRequest/CreateMandateDirectDebit`);

    reqUnirest.headers({
      "content-type": "multipart/form-data",
      accept: "application/json",
      Authorization: `Bearer ${token}`, // Use the resolved token
    });

    // Attach form data and file
    reqUnirest.field("productId", productId);
    reqUnirest.field("accountNumber", accountNumber);
    reqUnirest.field("bankCode", bankCode);
    reqUnirest.field("payerName", payerName);
    reqUnirest.field("payerEmail", payerEmail);
    reqUnirest.field("payerAddress", payerAddress);
    reqUnirest.field("accountName", accountName);
    reqUnirest.field("amount", amount);
    reqUnirest.field("narration", narration);
    reqUnirest.field("phoneNumber", phoneNumber);
    reqUnirest.field("subscriberCode", subscriberCode);
    reqUnirest.field("startDate", startDate);
    reqUnirest.field("endDate", endDate);
    reqUnirest.field("billerId", billerId);
    // reqUnirest.attach("mandateImageFile", filePath);

    // Handle unirest response
    reqUnirest.end(function (apiRes) {
      if (apiRes.error) {
        console.error("Error from NIBSS API:", apiRes.error);
        return res.status(500).json({ error: "Failed to create mandate" });
      }

      console.log("Response from NIBSS API:", apiRes.body);
      res.status(200).json(apiRes.body);
    });
  } catch (error) {
    console.error("Error fetching token or processing request:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Endpoint to retrieve mandate status
router.get("/retrieve-mandate-status", async (req, res) => {
  const { mandateCode } = req.query;

  // Validate mandateCode
  if (!mandateCode) {
    return res.status(400).json({ error: "MandateCode is required." });
  }

  // Create unirest request
  const reqUnirest = unirest("POST", `${BASE_URL}/MandateRequest/MandateStatus`);

  // Add query parameters
  reqUnirest.query({
    MandateCode: mandateCode,
  });

  // Handle response from NIBSS API
  reqUnirest.end(function (apiRes) {
    if (apiRes.error) {
      console.error("Error from NIBSS API:", apiRes.error);
      return res.status(500).json({ error: "Failed to retrieve mandate status." });
    }

    console.log("Response from NIBSS API:", apiRes.body);
    res.status(200).json(apiRes.body);
  });
});


// Endpoint to fetch all mandates
router.get("/fetch-mandates", (req, res) => {
  const { page, pageSize } = req.query;

  // Validate query parameters
  if (!page || !pageSize) {
    return res.status(400).json({ error: "Both page and pageSize are required." });
  }

  // Create unirest request
  const reqUnirest = unirest("POST", `${BASE_URL}/MandateRequest/FetchMandate`);

  // Add query parameters
  reqUnirest.query({
    page: page,
    pageSize: pageSize,
  });

  // Handle response from NIBSS API
  reqUnirest.end(function (apiRes) {
    if (apiRes.error) {
      console.error("Error from NIBSS API:", apiRes.error);
      return res.status(500).json({ error: "Failed to fetch mandates." });
    }

    console.log("Response from NIBSS API:", apiRes.body);
    res.status(200).json(apiRes.body);
  });
});

// Endpoint to update mandate status i.e stop/restart mandate
router.post("/update-mandate-status", (req, res) => {
  const { mandateCode, status } = req.body;

  // Validate input
  if (!mandateCode || !status) {
    return res.status(400).json({ error: "Mandate code and status are required." });
  }

  // Create unirest request
  const reqUnirest = unirest("POST", `${BASE_URL}/MandateRequest/UpdateMandateStatus`);

  // Set headers if required (modify as needed for API)
  reqUnirest.headers({
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Send request body
  reqUnirest.send({
    mandateCode: mandateCode,
    status: status,
  });

  // Handle response from NIBSS API
  reqUnirest.end(function (apiRes) {
    if (apiRes.error) {
      console.error("Error from NIBSS API:", apiRes.error);
      return res.status(500).json({ error: "Failed to update mandate status." });
    }

    console.log("Response from NIBSS API:", apiRes.body);
    res.status(200).json(apiRes.body);
  });
});


module.exports = router;