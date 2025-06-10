import PropTypes from "prop-types"
import Table from "react-bootstrap/Table";
import "../../../Dashboard.css";
import DashboardHeadline from "../../../shared/DashboardHeadline";

const LoanReportList = ({ loanReport }) => {
  const styles = {
    table: {
      // margin: "0 2rem 0 4rem",
    },
    head: {
      color: "#fff",
      fontSize: "1.2rem",
    },
    img: {
      width: "50px",
      height: "30px",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  // check if loan report is empty
  if (
    loanReport === undefined ||
    loanReport === null ||
    loanReport.error === "Network response was not ok" ||
    loanReport.IsSuccessful === false
  ) {
    return <p style={{ textAlign: "center" }}>No loan report available</p>;
  }

  console.log("Loan Report", loanReport);
  return (
    <div>
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.7rem 0.2rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Loan ID</th>
              <th>Customer No</th>
              <th>Date Created</th>
              <th>Loan Product</th>
              <th>Amount</th>
              <th>Due Amount</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10087</td>
              <td>1023457621</td>
              <td>29-03-2023</td>
              <td>Car Loan</td>
              <td>N2,500,000</td>
              <td>3,000,000</td>
              <td>30-09-2024</td>
              <td style={styles.completed}>Active</td>
            </tr>
            <tr>
              <td>10012</td>
              <td>1023457677</td>
              <td>29-04-2023</td>
              <td>Salary Advance</td>
              <td>N50,000</td>
              <td>62,000</td>
              <td>30-06-2023</td>
              <td style={styles.completed}>Completed</td>
            </tr>
            <tr>
              <td>10041</td>
              <td>1023454512</td>
              <td>25-03-2023</td>
              <td>SME Loan</td>
              <td>N900,000</td>
              <td>1,000,000</td>
              <td>30-12-2023</td>
              <td style={styles.completed}>Active</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

LoanReportList.propTypes = {
  loanReport: PropTypes.any
}

export default LoanReportList;
