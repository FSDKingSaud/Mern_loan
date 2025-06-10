import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import apiClient from "../../lib/axios";
import PageLoader from "./shared/PageLoader";
import { faBullseye } from "@fortawesome/free-solid-svg-icons";

const SidebarMain = ({ onMenuItemClick }) => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userHasRemitaLoan, setUserHasRemitaLoan] = useState(false);
  const currentUser = useSelector((state) => state.adminAuth.user);
  const [isLoading, setIsLoading] = useState(faBullseye);
  const isAccountCreated = currentUser?.banking?.isAccountCreated;

  const customerCareer = currentUser?.careertype;

  useEffect(() => {
    const pathList = location.pathname.split("/");
    setActiveSection(pathList.length > 2 ? pathList[2] : pathList[1]);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        if (!currentUser) return;
        const { data } = await apiClient.get(
          `/loans/getUserRemitaLoans/${currentUser._id}`
        );

        if (data?.length > 0) {
          setUserHasRemitaLoan(true);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [currentUser]);

  const checkSectionActive = (key) => {
    return activeSection === key;
  };

  return (
    <div className="NavIcons SideMain FixSideNav">
      <div className="BrandCon">
        <div className=" LgLogo">
          <img src="/images/dlogo.png" alt="boctrust-logo" />
        </div>
        <p>Customer</p>
      </div>

      {isLoading && (
        <span class="badge badge-info my-2 d-flex justify-content-center">
          <PageLoader width="20px" />
        </span>
      )}

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
          style={() => ({
            pointerEvents: isAccountCreated ? "auto" : "none",
          })}
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
                  style={() => ({
                    pointerEvents: isAccountCreated ? "auto" : "none",
                  })}
                  onClick={onMenuItemClick}
                  to="/dashboard/loans"
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  My Loans
                </NavLink>
              </li>
              {currentUser && currentUser.topUpLoanEligibility.hasTopUpLoan && (
                <li>
                  <NavLink
                    id="topuploan"
                    onClick={onMenuItemClick}
                    to={"/dashboard/loans/topuploan"}
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    Top Up Loan
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink
                  style={() => ({
                    pointerEvents: isAccountCreated ? "auto" : "none",
                  })}
                  id="applyloan"
                  onClick={onMenuItemClick}
                  to={"/dashboard/loans/apply"}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  end
                >
                  Apply for Loan
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      <div
        className={`link__wrap  ${
          checkSectionActive("repayment") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("repayment");
        }}
      >
        <NavLink
          style={() => ({
            pointerEvents: isAccountCreated ? "auto" : "none",
          })}
          to="/dashboard/repayment"
          id="loanrepayment"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img id="loanrepayment" src="/images/dtransfer.png" alt="repayment" />
          <p id="loanrepayment">Repayments</p>
        </NavLink>
      </div>

      {customerCareer === "government employee" && userHasRemitaLoan ? (
        <div
          className={`link__wrap  ${
            checkSectionActive("remita") ? "section__active" : ""
          }`}
          onClick={(e) => {
            onMenuItemClick(e);
            setActiveSection("remita");
          }}
        >
          <NavLink
            style={() => ({
              pointerEvents: isAccountCreated ? "auto" : "none",
            })}
            to="/dashboard/remita"
            id="remita"
            className={({ isActive }) =>
              `IconBox ${isActive ? "link_active " : ""}`
            }
          >
            <img id="remita" src="/images/dremita.png" alt="remita" />
            <p id="remita">Remita History</p>
          </NavLink>
        </div>
      ) : null}

      {/* {customerCareer !== "government employee" ? (
        <div
          className={`link__wrap ${
            checkSectionActive("transfer") ? "section__active" : ""
          }`}
          onClick={() => {
            setActiveSection("transfer");
          }}
        >
          <div className="IconBox">
            <img id="transfer" src="/images/dtransfer.png" alt="transfer" />
            <p>Transfer Money</p>
          </div>
          {checkSectionActive("transfer") ? (
            <div className="SubItem">
              <ul>
                <li>
                  <NavLink
                    id="transfer"
                    onClick={onMenuItemClick}
                    to="/dashboard/transfer/other-banks"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                    end
                  >
                    Other Banks
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="transfer"
                    onClick={onMenuItemClick}
                    to="/dashboard/transfer/bocmfb"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                  >
                    BoctrustMfb Account
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    id="transfer"
                    onClick={onMenuItemClick}
                    to="/dashboard/transfer/own-accounts"
                    className={({ isActive }) =>
                      isActive ? "link_active" : ""
                    }
                  >
                    Own Accounts
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      ) : null} */}

      {customerCareer !== "government employee" ? (
        <div
          className={`link__wrap  ${
            checkSectionActive("transfer") ? "section__active" : ""
          }`}
          onClick={(e) => {
            onMenuItemClick(e);
            setActiveSection("transfer");
          }}
        >
          <NavLink
            style={() => ({
              pointerEvents: isAccountCreated ? "auto" : "none",
            })}
            to="/dashboard/transfer"
            id="transfer"
            className={({ isActive }) =>
              `IconBox ${isActive ? "link_active " : ""}`
            }
          >
            <img id="transfer" src="/images/dtransfer.png" alt="transfer" />
            <p>Transfer Money</p>
          </NavLink>
        </div>
      ) : null}

      {/* {customerCareer !== "government employee" &&
      customerCareer !== "private employee" ? (
        <div
          className={`link__wrap  ${
            checkSectionActive("withdraw") ? "section__active" : ""
          }`}
          onClick={(e) => {
            onMenuItemClick(e);
            setActiveSection("withdraw");
          }}
        >
          <NavLink
            to={"/dashboard/withdraw"}
            id="withdraw"
            className={({ isActive }) =>
              `IconBox ${isActive ? "link_active " : ""}`
            }
          >
            <img id="withdraw" src="/images/dtransfer.png" alt="withdraw" />
            <p id="withdraw">Withdrawal</p>
          </NavLink>
        </div>
      ) : null} */}

      <div
        className={`link__wrap  ${
          checkSectionActive("transactions") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("transactions");
        }}
      >
        <NavLink
          style={() => ({
            pointerEvents: isAccountCreated ? "auto" : "none",
          })}
          to={"/dashboard/transactions"}
          id="transaction"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img
            id="transaction"
            onClick={onMenuItemClick}
            src="/images/daccount.png"
            alt="account"
          />
          <p id="transaction"> Account Transactions</p>
        </NavLink>
      </div>

      {currentUser?.deductions === "remita" ? (
        <div
          className={`link__wrap  ${
            checkSectionActive("remita") ? "section__active" : ""
          }`}
          onClick={(e) => {
            onMenuItemClick(e);
            setActiveSection("remita");
          }}
        >
          <NavLink
            style={() => ({
              pointerEvents: isAccountCreated ? "auto" : "none",
            })}
            to={"/dashboard/remita"}
            id="remita"
            className={({ isActive }) =>
              `IconBox ${isActive ? "link_active " : ""}`
            }
          >
            <img
              id="remita"
              onClick={onMenuItemClick}
              src="/images/dreport.png"
              alt="profile"
            />
            <p id="remita"> Remita History</p>
          </NavLink>
        </div>
      ) : null}

      <div
        className={`link__wrap  ${
          checkSectionActive("profile") ? "section__active" : ""
        }`}
        onClick={(e) => {
          onMenuItemClick(e);
          setActiveSection("profile");
        }}
      >
        <NavLink
          style={() => ({
            pointerEvents: isAccountCreated ? "auto" : "none",
          })}
          to={"/dashboard/profile"}
          id="profile"
          className={({ isActive }) =>
            `IconBox ${isActive ? "link_active " : ""}`
          }
        >
          <img id="profile" src="/images/dprofile.png" alt="profile" />
          <p id="profile">Profile</p>
        </NavLink>
      </div>

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
                  style={() => ({
                    pointerEvents: isAccountCreated ? "auto" : "none",
                  })}
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
                  style={() => ({
                    pointerEvents: isAccountCreated ? "auto" : "none",
                  })}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="transactionreport"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/transaction"
                >
                  Transaction Report
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={() => ({
                    pointerEvents: isAccountCreated ? "auto" : "none",
                  })}
                  className={({ isActive }) => (isActive ? "link_active" : "")}
                  id="accountbalance"
                  onClick={onMenuItemClick}
                  to="/dashboard/report/accountbalance"
                >
                  Account Balance
                </NavLink>
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
};

SidebarMain.propTypes = {
  onMenuItemClick: PropTypes.func,
};

export default SidebarMain;
