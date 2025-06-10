import { useEffect, useState } from "react";
import BocButton from "../../shared/BocButton";
import Table from "react-bootstrap/Table";
import DashboardHeadline from "../../shared/DashboardHeadline";
import { useSelector } from "react-redux";
import PageLoader from "../../shared/PageLoader";

const RemitaHistory = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      marginLeft: "-1.1rem",
    },
    th: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
    completed: {
      color: "#5cc51c",
    },
    decline: {
      color: "#ff0000",
    },
  };

  const currentUser = useSelector((state) => state.adminAuth.user);

  const [remitaHistory, setRemitaHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = apiClient.get(
          `/remita/getCustomerRemitaCollection/${currentUser._id}`
        );

        setRemitaHistory(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser) {
      getData();
    }
  }, [currentUser]);

  return (
    <div>
      <div style={styles.container}>
        <img width="130px" src="/images/remita-logo.jpg" alt="remita-logo" />
      </div>
      <div className="TReport">
        <DashboardHeadline
          height="46px"
          mspacer="2rem 0 -3.3rem 0"
          bgcolor="#145098"
        ></DashboardHeadline>
        <Table borderless hover responsive="sm" className="DTable">
          <thead>
            <tr style={styles.th}>
              <th>Date</th>
              <th>AC Number</th>
              <th>Amount</th>
              <th>Mandate Ref</th>
              <th>Balance Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!remitaHistory || isLoading ? (
              <td colSpan="6">
                <PageLoader width="70px" />
              </td>
            ) : remitaHistory && remitaHistory.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No loan record
                </td>
              </tr>
            ) : (
              remitaHistory.map((history, index) => (
                <tr key={index}>
                  <td>{history.paymentDate}</td>
                  <td>{history.loan.loanAccountNumber}</td>
                  <td>{history.amount}</td>
                  <td>{history.mandateRef}</td>
                  <td>{history.balanceDue}</td>
                  <td style={styles.completed}>Successful</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default RemitaHistory;
