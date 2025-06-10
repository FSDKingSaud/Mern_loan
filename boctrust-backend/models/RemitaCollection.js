const mongoose = require("mongoose");

const remitaCollectionSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
    },
    dateNotificationSent: {
      type: String,
    },
    netSalary: {
      type: Number,
    },
    totalCredit: {
      type: Number,
    },
    mandateRef: {
      type: String,
      required: true,
    },
    balanceDue: {
      type: Number,
      required: true,
    },
    remitaCustomerId: {
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

const RemitaCollection = mongoose.model(
  "RemitaCollection",
  remitaCollectionSchema
);

module.exports = RemitaCollection;
