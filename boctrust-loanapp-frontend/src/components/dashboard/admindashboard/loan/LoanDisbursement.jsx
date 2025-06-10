import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import LoanDetails from "./LoanDetails";
import NoResult from "../../../shared/NoResult";
// import DisbursementModal from "./DisbursementModal";
import sortByCreatedAt from "../../shared/sortedByDate";
import {
  fetchBookedLoans,
  rejectLoan,
} from "../../../../redux/reducers/loanReducer";
import TableOptionsDropdown from "../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { GrView } from "react-icons/gr";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
import TransferMoney from "./transferMoney/TransferMoney";
import { toast } from "react-toastify";
import ActionNotification from "../../shared/ActionNotification";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import apiClient from "../../../../lib/axios";

const LoanDisbursement = () => {
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
    disbursed: {
      color: "#2563eb",
    },
    pending: {
      color: "#f64f4f",
    },
    topUp: {
      color: "#ecaa00",
      fontSize: "0.6rem",
    },
  };

  // Base URL for API
  const apiUrl = import.meta.env.VITE_BASE_URL;

  // holds state to check for loged in users permisson to approve
  const [canUserManage, setCanUserManage] = useState(false);
  const [canUserDisburse, setCanUserDisburse] = useState(false);
  const [canUserApprove, setCanUserApprove] = useState(false);

  const { bookedLoans, status } = useSelector((state) => state.loanReducer);

  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPages);
  const { paginatedData: paginatedLoansList, totalPages: noOfPages } =
    usePaginatedData(bookedLoans, showCount, currentPage);

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  const [isReadonly, setIsReadonly] = useState(false);

  const [loanUserAccounts, setLoanUserAccounts] = useState(null);

  // handle loan approval
  const [showDisburse, setShowDisburse] = useState(false);
  const [approveDisburseLoading, setApproveDisburseLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [action, setAction] = useState(false);

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // search customer list
  const [loansList, setLoansList] = useState(bookedLoans);

  // fetch all customer
  const dispatch = useDispatch();

  useEffect(() => {
    setCanUserManage(currentUser?.userRole?.can.includes("loanManagement"));
    setCanUserApprove(
      currentUser?.userRole?.can.includes("approveTransactions")
    );
    setCanUserDisburse(currentUser?.userRole?.can.includes("loanDisbursment"));
  }, [currentUser]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchBookedLoans());
    };

    getData();
  }, [dispatch]);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setLoansList(paginatedLoansList); // Update local state with paginated data
  }, [paginatedLoansList]);

  useEffect(() => {
    setTotalPages(noOfPages); // Update total pages when it changes
  }, [noOfPages, setTotalPages]);

  // update loansList to show 10 customers on page load
  // or on count changes
  // useEffect(() => {
  //   setLoansList(bookedLoans?.slice(0, showCount));
  // }, [bookedLoans, showCount]);

  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleView = (id) => {
    if (!bookedLoans) return;
    const loan = bookedLoans.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  const handleInitiateDisbursement = async (payload) => {
    try {
      setApproveDisburseLoading(true);

      await apiClient.put(
        `${apiUrl}/api/loans/disburse/${loanObj._id}`,
        payload
      );
      await dispatch(fetchBookedLoans());
      toast.success("Loan Disbursement Initiated and Pending Approval");
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleApproval = async (payload) => {
    try {
      setApproveDisburseLoading(true);

      if (!isReadonly) {
        await apiClient.put(
          `${apiUrl}/api/loans/disburse/${loanObj._id}`,
          payload
        );
      }

      await apiClient.put(
        `${apiUrl}/api/loans/approve-disburse/${loanObj._id}`
      );
      await dispatch(fetchBookedLoans());
      toast.success("Loan has been successfully disbursed");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.error);
    } finally {
      setApproveDisburseLoading(false);
    }
  };

  const handleRejection = async (id) => {
    try {
      // process loan rejection
      const loan = bookedLoans.find((customer) => customer._id === id);
      setLoanObj(loan);

      // setProcessing to true after 5 second
      setTimeout(() => {
        setRejectLoading(false);
      }, 5000);

      await dispatch(fetchBookedLoans());
    } catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };

  // handle close disburse model
  const handleCloseDisburse = () => {
    setShowDisburse(false);
    setLoanUserAccounts(null);
  };

  // update loansList on search
  const handleSearch = () => {
    // check bookedLoans is not empty
    if (!bookedLoans) return;
    const currSearch = searchList(bookedLoans, searchTerms, "firstname");
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
        func: () => handleView(loan._id),
      },
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label: !loan.debursementDetails ? "Disburse Loan" : "Approve",
        isDisabled:
          (canUserDisburse && !canUserApprove && loan.debursementDetails) ||
          (canUserApprove &&
            !canUserDisburse &&
            (!loan.debursementDetails ||
              loan.disbursementstatus === "approved")),
        isLoading: approveDisburseLoading,
        func: async () => {
          try {
            setLoanObj(loan);
            setIsReadonly(loan.disbursementstatus === "disbursed");
            setShowDisburse(true);
            const response = await apiClient.get(
              `${apiUrl}/api/bankone/getCustomerAccountsByBankoneId/${loan.customer?.banking?.accountDetails?.CustomerID}`
            );

            setLoanUserAccounts(
              response.data?.Accounts?.map((item) => ({
                label: item.NUBAN,
                value: item.NUBAN,
              }))
            );
          } catch (error) {
            toast.error(error.message);
          }
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Reject",
        isDisabled:
          (canUserDisburse &&
            !canUserApprove &&
            loan.disbursementstatus === "disbursed") ||
          (canUserApprove && loan.disbursementstatus === "approved"),
        isLoading: rejectLoading,
        func: () => {
          setLoanObj(loan);
          setAction(true);
        },
      },
    ];
    return tableOptions;
  };

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
      {/* data loader */}
      <div className="bSection">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.2rem -0.5rem"
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
                <th>A/C Number</th>
                <th>Loan A/C</th>
                <th>Date</th>
                <th>Applied Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {!loansList ||
                (status === "loading" && (
                  <td colSpan="8">
                    <PageLoader />
                  </td>
                ))}
              {loansList && loansList?.length === 0 && <NoResult name="loan" />}
              {loansList &&
                loansList.length > 0 &&
                status != "loading" &&
                sortByCreatedAt(loansList)?.map((loan, index) => {
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
                        {loan.deductions == "remita"
                          ? `${loan.customer.firstname} ${loan.customer.lastname}`
                          : loan?.customer?.banking?.accountDetails
                              ?.CustomerName}
                      </td>
                      <td>
                        {loan.deductions == "remita"
                          ? loan?.customer?.salaryaccountnumber
                          : loan?.customer?.banking?.accountDetails
                              ?.AccountNumber}
                      </td>
                      <td>{loan?.loanAccountNumber || "N/A"}</td>
                      <td>{getDateOnly(loan.createdAt)}</td>
                      <td>{nigerianCurrencyFormat.format(loan?.loanamount)}</td>

                      <td>
                        {loan.disbursementstatus === "pending" ? (
                          <p className="badge_pending">Pending</p>
                        ) : loan.disbursementstatus === "approved" ? (
                          <p className="badge_success">Approved</p>
                        ) : loan.disbursementstatus === "stopped" ? (
                          <p className="badge_error">Stopped</p>
                        ) : (
                          <p className="badge_info">Disbursed</p>
                        )}
                      </td>
                      <td>
                        {((canUserManage && loan.deductions != "remita") ||
                          (canUserManage &&
                            loan.deductions === "remita" &&
                            loan.remita.remitaStatus === "disbursement")) && (
                          <td>
                            <TableOptionsDropdown
                              items={getTableOptions(loan)}
                            />
                          </td>
                        )}
                      </td>
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

        {/* show loan details model */}
        {show && (
          <LoanDetails
            show={show}
            handleClose={handleClose}
            loanObj={loanObj}
          />
        )}
        {showDisburse && (
          <TransferMoney
            show={showDisburse}
            isReadonly={isReadonly}
            setIsReadonly={setIsReadonly}
            loanObj={loanObj}
            debitAccounts={loanUserAccounts}
            handleClose={handleCloseDisburse}
            btnText={
              canUserDisburse && loanObj?.disbursementstatus === "pending"
                ? "Send "
                : canUserApprove
                ? "Approve"
                : ""
            }
            action={
              canUserDisburse && loanObj?.disbursementstatus === "pending"
                ? handleInitiateDisbursement
                : canUserApprove
                ? handleApproval
                : () => {}
            }
          />
        )}

        <ActionNotification
          message={"Are you sure you want to Reject this loan?"}
          show={action}
          handleClose={() => setAction(false)}
          handleProceed={async () => {
            await dispatch(rejectLoan(loanObj?._id));
            await dispatch(fetchBookedLoans());
            setAction(false);
          }}
        />
      </div>
    </>
  );
};

LoanDisbursement.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default LoanDisbursement;
