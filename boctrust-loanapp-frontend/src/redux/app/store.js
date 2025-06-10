import { configureStore } from "@reduxjs/toolkit";
import fetchJobs from "../reducers/fetchJobs";
import userSlice from "../reducers/userSlice";
import blogReducer from "../reducers/blogReducer";
import productReducer from "../reducers/productReducer";
import wikiReducer from "../reducers/wikiReducer";
import careerReducer from "../reducers/careerReducer";
import contactFormReducer from "../reducers/contactFormReducer";
import branchReducer from "../reducers/branchReducer";
import accountReducer from "../reducers/accountReducer";
import customerReducer from "../reducers/customerReducer";
import customersLoansReducer from "../reducers/customersLoansReducer";
import disbursementMethodReducer from "../reducers/disbursementMethodReducer";
import employersManagerReducer from "../reducers/employersManagerReducer";
import mandateRuleReducer from "../reducers/mandateRuleReducer";
import statementRuleReducer from "../reducers/statementRuleReducer";
import employerLetterRuleReducer from "../reducers/employerLetterRuleReducer";
import adminUserReducer from "../reducers/adminUserReducer";
import loanOfficerReducer from "../reducers/loanOfficerReducer";
import authReducer from "../reducers/adminAuthReducer";
import settingReducer from "../reducers/settingReducer";
import onboardingReducer from "../reducers/onboardingReducer";
import siteContentReducer from "../reducers/siteContentReducer";
import directors from "../reducers/boardDirectorReducer";
import frontPageProductReducer from "../reducers/frontPageProductsReducer";
import loanReducer from "../reducers/loanReducer";
import transactionReducer from "../reducers/transactionReducer";
import creditAnalysisReducer from "../reducers/creditAnalysisReducer";
import allLoansReducer from "../reducers/allLoansReducer.js";
import notificationReducer from "../reducers/notificationReducer.js";
// create a store
const store = configureStore({
  reducer: {
    // add reducers here
    fetchJobs,
    blogReducer,
    productReducer,
    wikiReducer,
    careerReducer,
    contactFormReducer,
    customersLoansReducer,
    branchReducer,
    accountReducer,
    customerReducer,
    loanReducer,
    transactionReducer,
    disbursementMethodReducer,
    adminUserReducer,
    loanOfficerReducer,
    employersManagerReducer,
    employerLetterRuleReducer,
    mandateRuleReducer,
    statementRuleReducer,
    user: userSlice,
    creditAnalysis: creditAnalysisReducer,
    adminAuth: authReducer,
    settingReducer,
    onboarding: onboardingReducer,
    siteContent: siteContentReducer,
    directors,
    frontPageProduct: frontPageProductReducer,
    allLoansReducer,
    notificationReducer,
  },
});

export default store;
