const mongoose = require("mongoose");

const loanRepaymentSchema = new mongoose.Schema(
  {
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "collectionType",
    },
    collectionType: {
      type: String,
      required: true,
      enum: ["RemitaCollection", "BankoneCollection"],
      default: "BankoneCollection",
    },
  },
  { timestamps: true }
);

const LoanRepayment = mongoose.model("LoanRepayment", loanRepaymentSchema);

module.exports = LoanRepayment;
