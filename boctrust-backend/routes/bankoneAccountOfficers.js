const express = require("express");
const { default: axios } = require("axios");
const router = express.Router();

// add token to environment variable
const token = process.env.BANKONE_TOKEN;
const baseUrl = process.env.BANKONE_BASE_URL;
const mfbcode = "100579";

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: baseUrl,
});

// https://staging.mybankone.com/BankOneWebAPI/api/AccountOfficer/Get/2?authToken=0552974c-0abe-4ff9-a9ef-5ee363b52b53&mfbCode=100579

// Update a user
router.get("/", async (req, res) => {
  try {
    const response = await axiosInstance.get(
      `/BankOneWebAPI/api/AccountOfficer/Get/2?authToken=${token}&mfbCode=${mfbcode}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}); // update user logic ends here

module.exports = router; // export router
