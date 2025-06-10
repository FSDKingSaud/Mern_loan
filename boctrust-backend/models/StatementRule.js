const mongoose = require("mongoose");

const StatementRuleSchema = mongoose.Schema(
  {
    ruleActive: {
      type: Boolean,
      defualt: true,
    },
    ruleTitle: {
      type: String,
      trim: true,
      required: true,
    },
    maximumTenure: {
      type: String,
      trim: true,
      default: 0,
    },
    maximumAmount: {
      type: String,
      trim: true,
      default: 0,
    },
    logicalRelationship: { type: String, enum: ["AND", "OR"] },
  },
  { timestamps: true }
);

const StatementRule = mongoose.model("StatementRule", StatementRuleSchema);
module.exports = StatementRule;
