import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import "../../customers/Customer.css";
import NextPreBtn from "../../../shared/NextPreBtn";
import PageLoader from "../../../shared/PageLoader";
import NoResult from "../../../../shared/NoResult";
import sortByCreatedAt from "../../../shared/sortedByDate";
import TableOptionsDropdown from "../../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import EditEmployerLetterRule from "./editRule/EditEmployerLetterRule";
import { fetchEmployerLetterRules } from "../../../../../redux/reducers/employerLetterRuleReducer";

// custom hook
import usePagination from "../../../../../customHooks/usePagination";
import usePaginatedData from "../../../../../customHooks/usePaginationData";
import apiClient from "../../../../../lib/axios";

const EmployerLetterRuleList = () => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "0.9rem",
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

  const [selectedRule, setSelectedRule] = useState(null);
  const [show, setShow] = useState(false);

  // fetch all Loans
  const dispatch = useDispatch();
  const { employerLetterRules, status } = useSelector(
    (state) => state.employerLetterRuleReducer
  );

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchEmployerLetterRules());
    };

    getData();
  }, [dispatch]);

  // search employmentLetterRule list
  const [ruleList, setRuleList] = useState(employerLetterRules);

  // custom hook state pagination
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedEmployerLetterRulesList, totalPages } =
    usePaginatedData(employerLetterRules, showCount, currentPage);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setRuleList(paginatedEmployerLetterRulesList); // Update local state with paginated data
  }, [paginatedEmployerLetterRulesList]);

   useEffect(() => {
     setTotalPage(totalPages); // Update total pages when it changes
   }, [totalPages, setTotalPage]);




  const handleDeleteMandateRule = async (rule) => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await apiClient.delete(`${apiUrl}/api/employer-letter-rule/${rule._id}`);

      await dispatch(fetchEmployerLetterRules());
      toast.success("Employer Letter Rule Deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTableOptions = (rule) => {
    const tableOptions = [
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label: "Edit",
        isDisabled: false,
        func: () => {
          setSelectedRule(rule);
          setShow(true);
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Delete",
        isDisabled: false,
        func: async () => {
          await handleDeleteMandateRule(rule);
        },
      },
    ];

    return tableOptions;
  };

  const handleClose = () => {
    setShow(false);
    setSelectedRule(null);
  };

  return (
    <>
      <div className="MainBox mandateRule__containerList">
        <div>
          <h3>All Employer Letter Rule</h3>
        </div>
        <div>
          {/* data loader */}
          {status === "loading" && <PageLoader />}

          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="0 0 -3.6rem -1rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>S/N</th>
                    <th>Title</th>
                    <th>Maximum Tenure</th>
                    <th>Maximum Amount</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ruleList && sortByCreatedAt(ruleList)?.length === 0 && (
                    <NoResult name="Employment Letter Rule" />
                  )}

                  {ruleList &&
                    ruleList?.map((employmentLetterRule, index) => {
                      return (
                        <tr key={employmentLetterRule.id}>
                          <td>{index + 1}</td>
                          <td>{employmentLetterRule.ruleTitle}</td>
                          <td>{employmentLetterRule.maximumTenure}</td>

                          <td>{employmentLetterRule?.maximumAmount}</td>

                          <td>
                            <TableOptionsDropdown
                              items={getTableOptions(employmentLetterRule)}
                            />
                          </td>
                        </tr>
                      );
                    })}
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
      </div>

      {show && (
        <EditEmployerLetterRule
          handleClose={handleClose}
          show={show}
          selectedRule={selectedRule}
        />
      )}
    </>
  );
};

export default EmployerLetterRuleList;
