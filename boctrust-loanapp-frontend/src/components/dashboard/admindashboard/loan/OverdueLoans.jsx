import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import LoanDetails from "./LoanDetails";
import NotificationBox from "../../shared/NotificationBox";
import NoResult from "../../../shared/NoResult";
import { fetchOverdueLoans } from "../../../../redux/reducers/loanReducer";
import ViewBySection from "../remita/ViewBySection";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import { format } from "date-fns";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";

import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import DirectDebitModal from "./DirectDebitModal";
import {
  getOverdueAmount,
  getOverdueScheduleDates,
} from "./getOverdueSchedule";

const OverdueLoans = () => {
  const styles = {
    table: {
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
  };
  const { overdueLoans, status } = useSelector((state) => state.loanReducer);

  const currentUser = useSelector((state) => state.adminAuth.user);

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ fromDate: "", toDate: "" });
  const [searchTodayEntries, setSearchTodayEntries] = useState(false);
  const [overdueLoanEntries, setOverdueLoanEntries] = useState([]);

  const dispatch = useDispatch();
  const canUserManage = currentUser?.userRole?.can.includes("loanManagement");

  // custom pagination
  const [showCount, _] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedOverdueLoans, totalPages } = usePaginatedData(
    overdueLoanEntries,
    showCount,
    currentPage
  );

  useEffect(() => {
    setTotalPage(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPage]);

  useEffect(() => {
    dispatch(fetchOverdueLoans({ searchTerm, dateFilter: searchTodayEntries }));
  }, [dispatch, searchTerm, searchTodayEntries]);

  useEffect(() => {
    if (overdueLoans?.length > 0) {
      setOverdueLoanEntries(overdueLoans);
    }
  }, [overdueLoans]);

  // Search by date range
  const { searchData } = useSearchByDateRange(
    overdueLoans,
    dateRange,
    "dateCreated"
  );

  useEffect(() => {
    setOverdueLoanEntries(searchData);
  }, [searchData]);

  // Close notification handler
  const closeNotification = () => {
    setShowNotification(false);
    setMessage("");
  };

  // Reload handler
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    setSearchTodayEntries(false);
    dispatch(fetchOverdueLoans({}));
  };

  // Show loan details
  const handleShow = (id) => {
    const loan = overdueLoans.find((overdueLoan) => overdueLoan._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  return (
    <>
      <div>
        {/* View by section */}
        <ViewBySection
          setSearch={setSearchTerm}
          setDateRange={setDateRange}
          dateRange={dateRange}
          firstBtn="View by Loans Today"
          setSearchTodayEntries={setSearchTodayEntries}
          handleReload={handleReload}
        />
      </div>
      <div>
        {/* Loans list */}
        <div className="loans__tableContainer">
          <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -3.2rem -1rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table}>
            <Table borderless hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Customer Name</th>
                  <th>Date Due</th>
                  <th>Loan Product</th>
                  <th>Account Number</th>
                  <th>Release Date</th>
                  <th>Loan Amount</th>
                  <th>Due Amount</th>
                  {canUserManage && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {status === "loading" ? (
                  <tr>
                    <td colSpan="8">
                      <PageLoader />
                    </td>
                  </tr>
                ) : paginatedOverdueLoans?.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <NoResult name="Overdue Loans" />
                    </td>
                  </tr>
                ) : (
                  paginatedOverdueLoans.map((overdueLoan) => (
                    <tr key={overdueLoan._id}>
                      <td>{`${overdueLoan.customer?.firstname} ${overdueLoan.customer?.lastname}`}</td>
                      <td>
                        {getOverdueScheduleDates(
                          overdueLoan?.repaymentSchedule
                        ).map((date, index) => (
                          <div key={index}>
                            {date
                              ? format(new Date(date), "dd/LL/yyyy, hh:mm aaa")
                              : "N/A"}
                          </div>
                        ))}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={overdueLoan} />
                      </td>
                      <td>{overdueLoan.loanAccountNumber}</td>
                      <td>
                        {format(
                          new Date(overdueLoan.dateCreated),
                          "dd/LL/yyyy, hh:mm aaa"
                        )}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(
                          overdueLoan.disbursedAmount / 100
                        )}
                      </td>
                      <td>
                        {/* {overdueLoan.accountBalance?.PrincipalDueButUnpaid +
                          overdueLoan.accountBalance?.InterestDueButUnpaid +
                          overdueLoan.accountBalance?.LoanFeeDueButUnPaid +
                          overdueLoan.accountBalance?.PenaltyDueButUnpaid} */}

                        {nigerianCurrencyFormat.format(
                          getOverdueAmount(overdueLoan?.repaymentSchedule)
                        )}
                      </td>
                      {canUserManage && (
                        <td>
                          <BocButton
                            func={() => handleShow(overdueLoan._id)}
                            bradius="12px"
                            fontSize="14px"
                            margin="2px"
                            bgcolor="#ecaa00"
                          >
                            Process
                          </BocButton>
                        </td>
                      )}
                    </tr>
                  ))
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
        </div>
      </div>

      {show && (
        <DirectDebitModal
          loanId={loanObj._id}
          repaymentSchedule={loanObj.repaymentSchedule}
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
      {showNotification && (
        <NotificationBox
          message={message}
          show={showNotification}
          handleClose={closeNotification}
        />
      )}
    </>
  );
};

export default OverdueLoans;
