import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import BocButton from "../../shared/BocButton";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { fetchCompletedLoan } from "../../../../redux/reducers/loanReducer";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

const BalanceEnquiry = () => {
  const styles = {
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#ecaa00 ",
    },
    pending: {
      color: "#f64f4f",
    },
  };

  // fetch all loan
  const dispatch = useDispatch();
  const { completedLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchCompletedLoan());
    };

    getData();
  }, [dispatch]);

  const [showCount, setShowCount] = useState(10);
  const [searchTerms, setSearchTerms] = useState("");

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  // const apiUrl = import.meta.env.VITE_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckBalance = async () => {
    setIsProcessing(true);
  };

  // search loan list
  const [loansList, setLoansList] = useState(completedLoans);

  // update loansList to show 10 customers on page load
  // or on count changes
  useEffect(() => {
    setLoansList(completedLoans?.slice(0, showCount));
  }, [completedLoans, showCount]);

  // update loansList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!completedLoans) return;
    const currSearch = searchList(completedLoans, searchTerms, "agreefullname");
    setLoansList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <>
      {/* top search bar */}
      <div className="Search">
        <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
          <div className="SearchBar">
            <div className="FormGroup">
              <label htmlFor="show">Show</label>
              <input
                name="showCount"
                type="number"
                step={10}
                min={10}
                value={showCount}
                onChange={(e) => setShowCount(e.target.value)}
              />
            </div>
            <div className="FormGroup SBox">
              <input
                name="search"
                placeholder="Search by name"
                onChange={(e) => setSearchTerms(e.target.value)}
              />
              <img src="/images/search.png" alt="search-icon" />
            </div>
          </div>
        </DashboardHeadline>
      </div>

      <div className="bSection">
        {/* data loader */}
        {status === "loading" && <PageLoader />}
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.2rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Loan ID</th>
                <th>Loan Product</th>
                <th>Borrower</th>
                <th>A/C Number</th>
                <th>Date</th>
                <th>Applied Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loansList && loansList?.length === 0 && <NoResult name="loan" />}
              {loansList &&
                sortByCreatedAt(loansList)?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan.customer?.banking?.accountDetails?.CustomerID}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails
                          ?.CustomerName ||
                          `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails
                          ?.AccountNumber || "N/A"}
                      </td>
                      <td>{getDateOnly(loan.createdAt)}</td>
                      <td>N{loan.loanamount}</td>
                      <td>
                        {loan.disbursementstatus === "pending" ? (
                          <p style={styles.pending}>Pending</p>
                        ) : loan.disbursementstatus === "approved" ? (
                          <p style={styles.approved}>Disbursed</p>
                        ) : loan.disbursementstatus === "stopped" ? (
                          <p style={styles.pending}>Stopped</p>
                        ) : (
                          <p style={styles.completed}>Rejected</p>
                        )}
                      </td>
                      <td>
                        <div>
                          {isProcessing && <PageLoader width="12px" />}
                          <BocButton
                            func={() => handleCheckBalance(loan._id)}
                            bradius="12px"
                            fontSize="12px"
                            width="80px"
                            margin="4px"
                            bgcolor="#ecaa00"
                          >
                            Check
                          </BocButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
        <NextPreBtn />

        {/* show loan details model */}
        {show && (
          <LoanDetails
            show={show}
            handleClose={handleClose}
            loanObj={loanObj}
          />
        )}
      </div>
    </>
  );
};

BalanceEnquiry.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default BalanceEnquiry;

// const BalanceEnquiry = () => {
//   return (
//     <div>BalanceEnquiry</div>
//   )
// }

// export default BalanceEnquiry
