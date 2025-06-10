const express = require("express");
const router = express.Router();
const Role = require("../models/Role"); // Import Role model

// Get all Roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    return res.status(200).json(roles);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Create new role
router.post("/", async (req, res) => {
  try {
    const newRoleData = req.body;
    const roleExist = await Role.findOne({ label: newRoleData?.label });
    if (roleExist) return res.status(400).json({ error: "Role Already Exist" });
    const newRole = await Role.create(newRoleData);
    return res
      .status(201)
      .json({ success: "Role created successfully", role: newRole });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update role
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updateRoleData = await Role.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updateRoleData) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res
      .status(200)
      .json({ success: "Role updated successfully", role: updateRoleData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Delete role
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRole = await Role.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ error: "Role not found" });
    }

    return res.status(200).json({ success: "Role deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Permission
router.get("/permission", async (req, res) => {
  try {
    const permissions = {
      kyc: ["kycReviewManagement", "viewKycReview"],
      loan: [
        "readLoans",
        "loanManagement",
        "loanDisbursment",
        "bookLoans",
        "approveBookLoan",
        "approveTransactions",
      ],
      topUpLoan: [
        "viewTopupLoan",
        "sendToCredit",
        "initiateTermination",
        "approveTermination",
      ],
      remita: [
        "viewRemitaCollections",
        "manageRemitaCollections",
        "salaryHistoryCheck",
        "bookRemitaLoan",
        "approveRemitaLoan",
        "stopRemitaLoan",
      ],
      credit: [
        "creaditAssessment",
        "viewCreaditAssessment",
        "approveCreditAssesment",
        "cooApproval",
        "headOfCreditApproval",
      ],
      employer: ["employerManament", "viewEmployers"],
      branches: ["manageBranch"],
      webManager: ["websiteManagement", "viewWebsiteManagement"],
      user: ["userManagement", "viewUsers"],
      setting: ["systemSettingManagement", "viewSystemSetting"],
      shouldNotSee: [
        "creditAssessment",
        "employerManager",
        "kycReview",
        "userManager",
        "systemSettings",
        "websiteManager",
      ],
    };

    return res.status(200).json(permissions);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Role Permissions
router.put("/:id/permission", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updateRoleData = await Role.findByIdAndUpdate(
      id,
      { $set: { "can.$": updateData } },
      {
        new: true,
      }
    );

    if (!updateRoleData) {
      return res.status(400).json({ error: "Role not found" });
    }

    return res
      .status(200)
      .json({ success: "Role updated successfully", role: updateRoleData });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
