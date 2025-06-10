// index.js
const express = require("express");
const router = express.Router();
const SiteContent = require("../models/SiteContent");
const { authenticateStaffToken } = require("../middleware/auth");

// Fetch all data
router.get("/content", async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent();
      await content.save();
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to get content" });
  }
});

// Update any property
router.put("/update-content", authenticateStaffToken, async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) {
      content = new SiteContent(req.body);
    } else {
      Object.assign(content, req.body);
    }
    await content.save();
    res.json({ message: "Content updated successfully", content });
  } catch (error) {
    res.status(500).json({ error: "Failed to update content" });
  }
});

module.exports = router;
