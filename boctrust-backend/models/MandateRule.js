const mongoose = require("mongoose");

const MandateRuleSchema = mongoose.Schema(
  {
    mandateTitle: {
      type: String,
      trim: true,
      default: "No Mandate Rule",
    },
    mandateUser: {
      type: String,
      trim: true,
      default: "Admin",
    },
    mandateDuration: {
      type: String,
      trim: true,
      default: "0 Months",
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    allowStacking: {
      type: String,
      default: false,
    },
    secondaryDuration: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const MandateRule = mongoose.model("MandateRule", MandateRuleSchema);
module.exports = MandateRule;
