// create post model
const mongoose = require("mongoose");
const Loan = require("./Loan");

const NDDMandateSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },

    balanceMandate: {
      code: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        default: "pending",
      },

      isActive: {
        type: Boolean,
        default: false,
      },
      subscriberCode: String,
    },
    debitMandate: {
      code: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        default: "pending",
      },
      isActive: {
        type: Boolean,
        default: false,
      },
      subscriberCode: String,
    },
    
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

const NDDMandate = mongoose.model("NDDMandate", NDDMandateSchema);
module.exports = NDDMandate;
