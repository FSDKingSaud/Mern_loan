/* eslint-disable no-undef */
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import DashboardHome from "./dashboardcomponents/DashboardHome";
import MyLoan from "./dashboardcomponents/myloan/MyLoan";
import ApplyLoan from "./dashboardcomponents/myloan/ApplyLoan";
import LoanCalculator from "./dashboardcomponents/myloan/LoanCalculator";
import LoanPayment from "./dashboardcomponents/repayments/LoanPayment";
import TransferMoney from "./dashboardcomponents/transferdashboard/TransferMoney";
import WithdrawMoney from "./dashboardcomponents/withdrawer/WithdrawMoney";
import MyProfile from "./dashboardcomponents/myprofile/MyProfile";
import Report from "./dashboardcomponents/report/Report";
import TransactionReport from "./dashboardcomponents/report/TransactionReport";
import AccountBalance from "./dashboardcomponents/report/AccountBalance";
import AccountTransaction from "./dashboardcomponents/account/AccountTransaction";
import RemitaHistory from "./dashboardcomponents/remita/RemitaHistory";
import { Route, Routes } from "react-router-dom";
import CustomerLayout from "../../layouts/CustomerLayout";
import Notifications from "./notifications/Notification";
import TopupLoan from "./dashboardcomponents/myloan/TopupLoan";

const CustomerDashboard = () => {
  // get current login user
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentComponent, setCurrentComponent] = useState("dashboard");
  const [currentTitle, setCurrentTitle] = useState("Dashboard");

  const handleMenuItemClick = (e) => {
    const id = e.target.id;
    setCurrentComponent(id);
    switch (id) {
      case "dashboard":
        setCurrentTitle("Dashboard");
        break;
      case "myloan":
        setCurrentTitle("My Loan");
        break;
      case "applyloan":
        setCurrentTitle("My Loan");
        break;
      case "loancalculator":
        setCurrentTitle("My Loan");
        break;
      case "loanrepayment":
        setCurrentTitle("Loan Repayment");
        break;
      case "transfer":
        setCurrentTitle("Transfer Money");
        break;
      case "withdraw":
        setCurrentTitle("Withdraw Money");
        break;
      case "transaction":
        setCurrentTitle("Account Transactions");
        break;
      case "remita":
        setCurrentTitle("Remita History");
        break;
      case "profile":
        setCurrentTitle("My Profile");
        break;
      case "report":
        setCurrentTitle("Account Report");
        break;
      case "transactionreport":
        setCurrentTitle("Transaction Report");
        break;
      case "accountbalance":
        setCurrentTitle("Account Balances");
        break;
      default:
        setCurrentTitle("Dashboard");
        break;
    }
    setShowSidebar(false);
  };

  // scroll to the top of the page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentComponent]);

  return (
    <Routes>
      <Route
        element={
          <CustomerLayout
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            currentTitle={currentTitle}
            onMenuItemClick={handleMenuItemClick}
          />
        }
      >
        <Route path="/" element={<DashboardHome />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="loans">
          <Route index element={<MyLoan />} />

          <Route path="apply" element={<ApplyLoan />} />
          <Route path="calculator" element={<LoanCalculator />} />
          <Route path="topuploan" element={<TopupLoan />} />
        </Route>
        <Route path="repayment" element={<LoanPayment />} />
        <Route path="transfer" element={<TransferMoney />} />

        <Route path="withdraw" element={<WithdrawMoney />} />
        <Route path="transactions" element={<AccountTransaction />} />
       
        <Route path="remita">
          <Route index element={<RemitaHistory />} />
        </Route>
        <Route path="profile" element={<MyProfile />} />

        <Route path="report">
          <Route index element={<Report />} />
          <Route path="transaction" element={<TransactionReport />} />
          <Route path="accountbalance" element={<AccountBalance />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default CustomerDashboard;
