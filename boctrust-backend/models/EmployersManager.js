const mongoose = require("mongoose");

const EmployerSchema = mongoose.Schema(
  {
    employersId: {
      type: String,
      required: true,
      trim: true,
    },
    employersName: {
      type: String,
      required: true,
    },
    employersAddress: {
      type: String,
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    mandateRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MandateRule",
    },
    statementRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StatementRule",
    },
    employerLetterRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerLetterRule",
    },
    newLoanFee: {
      applicationFee: {
        type: Number,
        default: 0
      },
      managementFee: {
        type: Number,
        default: 0
      },
      insuranceFee: {
        type: Number,
        default: 0
      },
    },
    returningLoanFee: {
      applicationFee: {
        type: Number,
        default: 0
      },
      managementFee: {
        type: Number,
        default: 0
      },
      insuranceFee: {
        type: Number,
        default: 0
      },
    }
  },
  { timestamps: true }
);

const Employer = mongoose.model("Employer", EmployerSchema);
module.exports = Employer; // export employer model
