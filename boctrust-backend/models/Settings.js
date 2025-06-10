// Create a schema for settings
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: String,
    address: String,
    phoneNumber1: String,
    phoneNumber2: String,
    email: String,
    footerText: String,
    copyrightText: String,
    mailType: String,
    fromEmail: String,
    fromName: String,
    smptHost: String,
    smtpPort: Number,
    smtpUsername: String,
    smtpPassword: String,
    minimumLoanAmount: Number,

    mandateWitnessName: String,
    mandateWitnessOcupation: String,
    mandateWitnessAddress: String,
    mandateWitnessSignature: String,

    // top update here
    topUpEligibilityMonths: { type: Number, default: 6 },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
// export settings model
module.exports = Settings;
