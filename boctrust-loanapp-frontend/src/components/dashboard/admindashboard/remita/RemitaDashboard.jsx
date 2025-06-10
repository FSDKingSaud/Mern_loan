import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer.js";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "./Remita.css";
import "../customers/Customer.css";
import LoanDetailModel from "./LoanDetailModel";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import getDateOnly from "../../../../../utilities/getDate";
import BocButton from "../../shared/BocButton";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData.js";

const RemitaDashboard = () => {
  const styles = {
    container: { margin: "0 4rem 0 0" },
    head: { color: "#fff", fontSize: "14px" },
    approved: { color: "#5cc51c" },
    completed: { color: "#f64f4f" },
  };

  const dispatch = useDispatch();
  const { allLoans, allLoansStatus } = useSelector(
    (state) => state.loanReducer
  );
  const currentUser = useSelector((state) => state.adminAuth.user);
  const userType = currentUser.userType;

  // State variables
  const [openModel, setOpenModel] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });

  // Fetch loans once
  useEffect(() => {
    if (!allLoans || allLoans.length === 0) {
      dispatch(fetchAllLoans());
    }
  }, [dispatch, allLoans, openModel, currentCustomer]);

  // Pagination hook
  const [showCount] = useState(5);
  const [loanList, setLoanList] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1);

  const { paginatedData: paginatedLoansList, totalPages: noOfPages } =
    usePaginatedData(loanList, showCount, currentPage);

  useEffect(() => {
    if (!allLoans) {
      return;
    }
    {
      /* disbursement_notice */
    }
    const loans =
      allLoans?.filter(
        (loan) =>
          loan?.deductions === "remita" &&
          loan?.remita?.isRemitaCheck &&
          (loan?.remita?.remitaStatus === "disbursement_notice" || 
            loan?.remita?.remitaStatus === "disbursement"  ||
            loan?.loanstatus === "completed")
      ) || [];

    setLoanList(loans);
  }, [allLoans]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  // useEffect(() => {
  //   if(loanList){
  //     setLoanList()
  //   }
  // }, [loanList])

  // Handle view details
  const handleView = (id) => {
    const customerLoan = allLoans.find((loan) => loan._id === id);
    setCurrentCustomer(customerLoan);
    setOpenModel(true);
  };

  // Reload data
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTerm("");
    dispatch(fetchAllLoans());
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
              <th>Salary Acc</th>
              <th>Name</th>
              <th>Income</th>
              <th>Loan Amount</th>
              <th>Collection Amount</th>
              <th>Disbursement Date</th>
              <th>COO Approval</th>
              <th>Loan Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLoansList.length === 0 ? (
              <tr>
                <td colSpan="10">
                  <NoResult name="Customer" />
                </td>
              </tr>
            ) : (
              paginatedLoansList.map((loan) => (
                <tr key={loan._id}>
                  <td>
                    {loan?.customer.disbursementaccountnumber ||
                      loan?.customer.salaryaccountnumber}
                  </td>
                  <td>
                    {loan?.customer.firstname} {loan?.customer.lastname}
                  </td>
                  <td>
                    {nigerianCurrencyFormat.format(
                      loan?.customer.netmonthlyincome
                    ) || "0.00"}
                  </td>
                  <td>{nigerianCurrencyFormat.format(loan.loanamount)}</td>
                  <td>
                    {nigerianCurrencyFormat.format(loan.loantotalrepayment) ||
                      "0.00"}
                  </td>
                  <td>{getDateOnly(loan?.customer.updatedAt)}</td>

                  <td>
                    <span
                      className={
                        loan?.remita.remitaStatus === "disbursement_notice"
                          ? "badge_pending"
                          : "badge_success"
                      }
                    >
                      {loan?.remita.remitaStatus === "disbursement_notice"
                        ? "Pending"
                        : "Approved"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        loan?.loanstatus === "completed"
                          ? "badge_success"
                          : "badge_pending"
                      }
                    >
                      {loan?.loanstatus === "booked"
                        ? "Booked"
                        : loan?.loanstatus === "completed"
                        ? "Completed"
                        : "Unbooked"}
                    </span>
                  </td>
                  <td>
                    <BocButton
                      bradius="12px"
                      fontSize="14px"
                      width="90px"
                      bgcolor="#145088"
                      func={() => handleView(loan._id)}
                    >
                      View
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

      {/* Loan details modal */}
      {openModel && (
        <LoanDetailModel
          customer={currentCustomer}
          usertype={userType}
          show={openModel}
          onHide={() => setOpenModel(false)}
        />
      )}
    </div>
  );
};

export default RemitaDashboard;
