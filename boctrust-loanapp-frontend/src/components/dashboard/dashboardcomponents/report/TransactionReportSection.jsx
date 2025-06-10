import { useSelector } from "react-redux";
import DashboardHeadline from "../../shared/DashboardHeadline";
import Table from "react-bootstrap/Table";
import TableStyles from "../tables/TableStyles.module.css";
import PageLoader from "../../shared/PageLoader";
import { format } from "date-fns";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";


const TransactionReportSection = ({ printRef }) => {
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

  const { userTransactions, status } = useSelector(
    (state) => state.transactionReducer
  );


  return (
    <div ref={printRef}>
      <DashboardHeadline mspacer="0 3rem 0 0">
        Recent Transactions
      </DashboardHeadline>
      <div className="TReport">
        <Table id="transactionReportTable" borderless hover responsive="sm" className="DTable">
          <thead>
            <tr style={styles.th}>
              <th>Date</th>
              <th>AC Number</th>
              <th>Amount</th>
              <th>Dr/Cr</th>
              <th>Type</th>
              <th>Status</th>
       
            </tr>
          </thead>
          <tbody>
          {!userTransactions && status === "loading" ? (
            <tr className={TableStyles.row}>
              <td colSpan="7">
                <PageLoader width="70px" />
              </td>
            </tr>
          ) : !userTransactions || userTransactions.length === 0 ? (
            <tr className={TableStyles.row}>
              <td colSpan="7" style={{ textAlign: "center" }}>
                Nothing to Display
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
                  
                </tr>
              );
            })
          )}
        </tbody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionReportSection;
