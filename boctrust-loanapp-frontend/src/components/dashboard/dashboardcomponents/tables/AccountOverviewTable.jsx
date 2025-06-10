import PropTypes from "prop-types";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import { fetchCustomerAccounts } from "../../../../redux/reducers/accountReducer";
import { fetchCustomerLoans } from "../../../../redux/reducers/loanReducer";
import TableStyles from "./TableStyles.module.css";

const AccountOverviewTable = ({ user }) => {
  const styles = {
    head: { color: "#145098", fontWeight: "bold", fontSize: "1.2rem" },
  };

  const { selectedCustomerLoan } = useSelector((state) => state.loanReducer);

  const { customerAccounts, status } = useSelector(
    (state) => state.accountReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (!user?.banking?.accountDetails?.CustomerID) return;
      try {
        await dispatch(
          fetchCustomerAccounts(user?.banking?.accountDetails?.CustomerID)
        );
        await dispatch(
          fetchCustomerLoans(user?.banking?.accountDetails?.CustomerID)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  return (
    <div className={TableStyles.table__wrapper}>
      <DashboardHeadline>Account Overview</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.head}>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Balance</th>
            <th>Loan Requested</th>
            <th>Withdrawable Amt</th>
          </tr>
        </thead>
        <tbody>
          {(!customerAccounts || !selectedCustomerLoan) &&
          status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : customerAccounts && customerAccounts?.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          ) : (
            customerAccounts &&
            selectedCustomerLoan &&
            customerAccounts
              .filter((acc) => acc.accountType != "Loan")
              .map((acct, index) => (
                <tr key={index} className={TableStyles.row}>
                  <td>{acct.NUBAN}</td>

                  <td>{acct.accountType}</td>
                  <td>₦{acct.availableBalance}</td>
                  <td>
                    {nigerianCurrencyFormat.format(
                      selectedCustomerLoan.find(
                        (item) =>
                          item.Number ==
                          customerAccounts[customerAccounts.length - 1]
                            ?.accountNumber
                      )?.LoanAmount / 100 || 0
                    )}
                  </td>
                  <td>₦{acct.withdrawableAmount}</td>
                </tr>
              ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

AccountOverviewTable.propTypes = {
  user: PropTypes.any,
};

export default AccountOverviewTable;

/* 
<thead>
          <tr style={styles.head}>
            <th>Account Number</th>

            <th>Balance</th>
            <th>Outstanding Amount</th>
            <th>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {!customerAccounts || status === "loading" ? (
            <tr>
              <td colSpan="5">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : customerAccounts && customerAccounts?.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No account overview
              </td>
            </tr>
          ) : (
            customerAccounts &&
            customerAccounts.filter(acc => acc.accountType != "Loan").map((accounts) => (
              <tr key={accounts.LoanAccountNo}>
                <td>{accounts.LoanAccountNo}</td>

                <td>{nigerianCurrencyFormat.format(accounts.AccountBalance)}</td>
                <td>
                  {nigerianCurrencyFormat.format(accounts.TotalOutstandingAmount)}
                </td>
                <td>
                  {nigerianCurrencyFormat.format(accounts?.TotalAmountPaidTillDate)}
                </td>
              </tr>
            ))
          )}
        </tbody>

*/