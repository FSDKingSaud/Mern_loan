import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import {
  fetchAllLoans,
  fetchCompletedRemitaLoan,
} from "../../../../redux/reducers/loanReducer.js";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getNextMonthDate from "../../../../../utilities/getNextMonthDate.js";
import "./Remita.css";
import "../customers/Customer.css";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import getDateOnly from "../../../../../utilities/getDate";
import BocButton from "../../shared/BocButton";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import fetchSingleEmployer from "../../../../../utilities/getEmployer";

import usePagination from "../../../../customHooks/usePagination";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

import apiClient from "../../../../lib/axios.js";
import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";
import usePaginatedData from "../../../../customHooks/usePaginationData.js";

const StopCollections = () => {
  const styles = {
    container: { margin: "0 4rem 0 0" },
    head: { color: "#fff", fontSize: "14px" },
    approved: { color: "#5cc51c" },
    completed: { color: "#f64f4f" },
  };

  const dispatch = useDispatch();
  const { completedRemitaLoans, allLoansStatus } = useSelector(
    (state) => state.loanReducer
  );
  const currentUser = useSelector((state) => state.adminAuth.user);
  const userType = currentUser.userType;

  // handle resData view
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);
  const [responseObj, setResponseObj] = useState({});

  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

  // Pagination hook
  const [showCount] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1);

  const { paginatedData: paginatedCompletedLoan, totalPages: noOfPages } =
    usePaginatedData(completedRemitaLoans, showCount, currentPage);

  // Fetch loans once
  useEffect(() => {
    if (!completedRemitaLoans || completedRemitaLoans.length === 0) {
      dispatch(fetchCompletedRemitaLoan());
    }
  }, [dispatch, completedRemitaLoans]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  const handleStopLoan = async (id) => {
    setViewLoader(true);

    // get customer resData from remita
    const { data: resData } = await apiClient.post(
      `/remita/stop-loan-collection`,
      {
        loanId: id,
      }
    );

    if (resData.data.status === "success") {
      // update resData obj
      setResponseObj(resData);

      // show notification
      toast.success(resData.data.responseMsg);

      setViewLoader(false);

      dispatch(fetchAllLoans());
    } else {
      toast.error(resData.data.responseMsg);
      setViewLoader(false);
    }

    setViewLoader(false);
  };

  // Reload data
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTerm("");
    dispatch(fetchAllLoans({}));
  };

  return (
    <div className="DetailSection DCard" style={styles.container}>
      {/* View by section */}
      <ViewBySection
        setSearch={setSearchTerm}
        setDateRange={setDateRange}
        dateRange={dateRange}
        handleReload={handleReload}
      />

      {/* Loader */}
      {allLoansStatus === "loading" && <PageLoader />}

      {/* Table section */}
      <div className="RBox">
        <DashboardHeadline
          mspacer="3.9rem -1rem -3.9rem -1rem"
          bgcolor="#145098"
          height="79px"
        />

        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Mandate Ref.</th>
              <th>Loan Product</th>
              <th>Disbursed Amount</th>

              <th>Loan Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompletedLoan.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <NoResult name="Customer" />
                </td>
              </tr>
            ) : (
              paginatedCompletedLoan.map((loan) => (
                <tr key={loan._id}>
                  <td>{loan?.remita?.disbursementDetails.data.customerId}</td>
                  <td>
                    {loan?.customer.firstname} {loan?.customer.lastname}
                  </td>
                  <td>
                    {loan?.remita?.disbursementDetails.data.mandateReference ||
                      "N/A"}
                  </td>
                  <td>
                    <DisplayLoanProductName loan={loan} />
                  </td>
                  <td>{nigerianCurrencyFormat.format(loan.loanamount)}</td>

                  <td>
                    {loan?.remita?.stopLoanStatus === "active" ? (
                      <span className="badge_success">Active</span>
                    ) : (
                      <span className="badge_pending">Stopped</span>
                    )}
                  </td>
                  <td>
                    {viewLoader ? (
                      <PageLoader width="25" />
                    ) : (
                      <>
                        {loan?.remita?.stopLoanStatus === "active" ? (
                          // Show Stop Loan Button
                          <BocButton
                            bradius="12px"
                            fontSize="14px"
                            width="90px"
                            bgcolor="red"
                            func={() => handleStopLoan(loan._id)}
                          >
                            Stop
                          </BocButton>
                        ) : (
                          // Show Restart Loan Button
                          <BocButton
                            bradius="12px"
                            fontSize="14px"
                            width="90px"
                            bgcolor="gray"
                          >
                            Stopped
                          </BocButton>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>
    </div>
  );
};

export default StopCollections;
