/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import CreditCheckForm from "./CreditCheckForm";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "../customers/Customer.css";
import "../remita/Remita.css";
import ViewBySection from "../remita/ViewBySection";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";
import KycViewDetails from "../kyc/KycViewDetails";
import { toast } from "react-toastify";
import { customerApprovalEnum } from "../../../../lib/userRelated";
import apiClient from "../../../../lib/axios";
import { fetchAllCreditAnalysis } from "../../../../redux/reducers/creditAnalysisReducer";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import OtherDocuments from "../kyc/OtherDocuments";

const styles = {
  btnBox: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    //   margin: "0 2rem 0 3rem",
    fontSize: "14px",
  },
  head: {
    color: "#fff",
  },
  approved: {
    color: "#5cc51c",
  },
  completed: {
    color: "#f64f4f",
  },
  pending: {
    color: "#ecaa00",
  },
  yes: {
    color: "#5cc51c",
    fontWeight: "bold",
  },
};

const CreditBureauDashboard = () => {
  const [selectedRecord, setSelectedRecord] = useState("");
  const [searchCreditAnalysis, setSearchCreditAnalysis] = useState(null);
  const [showCreditCheckForm, setShowCreditCheckForm] = useState(false);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTodayEntries, setSearchTodayEntries] = useState(false);

  const [showCount, _] = useState(10);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loanInfo, setLoanInfo] = useState(null);

  const [showOtherDocs, setShowOtherDocs] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState({});

  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // fetch all customer
  const dispatch = useDispatch();
  const { creditAnalysis, status } = useSelector(
    (state) => state.creditAnalysis
  );

  // Pagination State
  const [totalPage, setTotalPage] = useState(1);
  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedCreditRecordList, totalPages } =
    usePaginatedData(searchCreditAnalysis, showCount, currentPage);

  // get current login admin
  const admin = useSelector((state) => state.adminAuth.user);

  useEffect(() => {
    const getData = async () => {
      await dispatch(
        fetchAllCreditAnalysis({
          searchTerm,
          dateFilter: searchTodayEntries,
        })
      );
    };
    getData();
  }, [dispatch]);

  useEffect(() => {
    if (creditAnalysis?.length > 0) {
      setSearchCreditAnalysis(creditAnalysis);
    }
  }, [creditAnalysis]);

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    if (
      searchTerm.length >= 3 ||
      searchTerm.length == 0 ||
      searchTodayEntries
    ) {
      dispatch(
        fetchAllCreditAnalysis({
          searchTerm,
          dateFilter: searchTodayEntries,
        })
      );
    }
  }, [searchTerm, searchTodayEntries]);

  useEffect(() => {
    setTotalPage(totalPages);
  }, [totalPages]);

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCreditAnalysis({}));
    setSearchCreditAnalysis(creditAnalysis);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    creditAnalysis,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    if (searchData?.length > 0) {
      setSearchCreditAnalysis(searchData);
    }
  }, [searchData, creditAnalysis]);

  // handle credit check start btn
  const handleStartCheck = (record) => {
    setSelectedRecord(record);

    if (!record.assignment.isCreditAnalystAssigned) {
      setShow(true);
    } else {
      setShowError(true);
    }
  };

  // handle cancel check
  const handleCancelCheck = () => {
    setShowCreditCheckForm(false);
    setSelectedRecord("");
    dispatch(fetchAllCreditAnalysis({}));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showCreditCheckForm]);

  // handle assignment and start credit check
  const assignCustomer = async () => {
    await apiClient.put(`/credit-analysis/assignto/${selectedRecord._id}`);

    await dispatch(fetchAllCreditAnalysis({}));
  };

  const handleProceed = async () => {
    try {
      const res = await assignCustomer(); // assign customer to credit analyst

      setShow(false);
      setShowCreditCheckForm(true);
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  const checkViewPermissions = (userTypes) => {
    if (userTypes.includes(currentUser.userRole.value)) {
      return true;
    }
    return false;
  };

  const handleClose = () => {
    setShow(false);
    setShowError(false);
  };

  const handleViewDocs = (id) => {
    // filter customer by id and update current customer state
    const selectedRecord = creditAnalysis.find((record) => record._id === id);
    setCurrentCustomer(selectedRecord.customer);
    setShowOtherDocs(true);
  };

  return (
    <>
      {!showCreditCheckForm && !customerInfo && !showOtherDocs ? (
        <div>
          <div>
            {/* view by section */}
            <ViewBySection
              setSearch={setSearchTerm}
              setDateRange={setDateRange}
              dateRange={dateRange}
              setSearchTodayEntries={setSearchTodayEntries}
              handleReload={handleReload}
            />
          </div>

          {/* table section */}

          <div className="RBox">
            <DashboardHeadline
              fontSize="0.2rem"
              height="52px"
              mspacer="2rem 0 -3.25rem 0rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>S/N</th>
                    <th>Name</th>
                    <th>Employer</th>
                    <th>Loan Amt</th>
                    <th>Review</th>
                    <th>Docs</th>
                    <th>Assigned</th>
                    <th>Analyst Check</th>
                    {(currentUser.userRole.can.includes(
                      "headOfCreditApproval"
                    ) ||
                      currentUser.userRole.can.includes("cooApproval")) && (
                      <th>HOC Approval</th>
                    )}
                    {currentUser.userRole.can.includes("cooApproval") && (
                      <th>COO Approval</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {!paginatedCreditRecordList || status === "loading" ? (
                    <tr>
                      <td colSpan="7">
                        <PageLoader width="100px" />
                      </td>
                    </tr>
                  ) : paginatedCreditRecordList &&
                    paginatedCreditRecordList.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No record available
                      </td>
                    </tr>
                  ) : (
                    paginatedCreditRecordList &&
                    status != "loading" &&
                    paginatedCreditRecordList?.map((record, index) => (
                      <tr key={record._id}>
                        <td>{(currentPage - 1) * showCount + (index + 1)}</td>
                        <td>
                          {record.customer.firstname} {record.customer.lastname}
                        </td>
                        {record.customer.employer?.employersName ? (
                          <td>
                            <div
                              style={{
                                width: "120px",
                              }}
                            >
                              {record.customer.employer?.employersName}
                            </div>{" "}
                          </td>
                        ) : (
                          <td>N/A</td>
                        )}

                        <td>N{record.loan?.loanamount}</td>
                        <td
                          className="cursor-pointer text-primary underline text-underline"
                          onClick={() => {
                            setCustomerInfo(record.customer);
                            setLoanInfo(record.loan);
                          }}
                        >
                          Full Details
                        </td>
                        <td
                          onClick={() => handleViewDocs(record._id)}
                          style={styles.padding}
                          className="viewDocs"
                        >
                          View
                        </td>
                        {record.assignment.isCreditAnalystAssigned ? (
                          <td style={styles.yes} className="smallText">
                            Yes ({record?.assignment?.creditAnalyst?.fullName})
                          </td>
                        ) : (
                          <td style={styles.completed} className="smallText">No</td>
                        )}

                        {record?.decisionSummary
                          ?.creditOfficerApprovalStatus ===
                        customerApprovalEnum.pending ? (
                          <td>
                            <div>
                              <BocButton
                                bradius="12px"
                                fontSize="14px"
                                width="80px"
                                margin="0 4px"
                                bgcolor="#FFBF00"
                                func={() => {
                                  if (
                                    record?.assignment.creditAnalyst
                                      ?.fullName === admin.fullName
                                  ) {
                                    setSelectedRecord(record);
                                    setShowCreditCheckForm(true);
                                  } else {
                                    handleStartCheck(record);
                                  }
                                }}
                              >
                                {record?.assignment.creditAnalyst?.fullName ==
                                admin.fullName
                                  ? "Continue..."
                                  : "Start"}
                              </BocButton>
                            </div>
                          </td>
                        ) : (
                          <td>
                            <div>
                              <BocButton
                                bradius="12px"
                                fontSize="14px"
                                width="80px"
                                margin="0 4px"
                                bgcolor="#028a0f"
                                func={() => {
                                  if (
                                    checkViewPermissions([
                                      "credit_analyst",
                                      "super_admin",
                                    ])
                                  ) {
                                    setSelectedRecord(record);
                                    setShowCreditCheckForm(true);
                                  }
                                }}
                              >
                                {
                                  record?.decisionSummary
                                    ?.creditOfficerApprovalStatus
                                }
                              </BocButton>
                            </div>
                          </td>
                        )}

                        {(currentUser.userRole.can.includes(
                          "headOfCreditApproval"
                        ) ||
                          currentUser.userRole.can.includes("cooApproval")) && (
                          <td>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="80px"
                              margin="0 4px"
                              bgcolor={
                                record?.decisionSummary
                                  ?.headOfCreditApprovalStatus ===
                                customerApprovalEnum.approved
                                  ? "#028a0f"
                                  : "rgb(251 191 36)"
                              }
                              func={() => {
                                setSelectedRecord(record);
                                setShowCreditCheckForm(true);
                              }}
                            >
                              {
                                record?.decisionSummary
                                  ?.headOfCreditApprovalStatus
                              }
                            </BocButton>
                          </td>
                        )}
                        {currentUser.userRole.can.includes("cooApproval") && (
                          <td>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="80px"
                              margin="0 4px"
                              bgcolor={
                                record?.decisionSummary?.cooApprovalStatus ===
                                customerApprovalEnum.approved
                                  ? "#028a0f"
                                  : "rgb(251 191 36)"
                              }
                              func={() => {
                                setSelectedRecord(record);
                                setShowCreditCheckForm(true);
                              }}
                            >
                              {record?.decisionSummary?.cooApprovalStatus}
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
      ) : showCreditCheckForm ? (
        <div>
          {/* credit check form  */}
          <CreditCheckForm
            setShowCreditCheckForm={setShowCreditCheckForm}
            recordId={selectedRecord?._id}
            initFormStep={
              selectedRecord?.decisionSummary?.creditOfficerApprovalStatus ===
              customerApprovalEnum.approved
                ? 3
                : 0
            }
          />
          <div className="  d-flex justify-content-center">
            <button
              className="btn  col-md-4   btn-danger"
              onClick={handleCancelCheck}
            >
              Cancel Check
            </button>
          </div>
        </div>
      ) : showOtherDocs ? (
        <OtherDocuments
          customerObj={currentCustomer}
          setShowDocs={setShowOtherDocs}
        />
      ) : (
        customerInfo && (
          <KycViewDetails
            loan={loanInfo}
            customer={customerInfo}
            setShowInfo={setCustomerInfo}
          />
        )
      )}

      {/* pop up modal */}
      <div>
        <Modal show={show} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>{"Assign Customer Notification"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This customer will be assigned to you for credit check. Do you want
            to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProceed}>
              Assign/Proceed
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Error pop up modal */}
      <div>
        <Modal show={showError} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title> Error in Process</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This customer has already been assigned to another staff
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreditBureauDashboard;
