import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import TableStyles from "../tables/TableStyles.module.css";
import { format } from "date-fns";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import PageLoader from "../../shared/PageLoader";

const ReportDetails = ({ isLoading, accountStatement, printRef }) => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "1.2rem",
    },
    booked: {
      color: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
    withcredit: {
      color: "#f64f4f",
    },
    withdisbursement: {
      color: "#ecaa00",
    },
  };
  return (
    <div  ref={printRef}>
      <DashboardHeadline
        height="46px"
        mspacer="2rem 0 -3.55rem 0"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table
          id="accountStatementTable"
          borderless
          hover
          responsive="sm"
          className="DTable"
        >
          <thead style={styles.head}>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {!accountStatement && isLoading ? (
              <tr className={TableStyles.row}>
                <td colSpan="7">
                  <PageLoader width="70px" />
                </td>
              </tr>
            ) : !accountStatement || accountStatement.length === 0 ? (
              <tr className={TableStyles.row}>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Nothing to Display
                </td>
              </tr>
            ) : (
              accountStatement &&
              accountStatement.map((data, index) => {
                return (
                  <tr key={index} className={TableStyles.row}>
                    <td>
                      {data?.CurrentDate
                        ? format(data?.CurrentDate, "dd/LL/yyyy, hh:mm aaa")
                        : ""}
                    </td>
                    <td>
                      <div style={{ width: "300px" }} className="d-flex">
                        {data?.Narration}
                      </div>
                    </td>
                    <td className="">{`₦${data.Debit || 0}`}</td>
                    <td className="">{`₦${data.Credit || 0}`}</td>
                    <td>
                      {nigerianCurrencyFormat.format(data?.Balance / 100)}
                    </td>
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

export default ReportDetails;
