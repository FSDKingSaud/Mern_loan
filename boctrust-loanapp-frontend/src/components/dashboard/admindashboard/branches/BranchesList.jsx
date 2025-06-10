import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBranches } from "../../../../redux/reducers/branchReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import PageLoader from "../../shared/PageLoader";
import EditBranch from "./EditBranch";
import ActionNotification from "../../shared/ActionNotification";
import NoResult from "../../../shared/NoResult";

// function
import searchList from "../../../../../utilities/searchListFunc";
import sortByCreatedAt from "../../shared/sortedByDate";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";

const BranchesList = ({
  count,
  searchTerms,
  setTotalPages,
  currentPage,
  admin,
  adminRoles,
}) => {
  // styles
  const styles = {
    head: {
      color: "#fff",
      fontSize: "1rem",
      backgroundColor: "#145098",
    },
    table: {
      overflowX: "auto",
    },
    notFound: {
      // textAlign: "center",
      color: "#145098",
      fontSize: "1.5rem",
      paddingTop: "2rem",
    },
  };

  // component state
  const [branchObj, setBranchObj] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [actionType, setActionType] = useState("");
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBranches());
  }, [dispatch]);

  const branches = useSelector(
    (state) => state.branchReducer.branches.branches
  );

  const [branchesList, setBranchesList] = useState(branches);

  // custom pagination update
  const { paginatedData: paginatedBranchesList, totalPages } = usePaginatedData(
    branches,
    count,
    currentPage
  );

  useEffect(() => {
    setBranchesList(paginatedBranchesList); // Update local state with paginated data
  }, [paginatedBranchesList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  const status = useSelector((state) => state.branchReducer.status);

  // update branchesList on search
  const handleSearch = () => {
    const currSearch = searchList(branches, searchTerms, "branchName");
    setBranchesList(currSearch?.slice(0, count));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  // handle action selection
  const handleAction = (e) => {
    const action = e.target.value;
    const id = e.target.id;
    setActionType(action);
    setBranchId(id);

    // find branch by id
    const branch = branches.find((branch) => branch._id === id);
    setBranchObj(branch);

    // show modal
    if (action === "view" || action === "edit") {
      setShow(true);
    } else if (action === "delete") {
      // delete branch
      setAction(true);
    }
  };

  // handle delete action
  const handleDelete = async () => {
    const apiUrl = import.meta.env.VITE_BASE_URL;
    await fetch(`${apiUrl}/api/branch/branches/${branchId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch(fetchBranches());
    setAction(false);
  };

  return (
    <>
      {status === "loading" && <PageLoader />}

      <div>
        <div style={styles.table}>
          <Table borderless hover responsive="sm" className="RBox">
            <thead style={styles.head}>
              <tr>
                <th>Branch ID</th>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {branchesList?.length === 0 && <NoResult name="branches" />}
              {branchesList?.map((branch) => (
                <tr key={branch._id}>
                  <td>{branch.branchId}</td>
                  <td>{branch.branchName}</td>
                  <td>{branch.contactEmail}</td>
                  <td>{branch.phoneNumber}</td>
                  <td>{branch.address}</td>
                  <td>
                    <select
                      name="action"
                      className="action"
                      id={branch._id}
                      onChange={handleAction}
                    >
                      <option value="">Action</option>
                      <option value="view">View</option>
                      {admin || adminRoles?.includes("manageBranch") ? (
                        <>
                          <option value="edit">Edit</option>
                          <option value="delete">Delete</option>
                        </>
                      ) : null}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* next and previous button */}
      {/* <NextPreBtn
        count={showCount}
        prevFunc={handleNextPreBtn}
        nextFunc={handleNextPreBtn}
      /> */}

      {/* branch model */}
      <EditBranch
        show={show}
        actionType={actionType}
        branches={branchObj}
        onHide={() => setShow(false)}
        branchId={branchId}
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

BranchesList.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
  admin: PropTypes.string,
  adminRoles: PropTypes.array,
};

export default BranchesList;
