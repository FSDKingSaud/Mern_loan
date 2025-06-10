const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry"); // import inquiry model
const {
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("../services/notification.service");

// Inquiry API Endpoints
// get all inquiries endpoint
router.get("/inquiries", async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    // return success response
    return res.status(200).json({ inquiries });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new wiki post endpoint
router.post("/inquiries", async (req, res) => {
  try {
    // Get post data from request body
    const { email, subject, message } = req.body;

    // Validate required fields
    if (!email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new inquiry
    const inquiry = new Inquiry({ email, subject, message });

    // Save inquiry
    await inquiry.save();

    const usersToSend = await getUsersToSendNotificationFromTarget("admins");

    await saveAndSendNotification({
      targetUsers: usersToSend,
      message: `New Inquiry by ${email} on ${subject} `,
      type: "inquiries",
      metadata: inquiry._id,
    });

    // Return success response
    return res.status(201).json({ success: "Inquiry created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single wiki endpoint
router.delete("/inquiries/:id", async (req, res) => {
  try {
    // get inquiry id from request params
    const { id } = req.params;
    // find inquiry by id and delete
    await Inquiry.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: "Inquiry deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// export router
module.exports = router;
