import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployers } from "../../../../redux/reducers/employersManagerReducer";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import EditEmployer from "./EditEmployer";
import ActionNotification from "../../shared/ActionNotification";
import getDateOnly from "../../../../../utilities/getDate";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";
import apiClient from "../../../../lib/axios";

const MdasEmployers = () => {
  const styles = {
    container: {
      margin: "0 4rem 0 1rem",
    },
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

  // hooks
  const [show, setShow] = useState(false);
  const [employersObj, setEmployersObj] = useState({});
  const [action, setAction] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [employersList, setEmployersList] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  const employers = useSelector(
    (state) => state.employersManagerReducer.employers.employers
  );
  const status = useSelector((state) => state.employersManagerReducer.status);

  // custom hook state pagination
  const [showCount, setShowCount] = useState(5);
  const [searchTerms, setSearchTerms] = useState("");
  const [totalPage, setTotalPage] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedEmployersList, totalPages } =
    usePaginatedData(employers, showCount, currentPage);

  // update loansList to show 5 pendingLoans on page load
  // or on count changes
  useEffect(() => {
    setEmployersList(paginatedEmployersList); // Update local state with paginated data
  }, [paginatedEmployersList]);

  useEffect(() => {
    setTotalPage(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPage]);

  // handle edit action
  const handleEdit = (e) => {
    // get id
    const id = e.target.id;
    // get employer object by id
    const employer = employers.find((employer) => employer._id === id);
    // set employer object
    setEmployersObj(employer);
    // show modal
    setShow(true);
  };

  // handle delete action
  const handleDelete = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BASE_URL;
      await apiClient.delete(`${apiUrl}/api/agency/employers/${deleteId}`);
      // close modal
      setAction(false);
      // fetch employers
      dispatch(fetchEmployers());
    } catch (error) {
      console.log(error);
      toast.error("Could not delete employer");
    }
  };

  // handle open notification modal
  const openDelete = (e) => {
    // get id
    const id = e.target.id;
    // set id
    setDeleteId(id);
    setAction(true);
  };

  return (
    <>
      <div style={styles.container} className="DCard">
        {status === "loading" && <PageLoader />}
        {/* table section */}
        <div>
          <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -2.55rem -1rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table}>
            <Table borderless hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Employer ID</th>
                  <th>Employer Name</th>
                  <th>Mandate Rule</th>

                  <th>Onboarding Date</th>
                  <th>Max Loan Tenure</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employersList?.map((employer) => (
                  <tr key={employer._id}>
                    <td>{employer.employersId}</td>
                    <td>{employer.employersName}</td>
                    <td>{employer?.mandateRule?.mandateTitle}</td>
                    <td>{getDateOnly(employer.dateAdded)}</td>
                    <td>{employer?.statementRule?.maximumTenure}</td>
                    <td>
                      <BocButton
                        id={employer._id}
                        bradius="12px"
                        fontSize="14px"
                        width="80px"
                        margin="0 4px"
                        bgcolor="#5cc51c"
                        func={(e) => handleEdit(e)}
                      >
                        Edit
                      </BocButton>

                      <BocButton
                        id={employer._id}
                        bradius="12px"
                        fontSize="14px"
                        width="80px"
                        margin="0 4px"
                        bgcolor="red"
                        func={(e) => openDelete(e)}
                      >
                        Delete
                      </BocButton>
                    </td>
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
      </div>
      {/* edit employer modal */}
      <EditEmployer
        show={show}
        onHide={() => setShow(false)}
        employerData={employersObj}
      />

      {/* acton popup model */}
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

export default MdasEmployers;
