import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import "../../customers/Customer.css";
import NextPreBtn from "../../../shared/NextPreBtn";
import PageLoader from "../../../shared/PageLoader";
import getDateOnly from "../../../../../../utilities/getDate";
import NoResult from "../../../../shared/NoResult";
import sortByCreatedAt from "../../../shared/sortedByDate";
import TableOptionsDropdown from "../../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { fetchMandateRules } from "../../../../../redux/reducers/mandateRuleReducer";
import EditMandateRule from "./editRule/EditMandateRule";
import { toast } from "react-toastify";

// custom hook
import usePagination from "../../../../../customHooks/usePagination";
import usePaginatedData from "../../../../../customHooks/usePaginationData";
import apiClient from "../../../../../lib/axios";

const MandateRuleList = () => {
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

  const [selectedMandateRule, setSelectedMandateRule] = useState(null);
  const [show, setShow] = useState(false);

  // fetch all Loans
  const dispatch = useDispatch();
  const { mandateRules, status } = useSelector(
    (state) => state.mandateRuleReducer
  );

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchMandateRules());
    };

    getData();
  }, [dispatch]);

  // search mandateRule list
  const [mandateRuleList, setMandateRuleList] = useState(mandateRules);

  // custom hook state pagination
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedMandateRulesList, totalPages } =
    usePaginatedData(mandateRules, showCount, currentPage);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setMandateRuleList(paginatedMandateRulesList); // Update local state with paginated data
  }, [paginatedMandateRulesList]);

   useEffect(() => {
     setTotalPage(totalPages); // Update total pages when it changes
   }, [totalPages, setTotalPage]);


  const handleDeleteMandateRule = async (rule) => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await apiClient.delete(`${apiUrl}/api/mandate-rule/${rule._id}`);

      await dispatch(fetchMandateRules());
      toast.success("Mandate Deleted successfully");
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
          setSelectedMandateRule(rule);
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
    setSelectedMandateRule(null);
  };

  return (
    <>
      <div className="MainBox mandateRule__containerList">
        <div>
          <h3>All Mandate Rule</h3>
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
                    <th>Duration</th>
                    <th>Date</th>

                    <th>Stacking</th>
                    <th>Secondary Duration</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mandateRuleList &&
                    sortByCreatedAt(mandateRuleList)?.length === 0 && (
                      <NoResult name="Mandate Rule" />
                    )}
                  {mandateRuleList &&
                    mandateRuleList?.map((mandateRule, index) => {
                      return (
                        <tr key={mandateRule.id}>
                          <td>{index + 1}</td>
                          <td>{mandateRule.mandateTitle}</td>
                          <td>{mandateRule.mandateDuration}</td>

                          <td>{getDateOnly(mandateRule?.dateCreated)}</td>
                          <td>{mandateRule?.allowStacking}</td>
                          <td>{mandateRule?.secondaryDuration}</td>

                          <td>
                            <TableOptionsDropdown
                              items={getTableOptions(mandateRule)}
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
        <EditMandateRule
          handleClose={handleClose}
          show={show}
          selectedMandateRule={selectedMandateRule}
        />
      )}
    </>
  );
};

export default MandateRuleList;
