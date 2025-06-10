const express = require("express");
const router = express.Router();
const Employer = require("../models/EmployersManager"); // import Employer model
const { authenticateStaffToken } = require("../middleware/auth");

// Employer API Endpoints
// get all Employer posts endpoint
router.get("/employers", async (req, res) => {
  try {
    // get all Employer posts from database
    const employers = await Employer.find()
      .populate("mandateRule")
      .populate("statementRule")
      .populate("employerLetterRule");
    // return success response
    return res.status(200).json({ employers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// get single Employer endpoint

router.get("/employers/:id", async (req, res) => {
  try {
    // get Employer id from request params
    const { id } = req.params;

    // find Employer by id and populate related documents
    const employer = await Employer.findById(id).populate("employersName");

    // return success response
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }
    return res.status(200).json({ employer });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new Employer post endpoint
router.post("/employers", authenticateStaffToken, (req, res) => {
  try {
    // Get post data from request body
    const {
      employersName,
      employersAddress,
      mandateRule,
      statementRule,
      employerLetterRule,
      newLoanFee,
      returningLoanFee,
    } = req.body;


    // Validate required fields
    if (
      !employersName ||
      !newLoanFee ||
      !returningLoanFee ||
      !employersAddress ||
      !mandateRule
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new Employer
    const employer = new Employer({
      employersId: `E00${Math.floor(Math.random() * 100) + 1} `,
      employersName,
      employersAddress,
      newLoanFee,
      returningLoanFee,
      mandateRule,
      statementRule: !!statementRule ? statementRule : null,
      employerLetterRule: !!employerLetterRule ? employerLetterRule : null,
    });

    // Save Employer
    employer.save();

    // Return success response
    return res.status(201).json({ success: "Employer created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single Employer endpoint
router.put("/employers/:id", authenticateStaffToken, async (req, res) => {
  try {
    // get Employer id from request params
    const { id } = req.params;

    // find employer by id
    const employer = await Employer.findById(id);
    if (!employer) {
      return res.status(404).json({ error: "Employer not found" });
    }

    // get Employer data from request body
    const {
      employersName,
      employersAddress,
      mandateRule,
      newLoanFee,
      returningLoanFee,
    } = req.body;
    // validate required fields
    if (!employersName || !newLoanFee ||
      !returningLoanFee || !employersAddress || !mandateRule) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const response = await Employer.findByIdAndUpdate(id, req.body);

    // return success response
    return res
      .status(200)
      .json({ employer: response, success: "Employer updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the statementRule for an employer by ID
router.put(
  "/employers/:id/statementRule",
  authenticateStaffToken,
  async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
      // Find the employer by ID
      const employer = await Employer.findById(id);

      if (!employer) {
        return res.status(404).json({ error: "Employer not found" });
      }

      // Update the statementRule object with the data from the request body
      const { ruleTitle, maximumTenure, maximumAmount, rule } = req.body;

      employer.statementRule.ruleTitle =
        ruleTitle || employer.statementRule.ruleTitle;
      employer.statementRule.maximumTenure =
        maximumTenure || employer.statementRule.maximumTenure;
      employer.statementRule.maximumAmount =
        maximumAmount || employer.statementRule.maximumAmount;
      employer.statementRule.rule = rule || employer.statementRule.rule;

      // Save the updated employer
      await employer.save();

      res.json({ message: "Statement updated successfully", employer });
    } catch (error) {
      console.error("Error updating Statement:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// delete single Employer endpoint
router.delete("/employers/:id", authenticateStaffToken, async (req, res) => {
  try {
    // get Employer id from request params
    const { id } = req.params;

    // find Employer by id and delete
    await Employer.findByIdAndDelete(id);

    // return success response
    return res.status(200).json({ success: "Employer deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DUMMY API to server the employee groupings for the payslip Anlysis
router.get("/payslip-grouping", authenticateStaffToken, async (req, res) => {
  try {
    res.json([
      {
        name: "others",
        benchmark: 30000,
      },
      {
        name: "police",
        benchmark: 15000,
        civilianPolice: 20000,
      },
    ]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update loanstatus" });
  }
});

module.exports = router; // export Employer routes
