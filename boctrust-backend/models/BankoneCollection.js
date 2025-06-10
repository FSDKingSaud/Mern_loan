const mongoose = require("mongoose");

const bankoneCollectionSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },

    collectionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: [
        "Pending",
        "Failed",
        "Successful",
        "Reversed",
        "SuccessfulButFeeNotTaken",
      ],
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    repaymentScheduleIds: {
      type: [String],
      default: [],
    },
    paymentDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BankoneCollection = mongoose.model(
  "BankoneCollection",
  bankoneCollectionSchema
);

module.exports = BankoneCollection;
