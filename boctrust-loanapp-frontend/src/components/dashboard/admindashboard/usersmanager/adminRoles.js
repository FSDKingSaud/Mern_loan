// admin roles options
const adminRoles = [
  { value: "create_user", label: "Create User" },
  { value: "update_user", label: "Update User" },
  { value: "delete_user", label: "Delete User" },
  { value: "view_user", label: "View User" },
  { value: "customer_request", label: "Process Customer Request" },
  { value: "my_loan", label: "My Loan" },
  { value: "add_loan_product", label: "Add Loan Product" },
  { value: "update_loan_product", label: "Update Loan Product" },
  { value: "delete_loan_product", label: "Delete Loan Product" },
  { value: "view_loan_product", label: "View Loan Product" },
  { value: "view_loan_repayment", label: "View Loan Repayment" },
  { value: "delete_loan_repayment", label: "Delete Loan Repayment" },
  { value: "add_new_account", label: "Add New Account Type" },
  { value: "edit_account", label: "Edit Account Type" },
  { value: "delete_account", label: "Delete Account Type" },
  // { value: "withdrawal_request", label: "Process Withdrawal Request" },
  { value: "manage_transaction", label: "Manage Transaction" },
  // { value: "delete_transaction", label: "Delete Transaction" },
  { value: "view_report", label: "View Report" },
  { value: "delete_report", label: "Delete Report" },
  { value: "get_salary_history", label: "Get Salary History" },
  { value: "remita_approval", label: "Remita Loan Approval" },
  { value: "stop_remita_loan", label: "Stop Remita Loan" },
  { value: "credit_assesment", label: "Credit Assesment" },
  { value: "credit_assesment_approval", label: "Credit Assesment Approval" },
  { value: "kyc_review", label: "KYC Review" },
  { value: "employer_manager", label: "Employer Manager" },
  { value: "manage_branch", label: "Manage Bank Branch" },
];

export default adminRoles;

export const allUserRoles = {
  operation_staff: {
    can: [
      "kycReviewManagement",
      "readKycReview",
      "readloans",
      "loanManagement",
    ],
    shouldNotSee: [
      "creaditAssessment",
      "employerManament",
      "userManagement",
      "systemSetting",
    ],
  },
  marketing_staff: {
    can: ["readothers"],
    shouldNotSee: [
      "creaditAssessment",
      "employerManament",
      "userManagement",
      "systemSetting",
    ],
  },
  credit_analyst: {
    can: ["creaditAssessment", "salaryHistoryCheck"],
    shouldNotSee: [
      "websiteManagement",
      "employerManament",
      "userManagement",
      "systemSetting",
    ],
  },
  coo: {
    can: [
      "approveTransactions",
      "approveCreditAssesment",
      "bookLoans",
      "viewUsers",
      "viewRemitaCollections",
      "manageRemitaCollections",
      "loadDisbursment",
    ],
    shouldNotSee: ["systemSetting"],
  },
};
