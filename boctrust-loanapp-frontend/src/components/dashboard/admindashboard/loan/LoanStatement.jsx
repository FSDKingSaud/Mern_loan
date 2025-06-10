import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import searchList from "../../../../../utilities/searchListFunc";
import NoResult from "../../../shared/NoResult";

import LoanStatementModal from "./loanStatementModal/LoanStatementModal";
import LoanStatementRecord from "./loanStatementRecord/LoanStatementRecord";
import { fetchCompletedLoan } from "../../../../redux/reducers/loanReducer";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const LoanStatement = () => {
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
    dispatch(fetchCompletedLoan());
  }, []);

  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // search loan list
  const [loanList, setLoanList] = useState(completedLoans);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);
  const { paginatedData: paginatedLoansList, totalPages } = usePaginatedData(
    completedLoans,
    showCount,
    currentPage
  );

  // handle show loan details
  // const apiUrl = import.meta.env.VITE_BASE_URL;
  const [isProcessing, setIsProcessing] = useState(false);

  const [accountStatement, setAccountStatement] = useState(null);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setLoanList(paginatedLoansList); // Update local state with paginated data
  }, [paginatedLoansList]);

  useEffect(() => {
    setTotalPage(totalPages); // Update total pages when it changes
  }, [totalPages]);

  // update loanList on search
  const handleSearch = () => {
    // check filteredCustomers is not empty
    if (!completedLoans) return;
    const currSearch = searchList(completedLoans, searchTerms, "agreefullname");
    setLoanList(currSearch);
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
                step={5}
                min={5}
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
          mspacer="2rem 0 -3.3rem -1rem"
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
                <th>Applied Amount</th>
                <th>FromDate</th>
                <th>ToDate</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!paginatedLoansList || status === "loading" ? (
                <td colSpan="8">
                  <PageLoader />
                </td>
              ) : paginatedLoansList && paginatedLoansList?.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <NoResult name="loan" />
                  </td>
                </tr>
              ) : (
                paginatedLoansList &&
                paginatedLoansList?.map((loan) => {
                  return (
                    <React.Fragment key={loan._id}>
                      <LoanStatementRecord
                        setAccountStatement={setAccountStatement}
                        setIsProcessing={setIsProcessing}
                        loan={loan}
                      />
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />

        {/* show loan details model */}
        {accountStatement && (
          <LoanStatementModal
            show={!!accountStatement}
            accountStatement={accountStatement}
            handleClose={() => setAccountStatement(null)}
            isLoading={isProcessing}
          />
        )}
      </div>
    </>
  );
};

LoanStatement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanStatement;
