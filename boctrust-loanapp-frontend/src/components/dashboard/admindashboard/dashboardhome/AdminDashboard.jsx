/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import "../../Dashboard.css";
import AccountDashboard from "../account/AccountDashboard";
import AccountTypes from "../account/AccountTypes";
import CreditBureauDashboard from "../creditbureau/CreditBureauDashboard";
import CustomersDashboard from "../customers/CustomersDashboard";
import AddCustomer from "../customers/AddCustomer";
// import CustomersRequest from "../customers/CustomersRequest";
import HomeDashboard from "./HomeDashboard";
import Branches from "../branches/Branches";
import MdasEmployers from "../employersmanager/MdasEmployers";
import AddEmployer from "../employersmanager/AddEmployer";
import MandateRules from "../employersmanager/MandateRules";
import KycCheck from "../kyc/KycCheck";
// import GovernmentID from "../kyc/GovernmentID";
// import FacialCapture from "../kyc/FacialCapture";
import ReviewSignature from "../kyc/ReviewSignature";
// import OtherDocuments from "../kyc/OtherDocuments";
import LoanDashboard from "../loan/LoanDashboard";
import PendingLoans from "../loan/PendingLoans";
// import ActiveLoans from "../loan/ActiveLoans";
import LoanCalculator from "../loan/LoanCalculator";
import LoanProducts from "../loan/LoanProducts";
import RemitaDashboard from "../remita/RemitaDashboard";
import CheckSalaryHistory from "../remita/CheckSalaryHistory";
import CollectionNotifications from "../remita/CollectionNotifications";
import MandateHistory from "../remita/MandateHistory";
import StopCollection from "../remita/StopCollection";
// import AccountStatement from "../report/accountstatement/AccountStatement";
// import AccountBalance from "../report/accountbalance/AccountBalance";
// import LoanReport from "../report/loanreport/LoanReport";
import LoanDueReport from "../report/loanduereport/LoanDueReport";
// import TransactionReport from "../report/transactionreport/TransactionReport";
// import ExpenseReport from "../report/expensereport/ExpenseReport";
// import RevenueReport from "../report/revenuereport/RevenueReport";
import TransactionDashboard from "../transaction/TransactionDashboard";
import UserManagerDashboard from "../usersmanager/UserManagerDashboard";
import WebsiteManagerDashboard from "../website/WebsiteManagerDashboard";
// import WithdrawRequestDashboard from "../withdraw/WithdrawRequestDashboard";
// import WithdrawMethodDashboard from "../withdrawmethod/WithdrawMethodDashboard";
import AddWiki from "../website/AddWiki";
import CustomerAsk from "../website/CustomerAsk";
import StatementRules from "../employersmanager/StatementRules";
// import AllWebsitePages from "../website/AllWebsitePages";
import ContactForm from "../website/ContactForm";
import LoanDisbursement from "../loan/LoanDisbursement";
// import BalanceEnquiry from "../loan/BalanceEnquiry";
import LoanStatement from "../loan/LoanStatement";
import PostJobs from "../website/PostJobs";
import JobApplicationsList from "../website/JobApplicationsList";
import GeneralSettings from "../generalSetting/GeneralSettings";
import EmailSetting from "../generalSetting/EmailSetting";
import GoogleAnalytics from "../generalSetting/GoogleAnalytics";
import DebitTransactions from "../nibssDirectDebit/DebitTransactions";
import CollectionSummary from "../nibssDirectDebit/CollectionSummary";
import DebitMandates from "../nibssDirectDebit/DebitMandates";
import StopRestartCollections from "../nibssDirectDebit/StopRestartCollections";
import EmploymentLetterRule from "../employersmanager/EmploymentLetterRule";
import ManageUserRole from "../usersmanager/ManageUserRole";
import ManageAccessControl from "../usersmanager/ManageAccessControl";
import HomeEditor from "../website/HomeEditor";
import AboutEditor from "../website/AboutEditor";
import ProductPageEditor from "../website/ProductPageEditor";
import BoardOfDirectorEditor from "../website/BoardOfDirectorEditor";
import BookLoans from "../loan/BookLoans";
import CompletedLoans from "../loan/CompletedLoans";
import OverdueLoans from "../loan/OverdueLoans";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../../../layouts/AdminLayout";
import CreateNewAdmin from "../usersmanager/CreateNewAdmin";
import RepaymentDashboard from "../repayment/RepaymentDashboard";
import LoanTopUpRequest from "../loan/LoanTopUpRequest";
import AdminAccountStatement from "../../dashboardcomponents/report/AdminAccountStatement";
import AdminAccountBalance from "../../dashboardcomponents/report/AdminAccountBalance";
import AdminGenerateReport from "../../dashboardcomponents/report/AdminGenerateReport";
import ConsentCookieAnalytics from "../consentCookie/ConsentCookieAnalytics";
import AwaitingMandates from "../nibssDirectDebit/AwaitingMandates";
import CreatedMandates from "../nibssDirectDebit/CreatedMandates";
import ApprovedMandates from "../nibssDirectDebit/ApprovedMandates";
import Notifications from "../../notifications/Notification";
import TerminatedLoans from "../loan/TerminatedLoans";

const AdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("dashboard");
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  // scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentComponent]);

  const handleMenuItemClick = (e) => {
    // e.preventDefault();
    const id = e.target.id;

    setCurrentComponent(id);
    switch (id) {
      case "dashboard":
        setCurrentTitle("Dashboard");
        break;
      case "debitTransactions":
        setCurrentTitle("Loan Repayment - Debit Transactions");
        break;
      case "collectionsSummary":
        setCurrentTitle("Loan Repayment - Collections Summary");
        break;
      case "debitMandates":
        setCurrentTitle("Debit Mandate Rule");
        break;
      case "stopRestartCollections":
        setCurrentTitle("Stop/Restart Collections");
        break;
      case "branches":
        setCurrentTitle("Branches");
        break;
      case "customer":
        setCurrentTitle("Customer List");
        break;
      case "addcustomer":
        setCurrentTitle("Add New Customer");
        break;
      case "customerrequest":
        setCurrentTitle("Customers Request");
        break;
      case "myloan":
        setCurrentTitle("Loan Dashboard");
        break;
      case "pendingloans":
        setCurrentTitle("Pending Loans");
        break;
      case "bookloans":
        setCurrentTitle("Book Loans");
        break;
      case "completedloans":
        setCurrentTitle("Completed Loans");
        break;
      case "overdueloans":
        setCurrentTitle("Overdue Loans");
        break;
      case "loancalculator":
        setCurrentTitle("Loan Calculator");
        break;
      case "loantopup":
        setCurrentTitle("Loan Top-up Request");
        break;
      case "loanproducts":
        setCurrentTitle("Loan Products");
        break;
      case "loandisbursement":
        setCurrentTitle("Loan Disbursement");
        break;
      case "balanceenquiry":
        setCurrentTitle("Balance Enquiry");
        break;

      case "loanstatement":
        setCurrentTitle("Loan Statement");
        break;
      case "repayment":
        setCurrentTitle("Loan Repayment");
        break;
      case "transfer":
        setCurrentTitle("Transfer Money");
        break;

      case "accounts":
        setCurrentTitle("Accounts");
        break;
      case "accounttypes":
        setCurrentTitle("Account Types");
        break;

      case "transaction":
        setCurrentTitle("Transaction History");
        break;
      case "remita":
        setCurrentTitle("Loan Disbursements");
        break;
      case "checksalaryhistory":
        setCurrentTitle("Check Salary History");
        break;
      case "collectionnotifications":
        setCurrentTitle("Collection Notification");
        break;
      case "mandatehistory":
        setCurrentTitle("Mandate History");
        break;
      case "stopcollections":
        setCurrentTitle("Stop Collections Dashboard");
        break;
      case "creditbureau":
        setCurrentTitle("Credit Assessment");
        break;
      case "mdas":
        setCurrentTitle("Employers/MDAs Manager");
        break;
      case "addemployer":
        setCurrentTitle("Employers/MDAs Manager");
        break;
      case "mandaterules":
        setCurrentTitle("Employers/MDAs Manager");
        break;
      case "statementrules":
        setCurrentTitle("Employers/MDAs Manager");
        break;
      case "employmentletter":
        setCurrentTitle("Employers/MDAs Manager");
        break;
      case "kyc":
        setCurrentTitle("Check Customer KYC Details");
        break;
      case "employmentLetters":
        setCurrentTitle("Check Customer Employment Letters");
        break;
      case "bankStatements":
        setCurrentTitle("Check Customer Bank Statements");
        break;
      case "governmentid":
        setCurrentTitle("Check Government ID card Details");
        break;
      case "facialcapture":
        setCurrentTitle("Check Facial Capture Details");
        break;
      case "signature":
        setCurrentTitle("Check Customer Admin Review and Signature");
        break;
      case "otherdocs":
        setCurrentTitle("Check Customer Other Documents");
        break;
      case "webmanager":
        setCurrentTitle("Blogs Manager ");
        break;
      case "website":
        setCurrentTitle("Website Manager");
        break;
      case "addwiki":
        setCurrentTitle("Add New FAQs/Wiki");
        break;
      case "customerAsk":
        setCurrentTitle("Customer FAQ Request");
        break;
      case "career":
        setCurrentTitle("Careers/Jobs");
        break;
      case "job-applicants":
        setCurrentTitle("Job Applications List");
        break;
      case "contactForm":
        setCurrentTitle("Contact Us Record");
        break;
      // case "withdrawmethod":
      //   setCurrentTitle("Disbursement Methods");
      //   break;
      case "allusers":
        setCurrentTitle("User Manager");
        break;
      case "userrole":
        setCurrentTitle("User Roles");
        break;
      case "accesscontrol":
        setCurrentTitle(" Access Control");
        break;
      case "report":
        setCurrentTitle("Review Report");
        break;
      case "accountbalance":
        setCurrentTitle("Account Balance");
        break;
      case "loanreporting":
        setCurrentTitle("Loan Report");
        break;
      case "loanduereport":
        setCurrentTitle("Loan Due Report");
        break;
      case "transactionreport":
        setCurrentTitle("Transaction Report");
        break;
      case "expensereport":
        setCurrentTitle("Expense Report");
        break;
      case "revenuereport":
        setCurrentTitle("Revenue Report");
        break;
      case "general":
        setCurrentTitle("General Settings");
        break;
      case "email":
        setCurrentTitle("Email Template");
        break;
      case "googleanalytic":
        setCurrentTitle("Google Analytics");
        break;
      case "homeEditor":
        setCurrentTitle("Home Page Editor");
        break;
      case "aboutEditor":
        setCurrentTitle("About Page Editor");
        break;
      case "boardEditor":
        setCurrentTitle("Board of Directors Editor");
        break;
      case "productEditor":
        setCurrentTitle("Our Products Page Editor");
        break;
      default:
        setCurrentTitle("Dashboard");
        break;
    }
    setShowSidebar(false);
  };

  return (
    <Routes>
      <Route
        element={
          <AdminLayout
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            currentTitle={currentTitle}
            onMenuItemClick={handleMenuItemClick}
          />
        }
      >
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="branches" element={<Branches />} />
        <Route path="customers">
          <Route index element={<CustomersDashboard />} />
          <Route path="addcustomer" element={<AddCustomer />} />
        </Route>
        <Route path="loans">
          <Route index element={<LoanDashboard />} />
          <Route path="pending" element={<PendingLoans />} />
          <Route path="book" element={<BookLoans />} />
          <Route path="disburse" element={<LoanDisbursement />} />
          <Route path="completed" element={<CompletedLoans />} />
          <Route path="terminated" element={<TerminatedLoans />} />
          <Route path="overdue" element={<OverdueLoans />} />
          <Route path="topup" element={<LoanTopUpRequest />} />
          <Route path="products" element={<LoanProducts />} />
          <Route path="calculator" element={<LoanCalculator />} />
          {/* <Route path="balanceenquiry" element={<BalanceEnquiry />} /> */}
          <Route path="loanstatement" element={<LoanStatement />} />
        </Route>

        <Route path="accounts">
          <Route index element={<AccountDashboard />} />
          <Route path="types" element={<AccountTypes />} />
        </Route>
        <Route path="transactions" element={<TransactionDashboard />} />
        <Route path="nibbs">
          <Route index element={<DebitTransactions />} />
          <Route path="awaitingMandates" element={<AwaitingMandates />} />
          <Route path="createdMandates" element={<CreatedMandates />} />
          <Route path="approvedMandates" element={<ApprovedMandates />} />
          <Route path="collectionsSummary" element={<CollectionSummary />} />
          <Route path="debitMandates" element={<DebitMandates />} />
          <Route
            path="stopRestartCollections"
            element={<StopRestartCollections />}
          />
        </Route>
        <Route path="remita">
          <Route index element={<CheckSalaryHistory />} />
          <Route path="disbursement" element={<RemitaDashboard />} />
          <Route path="notification" element={<CollectionNotifications />} />
         
          <Route path="mandatehistory" element={<MandateHistory />} />
          <Route path="stopcollections" element={<StopCollection />} />
        </Route>
        <Route path="repayments" element={<RepaymentDashboard />} />
        <Route path="creditbureau" element={<CreditBureauDashboard />} />
        <Route path="mdas">
          <Route index element={<MdasEmployers />} />
          <Route path="addemployer" element={<AddEmployer />} />
          <Route path="mandaterules" element={<MandateRules />} />
          <Route path="statementrules" element={<StatementRules />} />
          <Route path="employmentletter" element={<EmploymentLetterRule />} />
        </Route>
        <Route path="kyc">
          <Route index element={<KycCheck />} />
          <Route path="report" element={<ReviewSignature />} />
          <Route path="employmentLetters" element={<KycCheck />} />
          <Route path="bankStatements" element={<KycCheck />} />
        </Route>
        <Route path="webmanager">
          <Route index element={<WebsiteManagerDashboard />} />
          <Route path="contactForm" element={<ContactForm />} />
          <Route path="addwiki" element={<AddWiki />} />
          <Route path="customerAsk" element={<CustomerAsk />} />
          <Route path="career" element={<PostJobs />} />
          <Route path="job-applicants" element={<JobApplicationsList />} />
          <Route path="homeEditor" element={<HomeEditor />} />
          <Route path="aboutEditor" element={<AboutEditor />} />
          <Route path="boardEditor" element={<BoardOfDirectorEditor />} />
          <Route path="productEditor" element={<ProductPageEditor />} />
        </Route>
        <Route path="users">
          <Route index element={<UserManagerDashboard />} />
          <Route path="add" element={<CreateNewAdmin />} />
          <Route path="roles" element={<ManageUserRole />} />
          <Route path="accesscontrol" element={<ManageAccessControl />} />
        </Route>
        <Route path="report">
          <Route index element={<AdminAccountStatement />} />
          <Route path="accountbalance" element={<AdminAccountBalance />} />
          <Route path="loan" element={<AdminGenerateReport />} />
          <Route path="loandue" element={<LoanDueReport />} />
        </Route>
        <Route path="settings">
          <Route index element={<GeneralSettings />} />
          <Route path="email" element={<EmailSetting />} />
          <Route path="googleanalytics" element={<GoogleAnalytics />} />
          <Route path="consent-cookie" element={<ConsentCookieAnalytics />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminDashboard;
