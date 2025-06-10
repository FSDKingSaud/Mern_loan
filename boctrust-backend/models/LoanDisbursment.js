const mongoos = require("mongoose");

const loanDisbursementSchema = mongoos.Schema(
  {
    loan: {
      type: mongoos.Schema.Types.ObjectId,
      ref: "Loan",
    },
    customer: {
      type: mongoos.Schema.Types.ObjectId,
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
    paymentDate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const LoanDisbursement = mongoos.model(
  "LoanDisbursement",
  loanDisbursementSchema
);
module.exports = LoanDisbursement; // export branch model
