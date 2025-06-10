const { default: mongoose } = require("mongoose");

const ExtraLenderSchema = new mongoose.Schema({
  name: { type: String },
  deductions: { type: Number },
});

const CreditBureauSearchSchema = new mongoose.Schema({
  bureauName: { type: String, default: "" },
  bvnNo: { type: String, default: "" },
  reportType: { type: String, default: "" },
  reportReason: { type: String, default: "" },
  bureauDate: { type: String, default: "" },
  bureauSearchReport: { type: String, default: "" },
  isCreditBureauCheck: {
    type: Boolean,
    default: false,
  },
  creditBureauResult: {},
  updatedAt: Date, // Field to store the timestamp
});

const creditAnalysisSchema = new mongoose.Schema(
  {
    loan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    assignment: {
      creditAnalyst: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isCreditAnalystAssigned: {
        type: Boolean,
        default: false,
      },
      updatedAt: Date, // Field to store the timestamp
    },
    creditDbSearch: {
      searchType: { type: String, default: "" },
      searchBy: { type: String, default: "" },
      searchDate: { type: String, default: "" },
      remarks: { type: String, default: "" },
      dbSearchReport: { type: String, default: "" },
      isCreditDbCheck: {
        type: Boolean,
        default: false,
      },
      updatedAt: Date, // Field to store the timestamp
    },
    deductCheck: {
      searchByDeduct: { type: String, default: "" },
      searchDateDeduct: { type: String, default: "" },
      remarksDeduct: { type: String, default: "" },
      deductSearchReport: { type: String, default: "" },
      isDeductCheck: {
        type: Boolean,
        default: false,
      },
      updatedAt: Date, // Field to store the timestamp
    },
    creditBureauSearch: {
      type: [CreditBureauSearchSchema],
      default: [],
    },
    paySlipAnalysis: {
      netPay: { type: Number, default: 0 },
      extraLenders: {
        type: [ExtraLenderSchema],
        default: [],
      },
      numOfExtraLenders: {
        type: Number,
        default: 0,
      },
      monthlyLoanRepayment: { type: Number, default: 0 },
      dateOfBirth: { type: String, default: "" },
      dateOfAppointment: { type: String, default: "" },
      isApplicantCivilianPolice: {
        type: Boolean,
        default: false,
      },
      uploadPaySlip: { type: String, default: "" },
      benchmark: { type: Number },
      isPaySlipContainsMoreThenFiveLenders: {
        type: Boolean,
        default: false,
      },
      monthlyDeductionBelowPercentageBenchmark: {
        type: Boolean,
        default: false,
      },
      takeHomePayNotLessThanBenchmark: {
        type: Boolean,
        default: false,
      },
      takeHomePayNotLessThan20PercentGross: {
        type: Boolean,
        default: false,
      },
      netPayNotLessThanBenchmark: {
        type: Boolean,
        default: false,
      },
      updatedAt: Date, // Field to store the timestamp
    },
    decisionSummary: {
      customerTakeHomeAfterLoanApproval: { type: String, default: "" },
      customerHasGoodCreditHistory: {
        type: Boolean,
        default: false,
      },
      isCustomerOnSoftSuit: {
        type: Boolean,
        default: false,
      },
      isCustomerNextOfKinOk: {
        type: Boolean,
        default: false,
      },
      isCreditCheckOk: {
        type: Boolean,
        default: false,
      },
      isBvnCheckOk: {
        type: Boolean,
        default: false,
      },
      maxAmountLendable: Number,
      totalMonthlyDeductions: Number,
      disbursementInstruction: { type: String, default: "" },
      creditOfficerReview: { type: String, default: "" },
      creditOfficerApprovalStatus: {
        type: String,
        enum: ["approved", "declined", "pending"],
        default: "pending",
      },
      headOfCreditApprovalStatus: {
        type: String,
        enum: ["approved", "declined", "pending"],
        default: "pending",
      },
      cooApprovalStatus: {
        type: String,
        enum: ["approved", "declined", "pending"],
        default: "pending",
      },
      creditOfficerApprovedAt: Date, // Field to store the timestamp
    },
  },
  { timestamps: true }
);
const CreditAnalysis = mongoose.model("CreditAnalysis", creditAnalysisSchema);

module.exports = CreditAnalysis;
