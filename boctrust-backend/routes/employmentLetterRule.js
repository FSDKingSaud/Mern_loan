const express = require("express");
const Employer = require("../models/EmployersManager");
const EmployerLetterRule = require("../models/EmployerLetterRule");

const router = express.Router();

// get all EmployerLetterRule posts endpoint
router.get("/", async (req, res) => {
  try {
    // get all EmployerLetterRule posts from database
    const employerLetterRules = await EmployerLetterRule.find();
    // return success response
    return res.status(200).json({ employerLetterRules });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the employerLetterRule for an employer by ID
router.post("/", async (req, res) => {
  try {
    const { ruleTitle, maximumTenure, maximumAmount, logicalRelationship } =
      req.body;

    // Validate required fields
    if (!ruleTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new EmployerLetter Rule
    const employerLetterRule = new EmployerLetterRule({
      ruleTitle,
      maximumTenure,
      maximumAmount,
      logicalRelationship,
    });

    // Save the updated employer
    await employerLetterRule.save();

    res.json({
      message: "EmployerLetterRule Created successfully",
      employerLetterRule,
    });
  } catch (error) {
    console.error("Error Creating EmployerLetterRule:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the employerLetterRule for an employer by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { ruleTitle } = req.body;

    // Validate required fields
    if (!ruleTitle) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updatedMandate = await EmployerLetterRule.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );

    if (!updatedMandate) {
      return res.status(404).json({ error: "EmployerLetter Rule not Found" });
    }

    res.json({
      message: "Employer Letter Rule Updated successfully",
      employerLetterRule: updatedMandate,
    });
  } catch (error) {
    console.error("Error Creating Employer Letter Rule:", error);
    return res.status(500).json({ error: error.message });
  }
});

// delete single EmployerLetter Rule endpoint
router.delete("/:id", async (req, res) => {
  try {
    // get EmployerLetter Rule id from request params
    const { id } = req.params;

    const employerUsing = await Employer.findOne({ employerLetterRule: id });

    if (employerUsing) {
      return res
        .status(409)
        .json({ error: "Employer Letter Rule in used by an Employer" });
    }
    // find EmployerLetter Rule by id and delete
    await EmployerLetterRule.findByIdAndDelete(id);

    // return success response
    return res
      .status(200)
      .json({ success: "Employer Letter Rule  deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
