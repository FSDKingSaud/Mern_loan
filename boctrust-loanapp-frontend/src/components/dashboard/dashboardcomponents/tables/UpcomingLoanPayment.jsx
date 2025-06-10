import PropTypes from "prop-types";
import { useEffect } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { fetchLoanRepaymentSchedule } from "../../../../redux/reducers/loanReducer";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../shared/PageLoader";
import { format } from "date-fns";
import TableStyles from "./TableStyles.module.css";
import { calcDaysDiffFromNow } from "../../../../../utilities/calcDaysDiff";
import SingleLoanRepayment from "../repayments/SingleLoanRepayment";

const UpcomingLoanPayment = ({ user }) => {
  const styles = {
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  const { activeLoanRepaymentSchedule, status } = useSelector(
    (state) => state.loanReducer
  );

  const dispatch = useDispatch(0);

  // fetch upcoming loan payment
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchLoanRepaymentSchedule(user?.activeLoan?.Number));
      } catch (error) {
        console.log(error);
      }
    };
    if (user?.activeLoan?.Number) {
      getData();
    }
  }, [user?.activeLoan?.Number]);

  return (
    <div className={TableStyles.table__wrapper}>
      <DashboardHeadline>Upcoming Loan Payment</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Loan ID</th>
            <th>Account Number</th>
            <th>Payment Due Date</th>
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {activeLoanRepaymentSchedule.length === 0 && status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : status !== "loading" &&
            activeLoanRepaymentSchedule.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No upcoming loan payment
              </td>
            </tr>
          ) : (
            activeLoanRepaymentSchedule && (
              <SingleLoanRepayment
                loanRepaymentSchedule={activeLoanRepaymentSchedule}
              />
            )
          )}
        </tbody>
      </Table>
    </div>
  );
};

UpcomingLoanPayment.propTypes = {
  user: PropTypes.shape({
    banking: PropTypes.shape({
      accountDetails: PropTypes.shape({
        Message: PropTypes.shape({
          AccountNumber: PropTypes.any,
        }),
      }),
    }),
  }),
};

export default UpcomingLoanPayment;
