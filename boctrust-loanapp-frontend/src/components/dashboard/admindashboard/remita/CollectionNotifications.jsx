import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedRemitaLoan } from "../../../../redux/reducers/loanReducer.js";
import { Button, Modal, Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "./Remita.css";
import "../customers/Customer.css";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData.js";
import BocButton from "../../shared/BocButton.jsx";
import { useSearchParams } from "react-router-dom";
import CollectionNotificationTable from "./CollectionNotificationTable.jsx";

const CollectionNotifications = () => {
  const styles = {
    container: { margin: "0 4rem 1rem 0" },
    head: { color: "#fff", fontSize: "14px" },
    approved: { color: "#5cc51c" },
    completed: { color: "#f64f4f" },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
    },
    details: {
      marginTop: "6rem",
    },
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { completedRemitaLoans, allLoansStatus } = useSelector(
    (state) => state.loanReducer
  );
  const currentUser = useSelector((state) => state.adminAuth.user);
  const userType = currentUser.userType;

  // State variables
  const [showDetails, setShowDetails] = useState(false);

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
  }, [dispatch, completedRemitaLoans, showDetails]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  // Reload data
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTerm("");
    dispatch(fetchCompletedRemitaLoan());
  };

  const handleClose = () => {
    setSearchParams((params) => {
      params.delete("loanId");
      return params;
    });
    setShowDetails(false);
  };

  return (
    <div>
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
                      {loan?.remita.disbursementDetails.data.customerId ||
                        "N/A"}
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
                      <div style={styles.btnBox}>
                        <BocButton
                          func={() => {
                            setSearchParams({ loanId: loan._id });
                            setShowDetails(true);
                          }}
                          bradius="12px"
                          fontSize="14px"
                          bgcolor="#ecaa00"
                        >
                          Details
                        </BocButton>
                      </div>
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
      {showDetails && (
        <Modal
          show={showDetails}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="xl"
          className="booking__modal"
        >
          <CollectionNotificationTable
            handleClose={() => {
              setShowDetails(false);
            }}
          />

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default CollectionNotifications;
