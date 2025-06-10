/*


{
            "_id": "668efc60c1fbcf42e23bf601",
            "value": "super_admin",
            "label": "Super Admin",
            "description": "Manages all the activities on the platform here",
            "can": [
                "",
                "viewKycReview",
                "kycReviewManagement",
                "readLoans",
                "loanManagement",
                "loanDisbursment",
                "bookLoans",
                "approveTransactions",
                "viewRemitaCollections",
                "manageRemitaCollections",
                "salaryHistoryCheck",
                "creaditAssessment",
                "viewCreaditAssessment",
                "approveCreditAssesment",
                "employerManament",
                "viewEmployers",
                "websiteManagement",
                "viewWebsiteManagement",
                "userManagement",
                "viewUsers",
                "systemSettingManagement",
                "viewSystemSetting",
                "cooApproval",
                "headOfCreditApproval",
                "approveBookLoan"
            ],
            "shouldNotSee": [
                ""
            ],

*/

const checkPermission = async ({ roles, searchRole }) => {
  try {
    const found = roles.find((role) => role == searchRole);
    if (found) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = {
  checkPermission,
};
