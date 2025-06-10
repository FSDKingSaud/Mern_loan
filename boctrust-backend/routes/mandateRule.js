const express = require("express");
const Employer = require("../models/EmployersManager");
const MandateRule = require("../models/MandateRule");


const router = express.Router();

// get all MandateRule posts endpoint
router.get("/", async (req, res) => {
  try {
    // get all MandateRule posts from database
    const mandateRules = await MandateRule.find();
    // return success response
    return res.status(200).json({ mandateRules });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the mandateRule for an employer by ID
router.post("/", async (req, res) => {
  try {
    const {
      mandateTitle,
      mandateUser,
      mandateDuration,
      allowStacking,
      secondaryDuration,
    } = req.body;

    // Validate required fields
    if (!mandateTitle || !mandateDuration) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create new Mandate Rule
    const mandateRule = new MandateRule({
      mandateTitle,
      mandateUser,
      mandateDuration,
      allowStacking,
      secondaryDuration,
    });

    // Save the updated employer
    await mandateRule.save();

    res.json({ message: "MandateRule Created successfully", mandateRule });
  } catch (error) {
    console.error("Error Creating MandateRule:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Define a route to update the mandateRule for an employer by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { mandateTitle, mandateDuration } = req.body;

    // Validate required fields
    if (!mandateTitle || !mandateDuration) {
       return res.status(400).json({ error: "All fields are required" });
    }

    const updatedMandate = await MandateRule.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedMandate) {
      return  res.status(404).json({ error: "Mandate Rule not Found" });
    }

    res.json({
      message: "MandateRule Updated successfully",
      mandateRule: updatedMandate,
    });
  } catch (error) {
    console.error("Error Creating MandateRule:", error);
    return res.status(500).json({ error: error.message });
  }
});


// delete single Mandate Rule endpoint
router.delete("/:id", async (req, res) => {
  try {
    // get Mandate Rule id from request params
    const { id } = req.params;

    const employerUsing = await Employer.findOne({ mandateRule: id  })


    if(employerUsing) {
      return res.status(409).json({ error: "Mandate Rule in used by an Employer" });
    }
    // find Mandate Rule by id and delete
    await MandateRule.findByIdAndDelete(id);

    // return success response
    return res.status(200).json({ success: "Mandate Rule  deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;