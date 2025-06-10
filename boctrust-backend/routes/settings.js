const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings"); // import settings model
const multer = require("multer");

// get all settings endpoint
router.get("/settings", async (req, res) => {
  try {
    // get all settings
    const settings = await Settings.findOne();

    // return success response
    return res.status(200).json({ settings });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Update settings
router.put("/settings/email", async (req, res) => {
  try {
    const { mailType, fromEmail, fromName, smptHost, smtpPort, smtpUsername } =
      req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        mailType,
        fromEmail,
        fromName,
        smptHost,
        smtpPort,
        smtpUsername,
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/settings/general", async (req, res) => {
  try {
    const {
      siteTitle,
      address,
      phoneNumber1,
      phoneNumber2,
      email,
      copyrightText,
    } = req.body;
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        siteTitle,
        address,
        phoneNumber1,
        phoneNumber2,
        email,
        copyrightText,
      },
      {
        new: true,
        upsert: true,
      }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update settings
router.post("/settings/minimumLoanAmount", async (req, res) => {
  try {
    const allSettings = await Settings.find();

    if (allSettings.length === 0) {
      // Create a new settings document if none exists
      const newSettings = new Settings({
        minimumLoanAmount: req.body.minLoanAmount,
      });
      await newSettings.save();
      return res.json({
        message: "New settings created",
        settings: newSettings,
      });
    }

    // Update the existing settings
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { minimumLoanAmount: req.body.minLoanAmount },
      { new: true } // Return the updated document
    );
    res.json({ message: "Settings updated", settings: updatedSettings });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// Update top-up eligibility months here
router.put("/set-month", async (req, res) => {
  const { topUpEligibilityMonths } = req.body;
  const settings = await Settings.findOneAndUpdate(
    {},
    { topUpEligibilityMonths },
    { new: true }
  );
  res.json(settings);
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [, "image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename the file with a unique name
  },
});

const upload = multer({ storage, fileFilter: fileFilter });

router.put(
  "/mandate-witness",
  upload.single("mandateWitnessSignature"),
  async (req, res) => {
    try {
      const {
        mandateWitnessName,
        mandateWitnessAddress,
        mandateWitnessOcupation,
      } = req.body;
      const mandateWitnessSignature = req.file;

      if (
        !mandateWitnessName ||
        !mandateWitnessAddress ||
        !mandateWitnessSignature ||
        !mandateWitnessOcupation
      ) {
        return res.status(400).json("Provide all fields");
      }
      const settings = await Settings.findOneAndUpdate(
        {},
        {
          mandateWitnessName,
          mandateWitnessAddress,
          mandateWitnessOcupation,
          mandateWitnessSignature: mandateWitnessSignature.filename,
        },
        { new: true }
      );
      res.json(settings);
    } catch (error) {
      return res.status(500).json({
        error: error?.message || "Something went wrong",
      });
    }
  }
);

module.exports = router;
