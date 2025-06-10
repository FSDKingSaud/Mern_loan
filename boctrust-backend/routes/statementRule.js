const express = require("express");
const Employer = require("../models/EmployersManager");
const StatementRule = require("../models/StatementRule");

const router = express.Router();

// get all StatementRule posts endpoint
router.get("/", async (req, res) => {
  try {
    // get all StatementRule posts from database
    const statementRules = await StatementRule.find();
    // return success response
    return res.status(200).json({ statementRules });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the statementRule for an employer by ID
router.post("/", async (req, res) => {
  try {
    const { ruleTitle, maximumTenure, maximumAmount, logicalRelationship } = req.body;

    // Validate required fields
    if (!ruleTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new Statement Rule
    const statementRule = new StatementRule({
      ruleTitle,
      maximumTenure,
      maximumAmount,
      logicalRelationship,
    });

    // Save the updated employer
    await statementRule.save();

    res.json({ message: "StatementRule Created successfully", statementRule });
  } catch (error) {
    console.error("Error Creating StatementRule:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the statementRule for an employer by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { ruleTitle } = req.body;

    // Validate required fields
    if (!ruleTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedMandate = await StatementRule.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMandate) {
      return res.status(404).json({ error: "Statement Rule not Found" });
    }

    res.json({
      message: "StatementRule Updated successfully",
      statementRule: updatedMandate,
    });
  } catch (error) {
    console.error("Error Creating StatementRule:", error);
    return res.status(500).json({ error: error.message });
  }
});

// delete single Statement Rule endpoint
router.delete("/:id", async (req, res) => {
  try {
    // get Statement Rule id from request params
    const { id } = req.params;

    const employerUsing = await Employer.findOne({ statementRule: id });

    if (employerUsing) {
      return res
        .status(409)
        .json({ error: "Statement Rule in used by an Employer" });
    }
    // find Statement Rule by id and delete
    await StatementRule.findByIdAndDelete(id);

    // return success response
    return res
      .status(200)
      .json({ success: "Statement Rule  deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
