import PropTypes from "prop-types";
import Table from "react-bootstrap/Table";
import "../../../Dashboard.css";
import DashboardHeadline from "../../../shared/DashboardHeadline";

const AccountStatementList = ({ accountBalance }) => {
  const styles = {
    table: {
      // margin: "0 2rem 0 8rem",
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
  console.log("Account Balance", accountBalance);
  // check if account balance is empty
  if (
    accountBalance === undefined ||
    accountBalance === null ||
    accountBalance.error === "Network response was not ok"
  ) {
    return <p style={{ textAlign: "center" }}>No account statement available</p>;
  }

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
              <th>Account Number</th>
              <th>Balance</th>
              <th>Loan Guarantee</th>
              <th>Current Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1023559802</td>
              <td>N300,000</td>
              <td>Government Guarantee</td>
              <td style={styles.completed}>N250,000</td>
            </tr>
            <tr>
              <td>1023559817</td>
              <td>N500,000</td>
              <td>Self Guarantee</td>
              <td style={styles.completed}>N350,000</td>
            </tr>
            <tr>
              <td>1023559199</td>
              <td>N90,000</td>
              <td>Guarantee</td>
              <td style={styles.completed}>N50,000</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

AccountStatementList.propTypes = {
  accountBalance: PropTypes.any,
};

export default AccountStatementList;
