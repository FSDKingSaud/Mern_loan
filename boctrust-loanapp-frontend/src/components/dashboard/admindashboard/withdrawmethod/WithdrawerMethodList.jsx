import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDisbursements } from "../../../../redux/reducers/disbursementMethodReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import ActionNotification from "../../shared/ActionNotification";
// functions
import getDateOnly from "../../../../../utilities/getDate";
import apiClient from "../../../../lib/axios";

const WithdrawerMethodList = () => {
  const styles = {
    table: {
      margin: "0 2rem 0 8rem",
    },
    head: {
      color: "#fff",
      fontSize: "1.2rem",
    },
    img: {
      width: "50px",
      height: "30px",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  // fetch disbursement methods
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchDisbursements());
  }, [dispatch]);

  const disbursements = useSelector(
    (state) => state.disbursementMethodReducer.disbursements.disbursements
  );
  const status = useSelector((state) => state.disbursementMethodReducer.status);
  // local state
  const [action, setAction] = useState(false);
  const [actionId, setActionId] = useState("");
  const [disbursementObj, setDisbursementObj] = useState({});

  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setActionId(id);
    // find single disbursement by id
    const disbursement = disbursements.find(
      (disbursement) => disbursement._id === id
    );
    setDisbursementObj(disbursement);

    if (option === "edit") {
      // edit disbursement
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // handle delete action
  const handleDelete = async (e) => {
    e.preventDefault();

    await apiClient
      .delete(`/disbursement/disbursements/${actionId}`, disbursementObj)

      .then((res) => res.json());
    setAction(false);
    dispatch(fetchDisbursements());
  };

  return (
    <>
      {status === "loading" ? (
        <PageLoader />
      ) : (
        <div className="ListSec">
          <DashboardHeadline
            height="52px"
            mspacer="2rem 0 -2.7rem 0.2rem"
            bgcolor="#145098"
          ></DashboardHeadline>
          <div style={styles.table} className="DCard">
            <Table hover responsive="sm">
              <thead style={styles.head}>
                <tr>
                  <th>Logo</th>
                  <th>Name</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {disbursements?.map((disbursement) => (
                  <tr key={disbursement._id}>
                    <td>
                      <img
                        src={disbursement.imageUrl}
                        alt="method-logo"
                        style={styles.img}
                      />
                    </td>
                    <td>{disbursement.methodName}</td>
                    <td>{getDateOnly(disbursement.createdAt)}</td>
                    <td style={styles.completed}>Active</td>
                    <td>
                      <select
                        name="action"
                        className="action"
                        id={disbursement._id}
                        onChange={(e) => handleSelect(e)}
                      >
                        <option value="">Action</option>
                        <option value="edit">Edit</option>
                        <option value="delete">Delete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
      <ActionNotification
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
        show={action}
      />
    </>
  );
};

export default WithdrawerMethodList;
