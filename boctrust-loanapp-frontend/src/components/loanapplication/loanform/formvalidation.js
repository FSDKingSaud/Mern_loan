import * as Yup from "yup";
// validation Yup.Schema

const MAX_FILE_SIZE = 200 * 1024; // 200KB

const validationSchema = Yup.object({
  loanamount: Yup.string().required("Required"),
  numberofmonth: Yup.number()
    .min(1, "Please enter a number from 1 to 24")
    .max(24, "Please enter a number from 1 to 24")
    .required("Required"),
  loanpurpose: Yup.array()
    .min(1, "Please select at least one purpose")
    .required("Required"),
  bvnnumber: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
  firstname: Yup.string().required("Required"),
  lastname: Yup.string().required("Required"),
  phonenumber: Yup.string()
    .matches(
      /^(\+?[1-9]\d{1,14}|(\+234|0)[789][01]\d{8})$/,
      "Phone number must be in E.164 format or a valid Nigerian number (e.g., +2347012345678 or 07012345678)"
    )
    .required("Phone number is required"),
  dob: Yup.date().required("Required"),
  email: Yup.string().email("Invalid email format").required("Required"),
  maritalstatus: Yup.string().required("Required"),
  noofdependent: Yup.number().required("Required"),
  eductionlevel: Yup.string().required("Required"),
  howdidyouhearaboutus: Yup.string().required("Required"),
  stateofresidence: Yup.string().required("Required"),
  houseaddress: Yup.string().required("Required"),
  lga: Yup.string().required("Required"),
  stateoforigin: Yup.string().required("Required"),
  ippis: Yup.string().required("Required"),
  servicenumber: Yup.string().required("Required"),
  valididcard: Yup.mixed()
    .required("File is Required")
    .test("fileSizeValididcard", "File size exceeds 200KB", (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }),

  // next of kin
  nkinfirstname: Yup.string().required("Required"),
  nkinlastname: Yup.string().required("Required"),
  nkinphonenumber: Yup.string()
    .matches(
      /^(\+?[1-9]\d{1,14}|(\+234|0)[789][01]\d{8})$/,
      "Phone number must be in E.164 format or a valid Nigerian number (e.g., +2347012345678 or 07012345678)"
    )
    .required("Phone number is required"),
  nkinrelationship: Yup.string().required("Required"),
  nkinresidentialaddress: Yup.string().required("Required"),

  // employment
  employerId: Yup.string().required("Required"),
  employeraddress: Yup.string().required("Required"),
  employmentstartdate: Yup.date().required("Required"),
  netmonthlyincome: Yup.number().required("Required"),
  totalannualincome: Yup.number().required("Required"),
  officialemail: Yup.string()
    .email("Invalid email format")
    .required("Required"),
  uploadpayslip: Yup.mixed()
    .required("Payslip Required")
    .test("fileSize", "File size exceeds 200KB", (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }),
  uploadbankstatement: Yup.mixed().test(
    "fileSizePayslip",
    "File size exceeds 200KB",
    (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }
  ),
  employmentletter: Yup.mixed().test(
    "fileSizeEmploymentletter",
    "File size exceeds 200KB",
    (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }
  ),
  marketerClientPic: Yup.mixed().test(
    "fileSizeMarketerClientPic",
    "File size exceeds 200KB",
    (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }
  ),
  signature: Yup.mixed().test(
    "fileSizeSignature",
    "File size exceeds 200KB",
    (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    }
  ),
  preferredAccountNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),

  useAnyAccount: Yup.boolean(),

  // bank details and disbursement
  salaryaccountname: Yup.string().required("Required"),
  bankcode: Yup.string().required("Required"),
  salaryaccountnumber: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),

  disbursmentbankname: Yup.string().required("Required"),
  disbursmentaccountnumber: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  hasloan: Yup.string().required("Required"),
  currentmonthlyplanrepaymentamount: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
  estimatedmonthlylivingexpense: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
  loanbalance: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
  loanprovider: Yup.string().required("Required"),
  buyoverloan: Yup.string().required("Required"),
  beneficiaryname: Yup.string().required("Required"),
  beneficiarybank: Yup.string().required("Required"),
  beneficiaryaccountnumber: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits"),
  liquidationbalance: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits"),
  deductions: Yup.string().required("Required"),
  guarantee: Yup.string().required("Required"),

  // terms and conditions
  acceptterms: Yup.boolean().required("Required"),
  acceptpolicy: Yup.boolean().required("Required"),
  sharemyremita: Yup.boolean().required("Required"),
  agreefullname: Yup.string().required("Required"),
  agreedate: Yup.date().required("Required"),
  signature: Yup.mixed().required("Required"),
  photocapture: Yup.mixed().required("Required"),
  haveagent: Yup.boolean().required("Required"),
  agentname: Yup.string().required("Required"),
});
// end of validationSchema

export default validationSchema;

export const loanFirstSetpSchema = Yup.object({
  loanamount: Yup.string().required("Required"),
  numberofmonth: Yup.number()
    .min(1, "Please enter a number from 1 to 24")
    .max(24, "Please enter a number from 1 to 24")
    .required("Required"),
});

export const updateUserValidationSchema = Yup.object({
  editFullName: Yup.string().required("Required"),
  editEmail: Yup.string().email("Invalid email format").required("Required"),
  editPhone: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(11, "Must be exactly 11 digits")
    .max(11, "Must be exactly 11 digits"),
  editUsername: Yup.string().required("Required"),
  // editPassword: Yup.string()
  //   .required("Password is required")
  //   .matches(
  //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  //     "Password must be at least 8 characters, contain one uppercase letter, one lowercase letter, and one digit"
  //   ),
  editUserType: Yup.string().required("Required"),
});
