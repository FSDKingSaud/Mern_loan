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
// import getNextMonthDate from "../../../../../utilities/getNextMonthDate.js";
import "./Remita.css";
import "../customers/Customer.css";
import MandateHistoryDetailsModel from "./MandateHistoryDetailsModel";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

// import getDateOnly from "../../../../../utilities/getDate";
import BocButton from "../../shared/BocButton";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
// import fetchSingleEmployer from "../../../../../utilities/getEmployer";

import usePagination from "../../../../customHooks/usePagination";

import apiClient from "../../../../lib/axios.js";
import { toast } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";
import usePaginatedData from "../../../../customHooks/usePaginationData.js";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName.jsx";

const MandateHistory = () => {
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

  //   // handle mandate view
  const [show, setShow] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewLoader, setViewLoader] = useState(false);
  const [mandateObj, setMandateObj] = useState({});
  const [selectedLoanId, setSelectedLoanId] = useState(null);

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
  }, [dispatch, completedRemitaLoans, show]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  const handleMandateView = async (id) => {
    try {
      setViewLoader(true);

      setSelectedLoanId(id);

      // get customer mandate from remita
      const { data: mandate } = await apiClient.post(
        `/remita/mandate-history`,
        {
          loanId: id,
        }
      );

      if (mandate.data.status === "success") {
        // update mandate obj
        setMandateObj(mandate);

        setShow(true);
        setOpenModel(true);
        // show notification
        toast.success(mandate.data.responseMsg);

        dispatch(fetchAllLoans());
      } else {
        toast.error(mandate.data.responseMsg);
      }
    } catch (error) {
      toast.error("Something went wrong ");
    } finally {
      setViewLoader(false);
    }
  };

  // Reload data
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTerm("");
    dispatch(fetchCompletedRemitaLoan());
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
              <th>Loan Product</th>
              <th>Amount</th>
              <th>Repayment Amount</th>
              <th>Mandate Ref</th>
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
                  <td>
                    {loan?.remita.disbursementDetails.data.customerId || "N/A"}
                  </td>
                  <td>
                    {loan?.customer.firstname} {loan?.customer.lastname}
                  </td>
                  <td>
                    <DisplayLoanProductName loan={loan} />
                  </td>
                  <td>
                    {nigerianCurrencyFormat.format(loan.loanamount) || "0.00"}
                  </td>
                  <td>
                    {nigerianCurrencyFormat.format(loan.loantotalrepayment) ||
                      "0.00"}
                  </td>
                  <td>
                    {loan?.remita.disbursementDetails.data.mandateReference ||
                      "N/A"}
                  </td>

                  <td>
                    <BocButton
                      bradius="12px"
                      fontSize="14px"
                      width="90px"
                      bgcolor="#145088"
                      func={() => handleMandateView(loan._id)}
                    >
                      View{" "}
                      {viewLoader && selectedLoanId == loan._id && (
                        <PageLoader width="20" />
                      )}
                    </BocButton>
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

      <MandateHistoryDetailsModel
        show={show}
        onHide={() => setShow(false)}
        customer={mandateObj}
      />
    </div>
  );
};

export default MandateHistory;

/*  <BocButton
                        bradius="12px"
                        fontSize="14px"
                        width="90px"
                        bgcolor="#145088"
                        func={() => handleMandateView(loan._id)}
                      >
                        View
                      </BocButton> */
