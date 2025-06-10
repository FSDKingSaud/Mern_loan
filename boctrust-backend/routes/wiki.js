const express = require("express");
const router = express.Router();
const Wiki = require("../models/Wiki"); // import wiki model
const { authenticateStaffToken } = require("../middleware/auth");

// Wiki API Endpoints
// get all wiki posts endpoint
router.get("/wikis", async (req, res) => {
  try {
    const wikis = await Wiki.find();
    // return success response
    return res.status(200).json({ wikis });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new wiki post endpoint
router.post("/wikis", authenticateStaffToken, (req, res) => {
  try {
    // Get post data from request body
    const { question, answer, category } = req.body;

    // Validate required fields
    if (!question || !answer || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new wiki
    const wiki = new Wiki({ question, answer, category });

    // Save wiki
    wiki.save();

    // Return success response
    return res.status(201).json({ success: "Wiki created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single wiki endpoint
router.put("/wikis/:id", authenticateStaffToken, async (req, res) => {
  try {
    // get wiki id from request params
    const { id } = req.params;
    // get wiki data from request body
    const { question, answer, category } = req.body;
    // validate required fields
    if (!question || !answer || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // find wiki by id and update
    const wiki = await Wiki.findByIdAndUpdate(id, {
      question,
      answer,
      category,
    });

    // save updated wiki
    wiki.save();
    // return success response
    return res.status(200).json({ success: "Wiki updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single wiki endpoint
router.delete("/wikis/:id", authenticateStaffToken, async (req, res) => {
  try {
    // get wiki id from request params
    const { id } = req.params;
    // find wiki by id and delete
    await Wiki.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: "Wiki deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// export router
module.exports = router;
