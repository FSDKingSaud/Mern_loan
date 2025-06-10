import PropTypes from "prop-types";
import { Row, Col, Spinner } from "react-bootstrap";
import FigCard from "../shared/FigCard";
import "../Dashboard.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoanAccountBal,
  fetchLoanRepaymentSchedule,
} from "../../../redux/reducers/loanReducer";
import { calcDaysDiffFromNow } from "../../../../utilities/calcDaysDiff";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import {
  currencyFormat,
  nigerianCurrencyFormat,
} from "../../../../utilities/formatToNiaraCurrency";
import { format } from "date-fns";

import LoanTopUpModal from "./LoanTopUpModal";

const BaseURL = import.meta.env.VITE_BASE_URL;

const TopCardSec = ({ user }) => {
  const [userBalance, setUserBalance] = useState({
    balance: "0.00",
    totalPaid: "0.00",
  });
  const [upcomingPayments, setUpcomingPayments] = useState("0.00");
  const [recentTransaction, setRecentTransaction] = useState(null);

  const { userTransactions } = useSelector((state) => state.transactionReducer);
  const { activeLoanRepaymentSchedule, loansAccountBalance } = useSelector(
    (state) => state.loanReducer
  );

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user) return;
      // `${BaseURL}/api/bankone/balanceEnquiry/${user?.banking?.accountDetails?.AccountNumber}`
      try {
        await dispatch(
          fetchLoanAccountBal(user?.banking?.accountDetails?.CustomerID)
        );

        if (user?.activeLoan?.Number) {
          await dispatch(fetchLoanRepaymentSchedule(user?.activeLoan?.Number));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  useEffect(() => {
    if (activeLoanRepaymentSchedule) {
      const payment = activeLoanRepaymentSchedule?.find(
        (item) => calcDaysDiffFromNow(item.PaymentDueDate) <= 0
      );
      setUpcomingPayments(payment?.Total || "0.00");
    }

    if (loansAccountBalance && typeof loansAccountBalance != "string") {
      const currLoan = loansAccountBalance?.find(
        (loan) => loan.LoanAccountNo == user?.activeLoan?.Number
      );
      setUserBalance({
        totalPaid: currLoan?.TotalAmountPaidTillDate || "0.00",
        balance: currLoan?.TotalOutstandingAmount || 0,
      });
    }
  }, [activeLoanRepaymentSchedule, loansAccountBalance]);

  useEffect(() => {
    if (userTransactions && userTransactions.length > 0) {
      setRecentTransaction(userTransactions[0]);
    }
  }, [userTransactions]);

  const [showTopUpModal, setShowTopUpModal] = useState(false);

  // handle open top up
  const handleOpenTopUp = () => {
    setShowTopUpModal(true);
  };

  const handleCloseTopUpModal = () => {
    setShowTopUpModal(false);
  };

  return (
    <>
      <div className="TopCard">
        <Row className="g-3">
          <Col sm={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">
                {currencyFormat.format(userBalance.balance)}
              </h5>
              <p>Balance to Pay</p>
            </FigCard>
          </Col>

          <Col sm={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">{userBalance.totalPaid}</h5>
              <p>Total Paid</p>
            </FigCard>
          </Col>

          <Col sm={6} md={3}>
            <FigCard classname="MobCard">
              <img
                width="28px"
                height="28px"
                src="/images/whitenaira.png"
                alt="naira"
              />
              <h5 className="FigNum">{upcomingPayments}</h5>
              <p>Upcoming Payments</p>
            </FigCard>
          </Col>

          <Col sm={6} md={3}>
            {user.topUpLoanEligibility.isEligible ? (
              <FigCard classname="YellowCard MobCard" func={handleOpenTopUp}>
                <Spinner animation="grow" variant="light" size="lg" />

                <p id="topUpCta">
                  Increase Your Loan, <br /> Reduce Your Stress – Top Up Today
                </p>
              </FigCard>
            ) : (
              <FigCard classname="YellowCard MobCard">
                {!recentTransaction ? (
                  <div id="CardText">
                    <p>No recent transaction data available.</p>
                  </div>
                ) : (
                  <div id="CardText">
                    <b>{recentTransaction.RecordType}</b>
                    <div>
                      <h5
                        className={`recentTrscAmt ${
                          recentTransaction.RecordType === "Credit"
                            ? "credit"
                            : "debit"
                        }`}
                      >
                        <span>
                          {recentTransaction.RecordType === "Credit" ? (
                            <IoMdAdd />
                          ) : (
                            <IoMdRemove color="#dc2626" />
                          )}
                        </span>

                        {nigerianCurrencyFormat.format(
                          recentTransaction.Amount / 100
                        )}
                      </h5>
                      <p>
                        {format(
                          recentTransaction.CurrentDate,
                          "dd/LL/yyyy, hh:mm aaa"
                        )}
                      </p>
                    </div>
                    <p>Recent Transactions</p>
                  </div>
                )}
              </FigCard>
            )}
          </Col>
        </Row>

        {/* loan top up modal */}
      </div>
      <LoanTopUpModal
        showModal={showTopUpModal}
        handleCloseModal={handleCloseTopUpModal}
        customerID={user?._id}
      />
    </>
  );
};

TopCardSec.propTypes = {
  user: PropTypes.any,
};

export default TopCardSec;
