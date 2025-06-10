import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { fetchCustomerLoanRepaymentSchedule } from "../../../../redux/reducers/loanReducer";
import TableStyles from "../tables/TableStyles.module.css";
import PageLoader from "../../shared/PageLoader";
import SingleLoanRepayment from "./SingleLoanRepayment";

const LoanPayment = () => {
  const styles = {
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  const { customerLoanRepaymentSchedule, status } = useSelector(
    (state) => state.loanReducer
  );
  const user = useSelector((state) => state.adminAuth.user);

  const dispatch = useDispatch(0);

  // fetch upcoming loan payment
  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(
          fetchCustomerLoanRepaymentSchedule(
            user?.banking?.accountDetails?.CustomerID
          )
        );
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className={TableStyles.table__wrapper}>
      <DashboardHeadline> Loan Repayment</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>ID</th>
            <th>Acc Number</th>
            <th>Payment Due Date</th>
            <th>Status</th>
            <th>Amount to Pay</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!customerLoanRepaymentSchedule || status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="6">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : customerLoanRepaymentSchedule &&
            customerLoanRepaymentSchedule.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No loan payment
              </td>
            </tr>
          ) : (
            customerLoanRepaymentSchedule &&
            customerLoanRepaymentSchedule.map((repaymentSchedule, index) => (
              <React.Fragment key={index}>
                <SingleLoanRepayment
                  loanRepaymentSchedule={repaymentSchedule}
                />
                <tr>
                  <td colSpan="6">
                    <div className={TableStyles.repayment__seperator} />
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default LoanPayment;
