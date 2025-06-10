const express = require("express");
const router = express.Router();
const Branch = require("../models/Branches"); // import branch model

// Branch API Endpoints
// get all branch posts endpoint
router.get("/branches", async (req, res) => {
  try {
    const branches = await Branch.find();
    // return success response
    return res.status(200).json({ branches });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// create new branch endpoint
router.post("/branches", (req, res) => {
  try {
    // Get branch data from request body
    const { branchName, contactEmail, phoneNumber, address, note } = req.body;

    // Validate required fields
    if (!branchName || !contactEmail || !phoneNumber || !address || !note) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const branchId = `BR${Math.floor(Math.random() * 1000) + 1} `;

    // Create new branch
    const branch = new Branch({
      branchId,
      branchName,
      contactEmail,
      phoneNumber,
      address,
      note,
    });

    // Save branch
    branch.save();

    // Return success response
    return res.status(201).json({ success: "branch created successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// update single branch endpoint
router.put("/branches/:id", async (req, res) => {
  try {
    // get branch id from request params
    const { id } = req.params;

    // get branch data from request body
    const { branchId, branchName, contactEmail, phoneNumber, address, note } =
      req.body;

    // validate required fields
    if (
      !branchId ||
      !branchName ||
      !contactEmail ||
      !phoneNumber ||
      !address ||
      !note
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // find branch by id and update
    const branch = await Branch.findByIdAndUpdate(id, {
      branchId,
      branchName,
      contactEmail,
      phoneNumber,
      address,
      note,
    });

    // save updated branch
    branch.save();

    // return success response
    return res.status(200).json({ success: "Branch updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// delete single branch endpoint
router.delete("/branches/:id", async (req, res) => {
  try {
    // get branch id from request params
    const { id } = req.params;

    // find branch by id and delete
    await Branch.findByIdAndDelete(id);
    // return success response
    return res.status(200).json({ success: "Branch deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// export router
module.exports = router;
