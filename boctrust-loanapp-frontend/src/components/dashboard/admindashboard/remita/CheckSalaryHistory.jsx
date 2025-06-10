/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import NextPreBtn from "../../shared/NextPreBtn";
import CheckSalaryDetails from "./CheckSalaryDetails";
import "./Remita.css";
import "../customers/Customer.css";
import updateSalaryHistory from "./updateSalaryHistory.js";
import ViewBySection from "./ViewBySection.jsx";
import NoResult from "../../../shared/NoResult.jsx";

import useSearch from "../../../../../utilities/useSearchName.js";
import useSearchByDate from "../../../../../utilities/useSearchByDate.js";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange.js";
import sortByCreatedAt from "../../shared/sortedByDate.js";
import getDateOnly from "../../../../../utilities/getDate";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer.js";
import apiClient from "../../../../lib/axios.js";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";
// import OtherDocuments from "../kyc/OtherDocuments";

const CheckSalaryHistory = () => {
  const styles = {
    btnBox: {
      display: "flex",
      justifyContent: "center",
    },
    table: {
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
    pending: {
      color: "#ecaa00",
    },
  };

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const dispatch = useDispatch();
  const { allLoans, status } = useSelector((state) => state.loanReducer);

  const [customerObj, setCustomerObj] = useState({});
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loanList, setLoanList] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState([]);

  const [canUserManage, setCanUserManage] = useState(false);
  const [canUserBook, setCanUserBook] = useState(false);
  const [canUserApprove, setCanUserApprove] = useState(false);

  useEffect(() => {
    setCanUserManage(
      currentUser?.userRole?.can.includes("manageRemitaCollections")
    );
    setCanUserApprove(currentUser?.userRole?.can.includes("approveRemitaLoan"));
    setCanUserBook(currentUser?.userRole?.can.includes("bookRemitaLoan"));
  }, [currentUser]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchAllLoans());
    };
    getData();
  }, [dispatch, openDetails, customerObj]);

  const scrollToDetails = () => {
    if (openDetails) {
      const checkDetails = document.getElementById("checkDetails");
      checkDetails.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToDetails();
  }, [openDetails]);

  // handle check salary history
  const handleCheck = async (id) => {
    setIsLoading(true);
    setSelectedLoanId(id);
    scrollToDetails();
    try {
      const loan = allLoans.find((loan) => loan._id === id);
      const loanId = loan._id;
      const customer = loan ? loan.customer : {};

      const { data } = await apiClient.post(`/remita/get-salary-history`, {
        authorisationCode: customer.bvnnumber,
        firstName: customer.firstname,
        lastName: customer.lastname,
        accountNumber: customer.salaryaccountnumber,
        bankCode: customer.bankcode,
        bvn: customer.bvnnumber,
        authorisationChannel: "WEB",
        loanId,
      });

      // testing purpose
      // const { data } = await apiClient.post(`/remita/get-salary-history`, {
      //   authorisationCode: "22427322862",
      //   firstName: "SHARIF",
      //   lastName: "MAHMUD",
      //   accountNumber: "0239517545",
      //   bankCode: "058",
      //   bvn: "22427322862",
      //   authorisationChannel: "WEB",
      //   loanId, // updated
      // });

      setCustomerObj(data.data);

      // Update loan status locally for immediate UI change
      setLoanList((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, remita: { ...item.remita, isRemitaCheck: true } }
            : item
        )
      );

      setSearchCustomer((prevList) =>
        prevList.map((item) =>
          item._id === id
            ? { ...item, remita: { ...item.remita, isRemitaCheck: true } }
            : item
        )
      );

      // show notification
      toast.success(data.data.remita.remitaDetails.responseMsg);

      // refetch all loans
      dispatch(fetchAllLoans());

      setIsLoading(false);
      setOpenDetails(true);
    } catch (error) {
      console.error("Error checking salary:", error);
      toast.error("Network error. Try again!");
      setIsLoading(false);
    } finally {
      setSelectedLoanId(null);
    }
  };

  // display customer salary history details
  const handleView = (id) => {
    scrollToDetails();
    const loan = allLoans.find((loan) => loan._id === id);

    // update customer object state
    setCustomerObj(loan);

    console.log(loan.remita);

    setOpenDetails(true);
    // updated
    toast.success(loan.remita.remitaDetails.responseMsg);
  };

  // process booked or drop (unbooked) customer loan request
  const [processAction, setProcessAction] = useState(false);

  const handleInitiateCheck = async (loanId) => {
    setSelectedLoanId(loanId);
    await apiClient.put(`/remita/initiate-check/${loanId}`);

    toast.success("Credit Check Initiated and Pending Approval");

    setSelectedLoanId(null);
  };

  const handleAction = async (e, id) => {
    setProcessAction(true);
    setSelectedLoanId(id);
    e.preventDefault();
    const actionBtn = e.target.innerText;
    const loan = allLoans.find((loan) => loan._id === id);
    const loanId = loan._id; // updated

    try {
      let res;
      if (actionBtn !== "Drop") {
        if (loan.remita.remitaStatus === "check_approval") {
          res = await updateSalaryHistory(loanId, "booking");
          if (res) {
            // Update state locally
            setLoanList((prevList) =>
              prevList.map((item) =>
                item._id === id
                  ? {
                      ...item,
                      remita: { ...item.remita, remitaStatus: "booking" },
                    }
                  : item
              )
            );

            setSearchCustomer((prevList) =>
              prevList.map((item) =>
                item._id === id
                  ? {
                      ...item,
                      remita: { ...item.remita, remitaStatus: "booking" },
                    }
                  : item
              )
            );
            toast.success("Remita loan check approved successfully");
          }
        } else {
          await handleInitiateCheck(loanId);
        }
      } else {
        res = await updateSalaryHistory(loanId, "rejected");
        if (res) {
          // Update state locally
          setLoanList((prevList) =>
            prevList.map((item) =>
              item._id === id
                ? {
                    ...item,
                    remita: { ...item.remita, remitaStatus: "unbooked" },
                  }
                : item
            )
          );

          setSearchCustomer((prevList) =>
            prevList.map((item) =>
              item._id === id
                ? {
                    ...item,
                    remita: { ...item.remita, remitaStatus: "unbooked" },
                  }
                : item
            )
          );
          toast.success("Remita loan dropped (unbooked) successful");
        }
      }
      await dispatch(fetchAllLoans());
    } catch (error) {
      console.error("Error handling action:", error);

      toast.error(error?.response?.data?.error || "Something went Wrong");
    } finally {
      setProcessAction(false);
      setSelectedLoanId(null);
    }
  };

  // check if customer is kyc approved and deductions is remita
  useEffect(() => {
    if (allLoans?.length > 0) {
      const result = allLoans.filter(
        (loan) =>
          loan?.customer?.kyc.isKycApproved && loan.deductions === "remita"
      );

      setLoanList(result);
    }
  }, [allLoans]);

  /// custom hook state pagination
  const [showCount, _] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedLoansList } = usePaginatedData(
    loanList,
    showCount,
    currentPage
  );

  // update searchCustomer state
  useEffect(() => {
    if (paginatedLoansList?.length > 0) {
      setSearchCustomer(paginatedLoansList);
    } else {
      setSearchCustomer([]);
    }
  }, [paginatedLoansList]);

  // handle search by
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    loanList,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setSearchCustomer(filteredData);
  }, [searchTerm, filteredData]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(loanList, "createdAt");

  const searchByDate = () => {
    setSearchCustomer(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({ fromDate: "", toDate: "" });
    dispatch(fetchAllLoans());
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(loanList, dateRange, "createdAt");

  useEffect(() => {
    setSearchCustomer(searchData);
  }, [searchData]);

  return (
    <div>
      {/* viewby section */}
      <ViewBySection
        setSearch={setSearchTerm}
        setDateRange={setDateRange}
        dateRange={dateRange}
        searchDateFunc={searchByDate}
        handleReload={handleReload}
      />

      {/* data loader */}
      {status === "loading" && <PageLoader />}
      {/* table section */}
      <div className="RBox">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -2.55rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Account Number</th>
                <th>BVN</th>
                <th>Date</th>
                <th>Do Check</th>
                {canUserManage && <th>Status</th>}
              </tr>
            </thead>
            <tbody>
              {searchCustomer?.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <NoResult name="Remita Loan Request" />
                  </td>
                </tr>
              )}
              {sortByCreatedAt(searchCustomer)?.map((loan) => (
                <tr key={loan.customer._id}>
                  <td>{loan.customer.firstname}</td>
                  <td>{loan.customer.lastname}</td>
                  <td>{loan.customer.salaryaccountnumber}</td>
                  <td>{loan.customer.bvnnumber}</td>
                  <td>{getDateOnly(loan.customer.createdAt)}</td>
                  {loan.remita?.isRemitaCheck ? (
                    // <td
                    //   style={styles.pending}
                    //   className="startBtn"
                    //   onClick={() => handleView(loan._id)}
                    // >
                    //   View
                    // </td>
                    <td
                    style={styles.pending}
                    className="startBtn"
                    onClick={() => handleCheck(loan._id)}
                  >
                    {isLoading && selectedLoanId == loan._id && (
                      <PageLoader width="12px" />
                    )}{" "}
                    Start
                  </td>
                  ) : (
                    <td
                      style={styles.pending}
                      className="startBtn"
                      onClick={() => handleCheck(loan._id)}
                    >
                      {isLoading && selectedLoanId == loan._id && (
                        <PageLoader width="12px" />
                      )}{" "}
                      Start
                    </td>
                  )}
                  {canUserManage && (
                    <td>
                      {loan.remita?.remitaStatus !== "pending" &&
                        loan.remita?.remitaStatus !== "check_approval" &&
                        loan.remita?.remitaStatus !== "rejected" && (
                          <div>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="100px"
                              margin="0 4px"
                              bgcolor="green"
                            >
                              Processed
                            </BocButton>
                          </div>
                        )}
                      {loan.remita?.remitaStatus === "rejected" && (
                        <div>
                          <BocButton
                            bradius="12px"
                            fontSize="14px"
                            width="100px"
                            margin="0 4px"
                            bgcolor="#f64f4f"
                          >
                            Dropped
                          </BocButton>
                        </div>
                      )}
                      {
                        <div>
                          {processAction && selectedLoanId == loan._id ? (
                            <PageLoader width="12px" />
                          ) : (
                            <div>
                              {loan.remita.remitaStatus == "check_approval" ? (
                                <BocButton
                                  bradius="12px"
                                  fontSize="14px"
                                  width="90px"
                                  margin="4px"
                                  bgcolor="#145088"
                                  disable={!canUserApprove}
                                  func={(e) => handleAction(e, loan._id)}
                                >
                                  Approve
                                </BocButton>
                              ) : loan.remita.remitaStatus == "pending" ? (
                                <BocButton
                                  bradius="12px"
                                  fontSize="14px"
                                  width="90px"
                                  margin="4px"
                                  bgcolor="#145088"
                                  disable={!canUserManage}
                                  func={(e) => handleAction(e, loan._id)}
                                >
                                  Process
                                </BocButton>
                              ) : null}

                              {(loan.remita.remitaStatus == "pending" ||
                                loan.remita.remitaStatus ==
                                  "check_approval") && (
                                <BocButton
                                  bradius="12px"
                                  fontSize="14px"
                                  width="90px"
                                  margin="0 4px"
                                  bgcolor="#f64f4f"
                                  disable={!canUserManage && !canUserApprove}
                                  func={(e) => handleAction(e, loan._id)}
                                >
                                  Drop
                                </BocButton>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    </td>
                  )}
                </tr>
              ))}
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

      {/* details section */}
      {isLoading && <PageLoader />}
      {openDetails && (
        <div id="checkDetails">
          <CheckSalaryDetails
            customerObj={customerObj}
            setOpenDetails={setOpenDetails}
          />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CheckSalaryHistory;
