const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    bvnnumber: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    agentCode: String,
    customerId: String,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    phonenumber: String,
    dob: String,
    gender: String,
    maritalstatus: String,
    noofdependent: String,
    educationlevel: String,
    howdidyouhearaboutus: String,
    houseaddress: String,
    stateofresidence: String,
    lga: String,
    stateoforigin: String,
    ippis: { type: String, default: "nill" },
    servicenumber: { type: String, default: "nill" },
    valididcard: String,
    idcardnotinclude: String,
    nkinfirstname: String,
    nkinlastname: String,
    nkinphonenumber: String,
    nkinrelationship: String,
    nkinresidentialaddress: String,
    careertype: String,
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employer",
    },
    otheremployername: String,
    employeraddress: String,
    employmentletter: String,
    employmentstartdate: String,
    netmonthlyincome: String,
    totalannualincome: String,
    officialemail: String,
    uploadpayslip: String,
    uploadbankstatement: String,
    salarybankbranch: String,
    salaryaccountname: String,
    salaryaccountnumber: String,
    sameasaboveaccount: String,
    bankcode: String,
    disbursementbankname: String,
    disbursementaccountnumber: String,
    hasloan: String,
    currentmonthlyplanrepaymentamount: String,
    estimatedmonthlylivingexpense: String,

    beneficiaryname: String,
    beneficiarybank: String,
    beneficiaryaccountnumber: String,
    useAnyAccount: String,
    preferredAccountNumber: String,
    liquidationbalance: String,
    guarantee: String,
    acceptterms: String,
    acceptpolicy: String,
    sharemyremita: Boolean,
    agreenibbsdebit: Boolean,
    agreefullname: String,
    agreedate: String,
    signature: String,
    photocapture: String,
    marketerClientPic: String,
    username: { type: String, unique: true, required: true },
    password: String,
    confirmpassword: String,
    token: String,
   
    branch: {
      type: String,
      default: "head office",
    },
    kyc: {
      isFacialMatch: {
        type: Boolean,
        default: false,
      },
      isIdCardValid: {
        type: Boolean,
        default: false,
      },
      isPhotoCaptured: {
        type: Boolean,
        default: false,
      },
      isSignatureValid: {
        type: Boolean,
        default: false,
      },
      isOtherDocsValidated: {
        type: Boolean,
        default: false,
      },
      isKycApproved: {
        type: Boolean,
        default: null,
      },
      timestamps: {
        type: Date,
        default: Date.now,
      },
    },

    transactions: {
      type: Array,
      default: [],
    },
    myLoansBalance: {
      type: String,
      default: "0.00",
    },
    loanproduct: {
      type: String,
      required: true,
    },
    totalLoanBalance: {
      type: String,
      default: "0.00",
    },

    banking: {
      isAccountCreated: {
        type: Boolean,
        default: false,
      },
      accountDetails: {
        type: Object, // hold an object
        default: {}, //  default empty object
      },
    },
    // top up loan update here
    topUpLoanEligibility: {
      isEligible: { type: Boolean, default: false },
      hasTopUpLoan: { type: Boolean, default: false },
      monthsSinceLastLoan: { type: Number, default: 0 },
      notificationSent: { type: Boolean, default: false },
  },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;