/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Headline from "../../../shared/Headline";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "./Kyc.css";
// function
import getDateOnly from "../../../../../utilities/getDate";
import getTime from "../../../../../utilities/getTime";
import OtherDocuments from "./OtherDocuments";
import ViewBySection from "../remita/ViewBySection";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";
import sortByCreatedAt from "../../shared/sortedByDate";
import KycViewDetails from "./KycViewDetails";
import { fetchAllCustomersLoans } from "../../../../redux/reducers/customersLoansReducer";
import apiClient from "../../../../lib/axios";
import { useLocation } from "react-router-dom";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const KycCheck = () => {
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
    padding: {
      color: "#ecaa00",
    },
  };

  const location = useLocation();

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customersLoansReducer.customersAndLoans
  );

  const status = useSelector((state) => state.customerReducer.status);
  // component state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCustomer, setSearchCustomer] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState({});
  const [showKycDetails, setShowKycDetails] = useState(false);

  // custom hook state pagination
  const [showCount, _] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedCustomersList, totalPages } =
    usePaginatedData(searchCustomer, showCount, currentPage);

  // form input state
  const [isFacialMatch, setIsFacialMatch] = useState(null);
  const [isIdCardValid, setIsIdCardValid] = useState(null);
  const [isPhotoCaptured, setIsPhotoCaptured] = useState(null);
  const [isSignatureValid, setIsSignatureValid] = useState(null);
  const [isOtherDocsValidated, setIsOtherDocsValidated] = useState(null);
  const [isKycApproved, setIsKycApproved] = useState(null);
  const [showOtherDocs, setShowOtherDocs] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [searchTodayEntries, setSearchTodayEntries] = useState(false);
  // processing bar state
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchAllCustomersLoans());
    };

    getData();
  }, [dispatch, showKycDetails]);

  // update searchCustomer state
  useEffect(() => {
    if (customers?.length > 0) {
      setSearchCustomer(customers);
    }
  }, [customers]);

  useEffect(() => {
    setTotalPage(totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (
      searchTerm.length >= 3 ||
      searchTerm.length == 0 ||
      searchTodayEntries
    ) {
      dispatch(
        fetchAllCustomersLoans({
          searchTerm,
          dateFilter: searchTodayEntries,
        })
      );
    }
  }, [searchTerm, searchTodayEntries]);

  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showKycDetails]);

  // handle radio input changes
  const handleRadioChange = (name, value) => {

    switch (name) {
      case "isFacialMatch":
        setIsFacialMatch(value);
        break;
      case "isIdCardValid":
        setIsIdCardValid(value);
        break;
      case "isPhotoCaptured":
        setIsPhotoCaptured(value);
        break;
      case "isSignatureValid":
        setIsSignatureValid(value);
        break;
      case "isOtherDocsValidated":
        setIsOtherDocsValidated(value);
        break;
      case "isKycApproved":
        setIsKycApproved(value);
        break;
      default:
        break;
    }
  };

  // handle view docs
  const handleViewDocs = (id) => {
    setCustomerId(id);

    // filter customer by id and update current customer state
    const customer = customers.filter((customer) => customer._id === id);
    setCurrentCustomer(customer[0]);
    setShowOtherDocs(true);
  };

  const handleViewInfo = (id) => {
    setCustomerId(id);

    // filter customer by id and update current customer state
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomer(customer);
    setShowInfo(true);
  };

  // handle credit check start btn
  const handleStartCheck = (id) => {
    setCustomerId(id);
    setShowKycDetails(true);

    // filter customer by id and update current customer state
    const customer = customers.find((customer) => customer._id === id);
    setCurrentCustomer(customer);
  };

  // handle save kyc check and create bankone account
  const handleSaveCheck = async () => {
    setProgress(true);
    const data = {
      isFacialMatch,
      isIdCardValid,
      isPhotoCaptured,
      isSignatureValid,
      isOtherDocsValidated,
      isKycApproved,
    };

    // send update to backend
    await apiClient.put(`/updatecustomer/kyc/${customerId}`, data);


    await dispatch(fetchAllCustomersLoans({}));
    setShowKycDetails(false);
    setProgress(false);
  };

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCustomersLoans({}));
    setSearchTodayEntries(false);

    setSearchCustomer(customers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    customers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setSearchCustomer(searchData);
  }, [searchData, customers]);

  return (
    <>
      {!showOtherDocs && !showInfo && (
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

          {/* data loader */}
          {status === "loading" && <PageLoader />}

          {/* table section */}
          <div className="Section RBox DCard">
            <DashboardHeadline
              height="52px"
              mspacer="2rem 0 -2.55rem -1rem"
              bgcolor="#145098"
            />
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>Customer ss ID</th>
                    <th>Full Name</th>
                    <th>Phone</th>
                    <th>Date</th>
                    {location.pathname === "/dashboard/kyc" && (
                      <th>View Details</th>
                    )}
                    <th>View Documents</th>
                    {location.pathname === "/dashboard/kyc" && (
                      <th>Do Review</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {searchCustomer?.length === 0 && searchData ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center" }}>
                        No data available
                      </td>
                    </tr>
                  ) : (
                    sortByCreatedAt(paginatedCustomersList)?.map((customer) => (
                      <tr key={customer._id}>
                        <td>{customer.customerId}</td>
                        <td>{customer.firstname + " " + customer.lastname}</td>
                        <td>{customer.phonenumber}</td>
                        <td>{getDateOnly(customer.createdAt)}</td>
                        {location.pathname === "/dashboard/kyc" && (
                          <td
                            onClick={() => handleViewInfo(customer._id)}
                            style={styles.padding}
                            className="viewDocs"
                          >
                            View
                          </td>
                        )}
                        <td
                          onClick={() => handleViewDocs(customer._id)}
                          style={styles.padding}
                          className="viewDocs"
                        >
                          View
                        </td>
                        {location.pathname === "/dashboard/kyc" && (
                          <td>
                            <div>
                              {customer.kyc.isKycApproved ? (
                                <BocButton
                                  bradius="12px"
                                  fontSize="14px"
                                  margin="0 4px"
                                  bgcolor="#5cc51c"
                                >
                                  Done
                                </BocButton>
                              ) : customer.kyc.isKycApproved === null ? (
                                <a href="#kycSection">
                                  <BocButton
                                    bradius="12px"
                                    fontSize="14px"
                                    margin="0 4px"
                                    bgcolor="#f59e0b"
                                    func={() => handleStartCheck(customer._id)}
                                  >
                                    Check
                                  </BocButton>
                                </a>
                              ) : (
                                <BocButton
                                  bradius="12px"
                                  fontSize="14px"
                                  margin="0 4px"
                                  bgcolor="#f43f5e"
                                  func={() => handleStartCheck(customer._id)}
                                >
                                  Canceled
                                </BocButton>
                              )}
                            </div>
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

          {/* kyc detail section */}
          {showKycDetails && (
            <div className="KSection" id="kycSection">
              <Headline text="Check Customer KYC Details" />
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <Headline fontSize="24px" text="Valid ID Card View" />
                  <div className="IdCard">
                    <div>
                      {currentCustomer?.valididcard ? (
                        <img
                          src={currentCustomer.valididcard}
                          alt="official-id"
                        />
                      ) : (
                        <img src="/images/officialid.png" alt="official-id" />
                      )}
                    </div>

                    <div className="MatchCon">
                      <Headline
                        fontSize="16px"
                        align="left"
                        text="Admin Review"
                      />
                      <div className="Match">
                        <p>Is there a Facial Match?</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isFacialMatch"
                              value={true}
                              onChange={(e) =>
                                handleRadioChange(
                                  "isFacialMatch",
                                  e.target.value
                                )
                              }
                            />
                            <span>Yes</span>
                          </label>

                          <label htmlFor="no">
                            <input
                              type="radio"
                              className="no"
                              name="isFacialMatch"
                              value={false}
                              onChange={(e) =>
                                handleRadioChange(
                                  "isFacialMatch",
                                  e.target.value
                                )
                              }
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      <div className="Match">
                        <p>Is there a Valid ID Card?</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isIdCardValid"
                              value={true}
                              onChange={(e) =>
                                handleRadioChange(
                                  "isIdCardValid",
                                  e.target.value
                                )
                              }
                            />
                            <span>Yes</span>
                          </label>

                          <label>
                            <input
                              type="radio"
                              className="no"
                              name="isIdCardValid"
                              value={false}
                              onChange={(e) =>
                                handleRadioChange(
                                  "isIdCardValid",
                                  e.target.value
                                )
                              }
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      <div className="Match">
                        <p>Is there a Photo Capture?</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isPhotoCaptured"
                              value={true}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isPhotoCaptured",
                                  e.target.value
                                );
                              }}
                            />

                            <span>Yes</span>
                          </label>

                          <label>
                            <input
                              type="radio"
                              className="no"
                              name="isPhotoCaptured"
                              value={false}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isPhotoCaptured",
                                  e.target.value
                                );
                              }}
                            />

                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      <div className="Match">
                        <p>Is there a Valid Signature?</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isSignatureValid"
                              value={true}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isSignatureValid",
                                  e.target.value
                                );
                              }}
                            />
                            <span>Yes</span>
                          </label>

                          <label>
                            <input
                              type="radio"
                              className="no"
                              name="isSignatureValid"
                              value={false}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isSignatureValid",
                                  e.target.value
                                );
                              }}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>

                      <div className="Match">
                        <p>Is Other Document Verified?</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isOtherDocsValidated"
                              value={true}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isOtherDocsValidated",
                                  e.target.value
                                );
                              }}
                            />
                            <span>Yes</span>
                          </label>

                          <label>
                            <input
                              type="radio"
                              className="no"
                              name="isOtherDocsValidated"
                              value={false}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isOtherDocsValidated",
                                  e.target.value
                                );
                              }}
                            />
                            <span> No</span>
                          </label>
                        </div>
                      </div>

                      <div className="Match matchKyc">
                        <p>KYC Completed & Approved</p>
                        <div className="Radio">
                          <label>
                            <input
                              type="radio"
                              className="yes"
                              name="isKycApproved"
                              value={true}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isKycApproved",
                                  e.target.value
                                );
                              }}
                            />
                            <span>Yes</span>
                          </label>

                          <label>
                            <input
                              type="radio"
                              className="no"
                              name="isKycApproved"
                              value={false}
                              onChange={(e) => {
                                handleRadioChange(
                                  "isKycApproved",
                                  e.target.value
                                );
                              }}
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-sm-12 col-md-6">
                  <Headline
                    fontSize="24px"
                    text=" Application Facial Capture View"
                  />
                  <div className="Capture DCard">
                    {currentCustomer?.photocapture ? (
                      <img
                        src={currentCustomer.photocaptureImg}
                        alt="face-capture"
                        className="FaceCapture"
                      />
                    ) : (
                      <img
                        src="/images/avater.jpg"
                        alt="face-capture"
                        className="FaceCapture"
                      />
                    )}

                    <div className="TimeStamp">
                      <p>Time Stamp:</p>
                      <div>
                        <p>{getDateOnly(currentCustomer.createdAt)}</p>
                        <p className="Time">
                          {getTime(currentCustomer.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Headline fontSize="24px" text="Signature View" />
                    {currentCustomer?.signature ? (
                      <img
                        src={currentCustomer.signature}
                        alt="official signature"
                        className="Signature"
                      />
                    ) : (
                      <img
                        src="/images/signature1.png"
                        alt="official signature"
                        className="Signature"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="checkBtn">
                <BocButton
                  bradius="12px"
                  fontSize="18px"
                  margin="8px 28px"
                  bgcolor="#f64f4f"
                  func={handleSaveCheck}
                >
                  Invalidate/Cancel
                </BocButton>
                {!progress ? (
                  <BocButton
                    bradius="12px"
                    fontSize="18px"
                    margin="8px 28px"
                    bgcolor="#145098"
                    func={handleSaveCheck}
                    disable={
                      !(
                        isFacialMatch === "true" &&
                        isIdCardValid === "true" &&
                        isPhotoCaptured === "true" &&
                        isSignatureValid === "true" &&
                        isOtherDocsValidated === "true" &&
                        isKycApproved === "true"
                      )
                    }
                  >
                    Validate/Approve
                  </BocButton>
                ) : (
                  <PageLoader />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* other document component */}
      {showOtherDocs && (
        <OtherDocuments
          customerObj={currentCustomer}
          setShowDocs={setShowOtherDocs}
        />
      )}
      {showInfo && (
        <KycViewDetails
          loan={currentCustomer?.loan}
          customer={currentCustomer}
          setShowInfo={setShowInfo}
        />
      )}
    </>
  );
};

export default KycCheck;
