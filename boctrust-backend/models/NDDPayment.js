// create post model
const mongoose = require("mongoose");

const NDDPaymentSchema = mongoose.Schema(
  {
    mandate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NDDMandate",
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: Number,
    nameEnquiryRef: String,
    transactionLocation: String,
    paymentReference: String,
    hasBalancedLoanAcc: Boolean,
    status: {
      type: String,
    },
    meta: {
      repaymentIds: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

const NDDPayment = mongoose.model("NDDPayment", NDDPaymentSchema);
module.exports = NDDPayment;
