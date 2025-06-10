const e = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
    customerId: {
        type: Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerAccounNo: {
        type: String,
        required: true
    },
    customerDisAccount: {
        type: String,
        required: true
    },
    disbursementBank: {
        type: String,
        required: true
    },
    loanProduct: {
        type: String,
        required: true
    },
    loanDuration: {
        type: Number,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    totalRepayment: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true
    },
    totalBalance: {
        type: Number,
        required: true
    },
    note: {
        type: String
    },
    loanStatus: {
        type: String,
        required: true
    },
    isLoanApproved: {
        type: Boolean,
        default: false,
        required: true
    },
    isTopUpLoan: { type: Boolean, default: false },
    isTopUpLoanSent: { type: Boolean, default: false },
    currentLoanTerminationStatus: { type: String, enum: ["pending", "initiated", "completed"], default: "pending" },
});

module.exports = mongoose.model('CustomerLoan', LoanSchema);
