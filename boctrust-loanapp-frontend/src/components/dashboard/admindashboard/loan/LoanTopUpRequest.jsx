// top up loan update here
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import getDateOnly from "../../../../../utilities/getDate";
import searchList from "../../../../../utilities/searchListFunc";
import NoResult from "../../../shared/NoResult";
import sortByCreatedAt from "../../shared/sortedByDate";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";
// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";
import apiClient from "../../../../lib/axios";
import TerminateLoanModal from "./TerminateLoanModal";

const loansList = () => {
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
  };

  const apiUrl = import.meta.env.VITE_BASE_URL;

  const currentUser = useSelector((state) => state.adminAuth.user);
  const [isCoo, setIsCoo] = useState(false);
  const [canUserInitiateTermination, setCanUserInitiateTermination] =
    useState(false);
  const [canUserSendToCredit, setCanUserSendToCredit] = useState(false);

  // handle search
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // search Loans list
  const [loansList, setLoansList] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.userRole.value == "coo") {
        setIsCoo(true);
      } else {
        setIsCoo(false);
      }

      setCanUserSendToCredit(
        currentUser?.userRole?.can.includes("sendToCredit")
      );
      setCanUserInitiateTermination(
        currentUser?.userRole?.can.includes("initiateTermination")
      );
    }
  }, [currentUser]);

  // fetch all top-up loan customer
  const fetchTopUpLoans = async () => {
    try {
      const { data } = await apiClient(`/top-up/top-up-loans`);
      setLoansList(data);
      setStatus("success");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTopUpLoans();
  }, []);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);
  const { paginatedData: paginatedLoansList, totalPages } = usePaginatedData(
    loansList,
    showCount,
    currentPage
  );

  useEffect(() => {
    setTotalPage(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPage]);

  // termination operation
  const [isTerminating, setIsTerminating] = useState(false);

  // handle start termination
  const handleStartTermination = async () => {
    setIsTerminating(true);
    try {
      const currentLoanTerminationStatus = "initiated";

      await apiClient.put(`/top-up/start-termination/${selectedLoanId}`, {
        currentLoanTerminationStatus,
      });

      toast.success("Top-up loan termination initiated successful");
      fetchTopUpLoans();
    } catch (error) {
      console.log(error);
      toast.error("Error initiating termination");
    } finally {
      setSelectedLoanId(null);
      setIsTerminating(false);
    }
  };

  // handle approve termination
  const handleApproveTermination = async (id) => {
    setSelectedLoanId(id);
    setIsTerminating(true);
    try {
      await apiClient.put(`/top-up/approve-terminate-for-topup/${id}`);

      toast.success("Top-up loan termination approved successful");
      fetchTopUpLoans();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error approving termination"
      );
    } finally {
      setSelectedLoanId(null);
      setIsTerminating(false);
    }
  };

  // update loansList to show 10 pendingLoans on page load
  // or on count changes

  // update loansList on search
  // Filter loans dynamically
  const filteredLoans = searchTerms
    ? searchList(paginatedLoansList, searchTerms, "firstname")
    : paginatedLoansList;

  // top up loan functionality
  // handle update isTopUpLoanSent
  const [sendingRequest, setSendingRequest] = useState(false);
  const handleSentRequest = async (id) => {
    setSelectedLoanId(id);
    setSendingRequest(true);
    try {
      await apiClient.put(`top-up/send-to-credit/${id}`);

      toast.success("Top-up loan request sent successful");
      fetchTopUpLoans();
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Error sending top-up loan request"
      );
    } finally {
      setSelectedLoanId(null);
      setSendingRequest(false);
    }
  };

  return (
    <div>
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
                <th>Customer ID</th>
                <th>Product</th>
                <th>Borrower</th>
                <th>Amount Requested</th>
                <th>Tenure</th>
                <th>Date</th>
                <th>Credit Assessment</th>
                <th>Terminate</th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan="9">
                    <PageLoader />
                  </td>
                </tr>
              ) : filteredLoans?.length === 0 ? (
                <NoResult name="Loan" />
              ) : (
                filteredLoans &&
                sortByCreatedAt(filteredLoans)?.map((loan) => {
                  return (
                    <tr key={loan._id}>
                      <td>
                        {loan?.customer?.banking?.accountDetails?.CustomerID}
                      </td>
                      <td>
                        <DisplayLoanProductName loan={loan} />
                      </td>
                      <td>
                        {loan?.customer?.banking?.accountDetails
                          ?.CustomerName ??
                          `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
                      </td>
                      <td>N{loan?.loanamount}</td>
                      <td>{loan?.numberofmonth} Months</td>
                      <td>{getDateOnly(loan?.createdAt)}</td>
                      <td>
                        <div>
                          {loan?.isTopUpLoanSent ? (
                            <button className="btn btn-danger text-white">
                              Sent
                            </button>
                          ) : (
                            <div>
                              {
                                <button
                                  disabled={!canUserSendToCredit}
                                  className="btn btn-success text-white"
                                  onClick={() => handleSentRequest(loan?._id)}
                                >
                                  Send{" "}
                                  {sendingRequest &&
                                    selectedLoanId == loan._id && (
                                      <PageLoader width="12px" />
                                    )}
                                </button>
                              }
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        {loan?.loanstatus === "booked" ? (
                          <div>
                            {!isCoo ? (
                              loan?.currentLoanTerminationStatus ===
                              "pending" ? (
                                <button
                                  disabled={!canUserInitiateTermination}
                                  className="btn btn-info text-white"
                                  onClick={() => {
                                    setShowConfirmationModal(true);
                                    setSelectedLoanId(loan._id);
                                  }}
                                >
                                  Start
                                </button>
                              ) : loan?.currentLoanTerminationStatus ===
                                "initiated" ? (
                                <button className="btn btn-warning text-white">
                                  Initiated
                                </button>
                              ) : (
                                loan?.currentLoanTerminationStatus ===
                                  "completed" && (
                                  <button className="btn btn-primary text-white">
                                    Terminated
                                  </button>
                                )
                              )
                            ) : loan?.currentLoanTerminationStatus !==
                              "completed" ? (
                              <button
                                disabled={
                                  loan?.currentLoanTerminationStatus !==
                                  "initiated"
                                }
                                className="btn btn-success text-white"
                                onClick={() =>
                                  handleApproveTermination(loan?._id)
                                }
                              >
                                Approve{" "}
                                {isTerminating &&
                                  selectedLoanId == loan._id && (
                                    <PageLoader width="12px" />
                                  )}
                              </button>
                            ) : (
                              <button className="btn btn-primary text-white">
                                Approved
                              </button>
                            )}
                          </div>
                        ) : (
                          <button className="btn btn-danger text-white">
                            Not Booked
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
        <ToastContainer />

        {/* next and previous button */}
        <NextPreBtn
          currentPage={currentPage}
          totalPages={totalPages}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>

      <TerminateLoanModal
        show={showConfirmationModal}
        isLoading={isTerminating}
        handleProceed={async () => {
          await handleStartTermination();
          setShowConfirmationModal(false);
        }}
        handleClose={() => setShowConfirmationModal(false)}
      />
    </div>
  );
};

loansList.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default loansList;
