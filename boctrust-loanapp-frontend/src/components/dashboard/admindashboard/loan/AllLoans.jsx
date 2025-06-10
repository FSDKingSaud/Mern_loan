import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import { loanStatusEnum } from "../../../../lib/userRelated";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const AllLoans = ({ count, searchTerms, setTotalPages, currentPage }) => {
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
      color: "#f64f4f",
    },
    padding: {
      color: "#ecaa00",
    },
    topUp: {
      color: "#ecaa00",
      fontSize: "0.6rem",
    }
  };

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // search Loans list
  const [loansList, setLoansList] = useState(null);

  // fetch all customer
  const dispatch = useDispatch();
  const { allLoans, status } = useSelector((state) => state.loanReducer);



  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchAllLoans());
    };
    getData();
  }, [dispatch, show]);

  // update loansList to show 5 allLoans on page load
  // or on count changes
  // custom pagination update
  const { paginatedData: paginatedLoansList, totalPages } = usePaginatedData(
    allLoans,
    count,
    currentPage
  );
  useEffect(() => {
    setLoansList(paginatedLoansList); // Update local state with paginated data
  }, [paginatedLoansList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleShow = (id) => {
    const loan = loansList && loansList.find((loan) => loan._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // update loansList on search and filter them for top-up loans
  const handleSearch = () => {
    if (!allLoans) {
      return;
    }
    const currSearch = searchList(allLoans, searchTerms, "firstname");
    setLoansList(currSearch);

    // Include loans where isTopUpLoan and isTopUpLoanSent are both true
    const topUpLoans = currSearch.filter(
      (loan) => loan.isTopUpLoan === true && loan.isTopUpLoanSent === true
    );

    // filter loans where isTopUpLoan is false
    const nonTopUpLoans = currSearch.filter(
      (loan) => loan.isTopUpLoan === false
    );

    // Merge and remove duplicates by loan ID
    const mergedLoans = [...nonTopUpLoans, ...topUpLoans].reduce(
      (acc, loan) => {
        if (!acc.some((item) => item._id === loan._id)) {
          acc.push(loan);
        }
        return acc;
      },
      []
    );

    setLoansList(mergedLoans);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <div className="loans__tableContainer">
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -3.2rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm" className="RBox">
          <thead style={styles.head}>
            <tr>
              <th>S/N</th>
              <th>Type</th>
              <th>Loan Product</th>
              <th>Borrower</th>
              <th>A/C Number</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!paginatedLoansList || status === "loading" ? (
              <tr>
                <td colSpan="9">
                  <PageLoader />
                </td>
              </tr>
            ) : paginatedLoansList && paginatedLoansList?.length === 0 ? (
              <NoResult name="Loan" />
            ) : (
              paginatedLoansList &&
              paginatedLoansList?.map((loan, index) => {
                return (
                  <tr key={loan._id}>
                     <td>{index + 1}</td>
               
                    <td>
                      {loan.deductions === "remita" ? (
                        <p>
                          Remita{" "}
                          <span style={styles.topUp}>
                            {loan.isTopUpLoan && "Top-up"}
                          </span>
                        </p>
                      ) : (
                        <p>
                          IPPIS{" "}
                          <span style={styles.topUp}>
                            {loan.isTopUpLoan && "Top-up"}
                          </span>
                        </p>
                      )}
                    </td>
                    <td>
                      <DisplayLoanProductName loan={loan} />
                    </td>
                    <td>
                      {loan?.customer?.banking?.accountDetails?.CustomerName ??
                        `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                    </td>
                    <td>
                      {loan.customer?.banking?.accountDetails?.AccountNumber ?? "N/A"}
                    </td>
                    <td>{getDateOnly(loan.createdAt)}</td>
                    <td>N{loan.loanamount}</td>
                    <td
                      style={styles.padding}
                      className={
                        loan?.customer?.kyc?.loanstatus ===
                        loanStatusEnum.completed
                          ? "text-success"
                          : "text-warning"
                      }
                    >
                      {capitalizeEachWord(loan.loanstatus)}
                    </td>
                    <td>
                      <div>
                        <button
                          onClick={() => handleShow(loan._id)}
                          className="btn btn-info text-white"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>
      {/* <NextPreBtn /> */}

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}
    </div>
  );
};

AllLoans.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default AllLoans;
