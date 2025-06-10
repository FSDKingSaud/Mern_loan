import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { fetchAdmins } from "../../../../redux/reducers/adminUserReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
import ActionNotification from "../../shared/ActionNotification";
import EditUser from "./EditUser";

import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import apiClient from "../../../../lib/axios";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";
import { useDebounce } from "../../../../../utilities/debounce";

const UsersList = ({ count, searchTerms, setTotalPages, currentPage }) => {
  const styles = {
    head: { color: "#fff", fontSize: "1rem", backgroundColor: "#145098" },
    img: { width: "50px", height: "40px" },
    table: { overflow: "auto" },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const users = useSelector((state) => state.adminUserReducer.admins.users);
  const status = useSelector((state) => state.adminUserReducer.status);

  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [show, setShow] = useState(false);
  const [action, setAction] = useState(false);
  const [userId, setUserId] = useState("");
  const [userObj, setUserObj] = useState({});
  const [adminRoles, setAdminRoles] = useState([]);
  const [viewEdit, setViewEdit] = useState("edit");

  const debouncedSearch = useDebounce(searchTerm, 3000);

  // Fetch users on initial load
  useEffect(() => {
    dispatch(fetchAdmins());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdmins(debouncedSearch));
  }, [dispatch, debouncedSearch]);

  // Update usersList based on the current page and count
  const { paginatedData: paginatedUsersList, totalPages } = usePaginatedData(
    users,
    count,
    currentPage
  );

  useEffect(() => {
    setUsersList(paginatedUsersList); // Update local state with paginated data
  }, [paginatedUsersList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // Update users list based on count
  useEffect(() => {
    setUsersList(users?.slice(0, count));
  }, [users, count]);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Update URL query parameter
    setSearchParams({ search: term });
  };

  // Handle action select
  const handleAction = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    const user = users.find((user) => user._id === id);

    setUserObj(user);
    setUserId(id);

    handleAdminRoles(user, setAdminRoles);

    if (option === "edit") {
      setShow(true);
      setViewEdit("edit");
    } else if (option === "view") {
      setShow(true);
      setViewEdit("view");
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    await apiClient.delete(`/admin/users/${userId}`);
    dispatch(fetchAdmins(searchTerm));
    setAction(false);
  };

  return (
    <>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div style={styles.table}>
        <Table hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {status === "loading" ? (
            <tr>
              <td colSpan="8">
                <PageLoader />
              </td>
            </tr>
          ) : (
            <tbody>
              {usersList?.length === 0 && <NoResult name="user" />}
              {usersList?.map((user) => (
                <tr key={user._id}>
                  <td>
                    <img
                      src={user.imageUrl}
                      alt="method-logo"
                      style={styles.img}
                    />
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.username}</td>
                  <td>{user?.userRole?.label || "All"}</td>
                  <td>
                    <span className="badge bg-success">
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <select
                      name="action"
                      className="action"
                      id={user._id}
                      onChange={handleAction}
                    >
                      <option value="">Action</option>
                      <option value="edit">Edit</option>
                      <option value="view">View</option>
                      <option value="delete">Delete</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </Table>
      </div>

      {show && (
        <EditUser
          show={show}
          onHide={() => setShow(false)}
          userobj={userObj}
          adminRoles={adminRoles}
          viewEdit={viewEdit}
        />
      )}
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

UsersList.propTypes = {
  count: PropTypes.number,
  searchTerms: PropTypes.string,
};

export default UsersList;
