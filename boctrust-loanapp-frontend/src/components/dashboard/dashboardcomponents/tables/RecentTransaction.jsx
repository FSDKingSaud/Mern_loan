import PropTypes from "prop-types";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserTransactions } from "../../../../redux/reducers/transactionReducer";
import PageLoader from "../../shared/PageLoader";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import TableStyles from "./TableStyles.module.css";
import { format } from "date-fns";
import TransactionModal from "../account/TransactionModal";
import { getCurrentMonthDates } from "../../admindashboard/dashboardhome/dashboradfunc";

const RecentTransaction = ({ user }) => {
  const styles = {
    th: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [dateFilter, setDateFilter] = useState(getCurrentMonthDates());

  const { userTransactions, status } = useSelector(
    (state) => state.transactionReducer
  );

  const dispatch = useDispatch(0);

  useEffect(() => {
    const getData = async () => {
      if (!user || !user.banking?.accountDetails?.AccountNumber) return;

      try {
        const { endDate, startDate } = dateFilter;

        await dispatch(
          fetchUserTransactions({
            accountNumber: user.banking?.accountDetails?.AccountNumber,
            fromDate: startDate,
            toDate: endDate,
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (!userTransactions) getData();
  }, [user]);

  return (
    <div className={TableStyles.table__wrapper}>
      <DashboardHeadline>Recent Transaction</DashboardHeadline>
      <Table
        borderless
        hover
        responsive="sm"
        style={styles.table}
        className="RBox"
      >
        <thead>
          <tr style={styles.th}>
            <th>Date</th>
            <th>AC Number</th>
            <th>Amount</th>
            <th>Dr/Cr</th>
            <th>Type</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {!userTransactions || status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="7">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : userTransactions.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No recent transactions
              </td>
            </tr>
          ) : (
            userTransactions &&
            userTransactions.slice(0, 5).map((transaction, index) => {
              return (
                <tr key={index} className={TableStyles.row}>
                  <td>
                    {transaction?.CurrentDate
                      ? format(
                          transaction?.CurrentDate,
                          "dd/LL/yyyy, hh:mm aaa"
                        )
                      : ""}
                  </td>
                  <td>{transaction?.AccountNumber || "NIL"}</td>
                  <td>
                    {nigerianCurrencyFormat.format(transaction?.Amount / 100)}
                  </td>
                  <td>{transaction?.RecordType}</td>
                  <td>{transaction?.PostingType} </td>
                  <td style={styles.completed}>{transaction?.status}</td>
                  <td>
                    <BocButton
                      func={() => setSelectedTransaction(transaction)}
                      cursor="pointer"
                      bgcolor="#145098"
                      bradius="18px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>

      {selectedTransaction ? (
        <TransactionModal
          selectedTransaction={selectedTransaction}
          handleClose={() => setSelectedTransaction(null)}
        />
      ) : null}
    </div>
  );
};

RecentTransaction.propTypes = {
  user: PropTypes.any,
};

export default RecentTransaction;
