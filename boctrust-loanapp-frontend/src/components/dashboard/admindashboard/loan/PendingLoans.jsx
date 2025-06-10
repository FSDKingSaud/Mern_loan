import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
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
import { fetchPendingLoans } from "../../../../redux/reducers/loanReducer";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const PaddingLoans = () => {
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
  };

  // fetch all customer
  const dispatch = useDispatch();
  const { pendingLoans } = useSelector((state) => state.loanReducer);

  const status = useSelector((state) => state.customerReducer.status);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [message, setMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [canUserManage, setCanUserManage] = useState(false);

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedLoansList } = usePaginatedData(
    pendingLoans,
    showCount,
    currentPage
  );

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
  }, [currentUser]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchPendingLoans());
    };

    getData();
  }, [dispatch, showNotification]);

  // update loansList to show 10 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setLoansList(paginatedLoansList); // Update local state with paginated data
  }, [paginatedLoansList]);
  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

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
    const loan = pendingLoans.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  // search customer list
  const [loansList, setLoansList] = useState(null);

  // update loansList on search
  const handleSearch = () => {
    const currSearch = searchList(pendingLoans, searchTerms, "firstname");
    setLoansList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <>
      <div className="MainBox">
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
        <div>
          {/* data loader */}
          {status === "loading" && <PageLoader />}

          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="2rem 0 -3.25rem -1rem"
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
                    <th>Release Date</th>
                    <th>Applied Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loansList && sortByCreatedAt(loansList)?.length === 0 && (
                    <NoResult name="Loans" />
                  )}
                  {loansList &&
                    loansList?.map((loan) => {
                      return (
                        <tr key={loan.id}>
                          <td>
                            {loan?.customer?.banking?.accountDetails
                              ?.CustomerID || "N/A"}
                          </td>
                          <td>
                            <DisplayLoanProductName loan={loan} />
                          </td>
                          <td>
                            {loan?.customer.banking?.accountDetails?.Message
                              ?.FullName ||
                              `${loan?.customer.firstname} ${loan?.customer.lastname}`}
                          </td>
                          <td>
                          {loan.customer?.banking?.accountDetails?.AccountNumber ?? "N/A"}
                          </td>
                          <td>{getDateOnly(loan?.createdAt)}</td>
                          <td>N{loan?.loanamount}</td>
                          <td style={styles.padding}>
                            {capitalizeEachWord(loan?.loanstatus)}
                          </td>
                          {canUserManage && (
                            <td>
                              <div style={styles.btnBox}>
                                <BocButton
                                  func={() => handleShow(loan._id)}
                                  bradius="12px"
                                  fontSize="14px"
                                  margin="2px"
                                  bgcolor="#ecaa00"
                                >
                                  Details
                                </BocButton>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })}
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

      {/* show notification model */}
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

export default PaddingLoans;
