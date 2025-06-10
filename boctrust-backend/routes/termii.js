// Admin Boctrust Account Management System
const { default: axios } = require("axios");
const express = require("express");
const router = express.Router(); // import account model

// Account API Endpoints
// get all account endpoint
router.get("/generate", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const payload = {
      api_key: process.env.TERMII_API_KEY,
      pin_type: "NUMERIC",
      phone_number: phoneNumber,
      pin_attempts: 5,
      pin_time_to_live: 1,
      pin_length: 6,
    };

    const response = await axios.post(
      `${process.env.TERMII_BASE_URL}/sms/otp/generate`,
      payload
    );

    if (response.data.status === "success") {
      return res.status(200).json(response.data.data);
    } else {
      return res.status(400).json(response.data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  const { pinId, pin } = req.body;
  try {
    const payload = {
      api_key: process.env.TERMII_API_KEY,
      pin_id: pinId,
      pin: pin,
    };
    const response = await axios.post(
      `${process.env.TERMII_BASE_URL}/sms/otp/verify`,
      payload
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/send", async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const payload = {
      api_key: process.env.TERMII_API_KEY,
      message_type: "NUMERIC",
      to: phoneNumber,
      from: process.env.TERMII_SENDER_ID,
      channel: "dnd",
      pin_attempts: 5,
      pin_time_to_live: 5,
      pin_length: 6,
      pin_placeholder: "< 1234 >",
      message_text:
        "BoctrustMFB verification pin is < 1234 >. Valid for 5 minutes. BoctrustMFB ",
      pin_type: "NUMERIC",
    };

    const response = await axios.post(
      `${process.env.TERMII_BASE_URL}/sms/otp/send`,
      payload
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ error: error.response.data.message });
  }
});

module.exports = router;
