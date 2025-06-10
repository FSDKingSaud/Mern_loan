import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import "../../Dashboard.css";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import { NavLink, useLocation } from "react-router-dom";

const SideNavMain = ({ onMenuItemClick }) => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // role based menu
  const [superAdmin, setSuperAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);
  const [shouldNotSee, setShouldNotSee] = useState([]);

  const location = useLocation();

  useEffect(() => {
    if (currentUser) {
      if (currentUser?.userType === "super_admin") {
        setSuperAdmin("super_admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);

      setShouldNotSee(currentUser?.userRole?.shouldNotSee);
    }
  }, [currentUser]);

  useEffect(() => {
    const pathList = location.pathname.split("/");
    setActiveSection(pathList.length > 2 ? pathList[2] : pathList[1]);
  }, []);

  const checkSectionActive = (key) => {
    return activeSection === key;
  };

  return (
    <div className="NavIcons SideMain FixSideNav">
      <div className="BrandCon mb-4">
        <div className=" LgLogo">
          <img src="/images/dlogo.png" alt="boctrust-logo" />
        </div>
        <p className="text-capitalize">{currentUser?.userRole?.label}</p>
      </div>

      <div
        className={`link__wrap  ${
          checkSectionActive("dashboard") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("dashboard");
        }}
      >
        <NavLink
          id="dashboard"
          to="/dashboard"
          onClick={onMenuItemClick}
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
          end
        >
          <img
            onClick={onMenuItemClick}
            src="/images/ddashboard.png"
            alt="dashboard"
          />
          <p>Dashboard</p>
        </NavLink>
      </div>

      <div
        className={`link__wrap  ${
          checkSectionActive("branches") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("branches");
        }}
      >
        <NavLink
          id="branches"
          to="/dashboard/branches"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img src="/images/dmda.png" alt="branches" />
          <p id="branches">Branches</p>
        </NavLink>
      </div>

      {/* Menu with sub item */}
      <div
        className={`link__wrap ${
          checkSectionActive("customers") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("customers");
        }}
      >
        <div className="IconBox">
          <img src="/images/dprofile.png" alt="customers" />
          <p>Customers</p>
        </div>
        {checkSectionActive("customers") ? (
          <div className="SubItem">
            <ul>
              <li>
                <NavLink
                  id="customer"
                  onClick={onMenuItemClick}
                  to={"/dashboard/customers"}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  All Customers
                </NavLink>
              </li>
              {/* {superAdmin || adminRoles?.includes("customer_request") ? (
                <li id="customerrequest" onClick={onMenuItemClick}>
                  Customer Request
                </li>
              ) : null} */}
            </ul>
          </div>
        ) : null}
      </div>

      {/* loans menu */}

      <div
        className={`link__wrap ${
          checkSectionActive("loans") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("loans");
        }}
      >
        <div className="IconBox">
          <img src="/images/dmyloan.png" alt="loan" />
          <p>Loans</p>
        </div>
        {checkSectionActive("loans") ? (
          <div className="SubItem">
            <ul>
              <li>
                <NavLink
                  id="myloan"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  All Loans
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="pendingloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/pending"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Pending Loan
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="bookloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/book"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Book Loans
                </NavLink>
              </li>

              {/* updated */}
              <li>
                <NavLink
                  id="loandisbursement"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/disburse"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Disburse Loans
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="completedloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/completed"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Completed Loans
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="terminatedLoans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/terminated"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Terminated Loans
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="overdueloans"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/overdue"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Overdue Loans
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="loantopup"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/topup"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Top-up Requests
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="loanproducts"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/products"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Loan Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="loancalculator"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/calculator"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Loan Calculator
                </NavLink>
              </li>

              <li>
                <NavLink
                  id="loanstatement"
                  onClick={onMenuItemClick}
                  to="/dashboard/loans/loanstatement"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Loan A/C Statement
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* repayment menu */}
      {/* <div
        className={`link__wrap  ${
          checkSectionActive("repayment") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("repayment");
        }}
      >
        <NavLink
          to="/dashboard/repayment"
          id="repayment"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img id="repayment" src="/images/dtransfer.png" alt="repayment" />
          <p id="repayment">Repayments</p>
        </NavLink>
      </div> */}

      {/* account menu */}
      <div
        className={`link__wrap ${
          checkSectionActive("accounts") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("accounts");
        }}
      >
        <div className="IconBox">
          <img src="/images/daccount.png" alt="accounts" />
          <p>Accounts</p>
        </div>
        {checkSectionActive("accounts") ? (
          <div className="SubItem">
            <ul>
              <li>
                <NavLink
                  id="accounts"
                  onClick={onMenuItemClick}
                  to="/dashboard/accounts"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  All Accounts
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="accounttypes"
                  onClick={onMenuItemClick}
                  to="/dashboard/accounts/types"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Account Types
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* disbursement menu */}
      {/* <div id="withdraw" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdraw"
          onClick={onMenuItemClick}
          src="/images/dwithdraw.png"
          alt="withdrawer"
        />
        <p id="withdraw" onClick={onMenuItemClick}>
          Disbursements
        </p>
      </div> */}

      <div
        className={`link__wrap  ${
          checkSectionActive("repayments") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("repayments");
        }}
      >
        <NavLink
          id="transaction"
          to="/dashboard/repayments"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img id="transaction" src="/images/daccount.png" alt="transaction" />
          <p id="repayment">Repayments</p>
        </NavLink>
      </div>

      {/* NIBSS Menu with sub item */}
      <div
        className={`link__wrap ${
          checkSectionActive("nibss") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("nibss");
        }}
      >
        <div className="IconBox">
          <img src="/images/dwithdraw.png" alt="nibss" />
          <p>NIBSS Direct Debit</p>
        </div>
        {checkSectionActive("nibss") ? (
          <div className="SubItem">
            <ul>
              <li>
                {/* <NavLink
                  id="debitMandates"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/nibbs/debitMandates"
                >
                  Debit Mandates
                </NavLink> */}
                <NavLink
                  id="awaitingMandates"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/nibbs/awaitingMandates"
                >
                  Awaiting Mandates
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="createdMandates"
                  onClick={onMenuItemClick}
                  to="/dashboard/nibbs/createdMandates"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  Created Mandates
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="approvedMandates"
                  onClick={onMenuItemClick}
                  to="/dashboard/nibbs/approvedMandates"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  Approved Mandates
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="debitTransactions"
                  onClick={onMenuItemClick}
                  to="/dashboard/nibbs"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  Debit Transactions
                </NavLink>
              </li>
              {superAdmin || adminRoles?.includes("manage_nibss") ? (
                <li>
                  <NavLink
                    id="collectionsSummary"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/nibbs/collectionsSummary"
                  >
                    Collections Summary
                  </NavLink>
                </li>
              ) : null}

              {superAdmin || adminRoles?.includes("manage_nibss") ? (
                <li>
                  <NavLink
                    id="stopRestartCollections"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/nibbs/stopRestartCollections"
                  >
                    Stop/Restart Collections
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      <div
        className={`link__wrap ${
          checkSectionActive("remita") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("remita");
        }}
      >
        <div className="IconBox">
          <img src="/images/dremita.png" alt="remita" />
          <p>Remita Collections</p>
        </div>
        {checkSectionActive("remita") ? (
          <div className="SubItem">
            <ul>
              {superAdmin || adminRoles?.includes("salaryHistoryCheck") ? (
                <li>
                  <NavLink
                    id="checksalaryhistory"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/remita"
                    end
                  >
                    Check Salary History
                  </NavLink>
                </li>
              ) : null}

              <li>
                <NavLink
                  id="remita"
                  onClick={onMenuItemClick}
                  to="/dashboard/remita/disbursement"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Loan Disbursements
                </NavLink>
              </li>

              <li>
                <NavLink
                  id="collectionnotifications"
                  onClick={onMenuItemClick}
                  to="/dashboard/remita/notification"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                >
                  Collection Notification
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="mandatehistory"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/remita/mandatehistory"
                >
                  Mandate History
                </NavLink>
              </li>
              {superAdmin || adminRoles?.includes("stopRemitaLoan") ? (
                <li>
                  <NavLink
                    id="stopcollections"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    onClick={onMenuItemClick}
                    to="/dashboard/remita/stopcollections"
                  >
                    Stop Collections
                  </NavLink>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </div>

      {(superAdmin || !shouldNotSee?.includes("creditAssessment")) && (
        <div
          className={`link__wrap  ${
            checkSectionActive("creditbureau") ? "section__active" : ""
          }`}
          onClick={(e) => {
            onMenuItemClick(e);
            setActiveSection("creditbureau");
          }}
        >
          <NavLink
            to="/dashboard/creditbureau"
            id="creditbureau"
            className={({ isActive }) =>
              `IconBox ${isActive ? "link_active " : ""}`
            }
          >
            <img
              id="creditbureau"
              src="/images/dreport.png"
              alt="creditbureau"
            />
            <p id="creditbureau">Credit Assessment</p>
          </NavLink>
        </div>
      )}

      {superAdmin || !shouldNotSee?.includes("employerManager") ? (
        <div
          className={`link__wrap ${
            checkSectionActive("mdas") ? "section__active" : ""
          }`}
          onClick={() => {
            setActiveSection("mdas");
          }}
        >
          <div className="IconBox">
            <img src="/images/dmda.png" alt="mdas" />
            <p>Employer Manager</p>
          </div>
          {checkSectionActive("mdas") ? (
            <div className="SubItem">
              <ul>
                <li>
                  <NavLink
                    id="mdas"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    All Employers
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="addemployer"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/addemployer"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                  >
                    Add Employer
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="mandaterules"
                    onClick={onMenuItemClick}
                    to="/dashboard/mdas/mandaterules"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                  >
                    Mandate Rules
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="statementrules"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/mdas/statementrules"
                  >
                    Statement Rules
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="employmentletter"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/mdas/employmentletter"
                  >
                    Employment Letter
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      {superAdmin || !shouldNotSee?.includes("kycReview") ? (
        <div
          className={`link__wrap ${
            checkSectionActive("kyc") ? "section__active" : ""
          }`}
          onClick={() => {
            setActiveSection("kyc");
          }}
        >
          <div className="IconBox">
            <img src="/images/dkyc.png" alt="kyc" />
            <p>KYC Review</p>
          </div>

          {checkSectionActive("kyc") ? (
            <div className="SubItem">
              <ul>
                <li>
                  <NavLink
                    id="kyc"
                    onClick={onMenuItemClick}
                    to="/dashboard/kyc"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    Do KYC Review
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="report"
                    onClick={onMenuItemClick}
                    to="/dashboard/kyc/report"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                  >
                    Review Report
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className={`link__wrap ${
          checkSectionActive("webmanager") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("webmanager");
        }}
      >
        {(superAdmin || !shouldNotSee?.includes("websiteManager")) && (
          <div className="IconBox">
            <img src="/images/dwebsite.png" alt="webmanager" />
            <p>Website Manager</p>
          </div>
        )}

        {checkSectionActive("webmanager") && (
          <div className="SubItem">
            <ul>
              {/* <li id="website" onClick={onMenuItemClick}>
                All Pages
              </li> */}
              <li>
                <NavLink
                  id="webmanager"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  Blogs
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="contactForm"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/contactForm"
                >
                  Contact Form
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="addwiki"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/addwiki"
                >
                  Wikis/FAQs
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="customerAsk"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/customerAsk"
                >
                  Customer Enquiry
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="career"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/career"
                >
                  Careers
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="job-applicants"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/job-applicants"
                >
                  Job Applications
                </NavLink>
              </li>
              <li>
                <NavLink
                  id="homeEditor"
                  onClick={onMenuItemClick}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  to="/dashboard/webmanager/homeEditor"
                >
                  Home Page
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="aboutEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/aboutEditor"
                >
                  About Page
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="boardEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/boardEditor"
                >
                  Directors
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="productEditor"
                  onClick={onMenuItemClick}
                  to="/dashboard/webmanager/productEditor"
                >
                  Products Pages
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* <div id="withdrawmethod" className="IconBox" onClick={onMenuItemClick}>
        <img
          id="withdrawmethod"
          onClick={onMenuItemClick}
          src="/images/dwithdrawmethod.png"
          alt="withdrawmethod"
        />
        <p id="withdrawmethod" onClick={onMenuItemClick}>
          Disbursement Methods
        </p>
      </div> */}

      {(superAdmin || !shouldNotSee?.includes("userManager")) && (
        <div
          className={`link__wrap ${
            checkSectionActive("users") ? "section__active" : ""
          }`}
          onClick={() => {
            setActiveSection("users");
          }}
        >
          <div className="IconBox">
            <img src="/images/dusermanage.png" alt="usermanager" />
            <p>User Manager</p>
          </div>
          {checkSectionActive("users") ? (
            <div className="SubItem">
              <ul>
                <li>
                  <NavLink
                    id="allusers"
                    onClick={onMenuItemClick}
                    to="/dashboard/users"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    All Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="userrole"
                    onClick={onMenuItemClick}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    to="/dashboard/users/roles"
                  >
                    User Roles
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    id="accesscontrol"
                    onClick={onMenuItemClick}
                    to="/dashboard/users/accesscontrol"
                  >
                    Access Control
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <div
        className={`link__wrap ${
          checkSectionActive("report") ? "section__active" : ""
        }`}
        onClick={() => {
          setActiveSection("report");
        }}
      >
        <div className="IconBox">
          <img src="/images/dreport.png" alt="report" />
          <p>Reports</p>
        </div>

        {checkSectionActive("report") ? (
          <div className="SubItem">
            <ul>
              <li>
                <NavLink
                  id="report"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  onClick={onMenuItemClick}
                  to="/dashboard/report"
                  end
                >
                  Account Statement
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="accountbalance"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/accountbalance"
                >
                  Account Balance
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="loanreporting"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/loan"
                >
                  Loan Report
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {(superAdmin || !shouldNotSee?.includes("userManager")) && (
        <div
          className={`link__wrap ${
            checkSectionActive("settings") ? "section__active" : ""
          }`}
          onClick={() => {
            setActiveSection("settings");
          }}
        >
          <div className="IconBox">
            <img src="/images/dreport.png" alt="settings" />
            <p>Settings</p>
          </div>

          {checkSectionActive("settings") ? (
            <div className="SubItem">
              <ul>
                <li>
                  <NavLink
                    id="general"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    General
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    id="email"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings/email"
                  >
                    Email
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    id="googleanalytics"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings/googleanalytics"
                  >
                    Google Analytics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    id="consent-cookie"
                    onClick={onMenuItemClick}
                    to="/dashboard/settings/consent-cookie"
                  >
                    Cookie Consent
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

SideNavMain.propTypes = {
  onMenuItemClick: PropTypes.func,
};

export default SideNavMain;
