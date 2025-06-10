import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NotificationBox from "../../shared/NotificationBox";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import {
  fetchUnbookedLoans,
  rejectLoan,
} from "../../../../redux/reducers/loanReducer";
import BookingModal from "./BookingModal";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import ActionNotification from "../../shared/ActionNotification";

const BookLoans = () => {
  const styles = {
    head: {
      color: "#fff",
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
    message: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#145098",
    },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
    },
    topUp: {
      color: "#ecaa00",
      fontSize: "0.6rem",
    },
  };

  // fetch all Loans
  const dispatch = useDispatch();
  const { unbookedLoans, status } = useSelector((state) => state.loanReducer);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const [show, setShow] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [canUserManage, setCanUserManage] = useState(false);
  const [canUserBook, setCanUserBook] = useState(false);
  const [canUserApprove, setCanUserApprove] = useState(false);

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedLoansList, totalPages: noOfPages } =
    usePaginatedData(unbookedLoans, showCount, currentPage);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchUnbookedLoans());
    };

    getData();
  }, [dispatch, showNotification]);

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
    setCanUserApprove(currentUser?.userRole?.can.includes("approveBookLoan"));
    setCanUserBook(currentUser?.userRole?.can.includes("bookLoans"));
  }, [currentUser]);

  // handle close notification
  const closeNotification = () => {
    setShowNotification(false);
    setMessage("");
  };

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleShow = (id) => {
    if (!unbookedLoans) return;
    const loan = unbookedLoans.find((loan) => loan._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // search customer list
  const [loansList, setLoansList] = useState(unbookedLoans);
  const [selectedLoan, setSelectedLoan] = useState(null);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setLoansList(paginatedLoansList); // Update local state with paginated data
  }, [paginatedLoansList]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  // update loansList on search
  const handleSearch = () => {
    const currSearch = searchList(unbookedLoans, searchTerms, "firstname");
    setLoansList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  const getTableOptions = (loan) => {
    const tableOptions = [
      {
        className: "",
        icon: <GrView />,
        label: "View Details",
        func: () => handleShow(loan._id),
      },
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label:
          canUserBook && (!canUserApprove || !loan.bookingInitiated)
            ? "Book Loan"
            : canUserApprove ||
              (canUserBook && canUserApprove && loan.bookingInitiated)
            ? "Approve Booking"
            : "",
        isDisabled:
          (canUserBook && !canUserApprove && loan.bookingInitiated) ||
          (canUserApprove &&
            !canUserBook &&
            (!loan.bookingInitiated || loan.loanstatus === "booked")),
        func: () => {
          setSelectedLoan(loan);
          setShowBookModal(true);
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Reject Loan",
        isDisabled: false,
        func: () => {
          setSelectedLoan(loan);
          setShowNotification(true);
          setMessage("Are you sure you want to reject this loan?");
        },
      },
    ];

    return tableOptions;
  };

  return (
    <>
      <div className="MainBox bookloan__container">
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
        <div>
          {/* data loader */}

          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="2rem 0 -3.2rem -1rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>S/N</th>
                    <th>Type</th>
                    <th>Loan Product</th>
                    <th>Borrower</th>
                    <th>Release Date</th>
                    <th>Applied Amount</th>
                    <th>Book Status</th>
                    <th>Loan Status</th>

                    {canUserManage && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {!loansList || status === "loading" ? (
                    <td colSpan="7">
                      <PageLoader />
                    </td>
                  ) : loansList && sortByCreatedAt(loansList)?.length === 0 ? (
                    <td colSpan="7">
                      <NoResult name="Loan" />
                    </td>
                  ) : (
                    loansList &&
                    loansList?.map((loan, index) => {
                      return (
                        <tr key={loan.id}>
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
                            {loan?.customer?.banking?.accountDetails?.Message
                              ?.FullName ||
                              `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                          </td>
                          <td>{getDateOnly(loan?.createdAt)}</td>
                          <td>
                            {nigerianCurrencyFormat.format(loan?.loanamount)}
                          </td>
                          <td className="booking_status">
                            {loan.bookingInitiated ? (
                              <span className="badge_success">Initaited</span>
                            ) : (
                              <span className="badge_pending">Pending</span>
                            )}
                          </td>
                          <td style={styles.padding}>
                            {capitalizeEachWord(loan?.loanstatus)}
                          </td>
                          {((canUserManage && loan.deductions != "remita") ||
                            (canUserManage &&
                              loan.deductions === "remita" &&
                              loan.remita.remitaStatus === "booking")) && (
                            <td>
                              <TableOptionsDropdown
                                items={getTableOptions(loan)}
                              />
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
            <NextPreBtn
              currentPage={currentPage}
              totalPages={totalPages}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          </div>
        </div>
      </div>

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}

      {/* show Modal for Booking Details */}
      {showBookModal && (
        <BookingModal
          selectedLoan={selectedLoan}
          show={showBookModal}
          handleClose={() => setShowBookModal(false)}
          loanObj={loanObj}
        />
      )}

      {/* show loan details model */}
      {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )}

      {/* show notification model */}
      {showNotification && (
        <ActionNotification
          message={message}
          show={showNotification}
          handleClose={closeNotification}
          handleProceed={async () => {
            await dispatch(rejectLoan(selectedLoan?._id));
            await dispatch(fetchUnbookedLoans());
            closeNotification();
          }}
        />
      )}
    </>
  );
};

export default BookLoans;
