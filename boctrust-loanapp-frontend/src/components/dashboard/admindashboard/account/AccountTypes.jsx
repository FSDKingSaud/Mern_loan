import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccount } from "../../../../redux/reducers/accountReducer";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import AddNewAccountType from "./AddNewAccountType";
import Table from "react-bootstrap/Table";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
// function
import searchList from "../../../../../utilities/searchListFunc";
import ActionNotification from "../../shared/ActionNotification";
import EditAccount from "./EditAccount";
import handleAdminRoles from "../../../../../utilities/getAdminRoles";
import apiClient from "../../../../lib/axios";
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const AccountTypes = () => {
  const [openAddAccountType, setOpenAddAccountType] = useState(false);

  // fetch account type
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  const accounts = useSelector(
    (state) => state.accountReducer.accounts.accounts
  );
  const status = useSelector((state) => state.accountReducer.status);

  // local account state
  const [accountsList, setAccountsList] = useState(accounts);

  const [searchTerm, setSearchTerm] = useState("");
  // single account object
  const [accountObj, setAccountObj] = useState({});
  const [accountId, setAccountId] = useState("");
  const [action, setAction] = useState(false);
  const [openEditModel, setOpenEditModel] = useState(false);

   // handle search
   const [showCount, setShowCount] = useState(10);
   const [totalPage, setTotalPage] = useState(1);
 
   // custom hook destructuring
   const { currentPage, goToNextPage, goToPreviousPage, setPage } =
     usePagination(1, totalPage);
   const { paginatedData: paginatedAccountTypes, totalPages } = usePaginatedData(
     accountsList,
     showCount,
     currentPage
   );

   useEffect(() => {
     setTotalPage(totalPages); // Update total pages when it changes
   }, [totalPages, setTotalPage]);

  // update accountsList to show 10 accounts on page load
  // on count change
  useEffect(() => {
    setAccountsList(accounts?.slice(0, showCount));
  }, [accounts, showCount]);

  // add account handler
  const handleAddAccountType = () => {
    setOpenAddAccountType(true);
  };

  // update accountsList on search
  const handleSearch = () => {
    const currSearch = searchList(accounts, searchTerm, "accountName");
    setAccountsList(currSearch?.slice(0, showCount));
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  // handle account delete action
 
  const handleDelete = async () => {
    await apiClient.delete(`/account/accounts/${accountId}`);
    dispatch(fetchAccount());
    setAction(false);
  };

  // handle action select
  const handleSelect = (e) => {
    const option = e.target.value;
    const id = e.target.id;
    setAccountId(id);
    // find single account
    const account = accounts.find((account) => account._id === id);
    setAccountObj(account);
    if (option === "edit") {
      setOpenEditModel(true);
    } else if (option === "delete") {
      setAction(true);
    }
  };

  // role based access
  const currentUser = useSelector((state) => state.adminAuth.user);
  const [admin, setAdmin] = useState("");
  const [adminRoles, setAdminRoles] = useState([]);
  useEffect(() => {
    if (currentUser) {
      if (currentUser.userType === "admin" || currentUser.userType === "md") {
        setAdmin("admin");
      }

      handleAdminRoles(currentUser, setAdminRoles);
    }
  }, []);
  // style
  const styles = {
    head: {
      color: "#fff",
      fontSize: "1rem",
      backgroundColor: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
    withcredit: {
      color: "#f64f4f",
    },
  };

   

  return (
    <>
      {!openAddAccountType ? (
        <div className="MainBox">
          {admin || adminRoles?.includes("add_new_account") ? (
            <div className="AddBtn">
              <BocButton
                bgcolor="#ecaa00"
                bradius="22px"
                func={handleAddAccountType}
              >
                <span>+</span> Add New Account
              </BocButton>
            </div>
          ) : null}

          {/* top search bar */}
          <div className="Search">
            <DashboardHeadline padding="0" height="70px" bgcolor="#d9d9d9">
              <div className="SearchBar">
                <div className="FormGroup">
                  <label htmlFor="show">Show</label>
                  <input
                    name="showCount"
                    type="number"
                    step={10}
                    min={10}
                    value={showCount}
                    onChange={(e) => setShowCount(e.target.value)}
                  />
                </div>
                <div className="FormGroup SBox">
                  <input
                    name="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <img src="/images/search.png" alt="search-icon" />
                </div>
              </div>
            </DashboardHeadline>
          </div>
          <div>
            {status === "loading" ? (
              <PageLoader />
            ) : (
              <div className="ListSec">
                <div style={styles.table}>
                  <Table borderless hover responsive="sm">
                    <thead style={styles.head}>
                      <tr>
                        <th>Name</th>
                        <th>Interest Rate</th>
                        <th>Interest Method</th>
                        <th>Interest Period</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAccountTypes?.length === 0 && (
                        <NoResult name="Account" />
                      )}
                      {paginatedAccountTypes?.map((account) => (
                        <tr key={account._id}>
                          <td>{account.accountName}</td>
                          <td>{account.interestRate.toFixed(2)}%</td>
                          <td>{account.interestMethod}</td>
                          <td>{account.interestPeriod}</td>
                          <td style={styles.completed}>Active</td>
                          <td>
                            <select
                              name="action"
                              id={account._id}
                              className="action"
                              onChange={(e) => handleSelect(e)}
                              style={styles.select}
                            >
                              <option value="">Action</option>
                              {admin || adminRoles?.includes("edit_account") ? (
                                <option value="edit">Edit</option>
                              ) : null}
                              {admin ||
                              adminRoles?.includes("delete_account") ? (
                                <option value="delete">Delete</option>
                              ) : null}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

            {/* next and previous button  */}
            <NextPreBtn
              currentPage={currentPage}
              totalPages={totalPage}
              goToNextPage={goToNextPage}
              goToPreviousPage={goToPreviousPage}
            />
          </div>
        </div>
      ) : (
        <AddNewAccountType func={setOpenAddAccountType} />
      )}

      <EditAccount
        show={openEditModel}
        onHide={() => setOpenEditModel(false)}
        account={accountObj}
      />
      <ActionNotification
        show={action}
        handleClose={() => setAction(false)}
        handleProceed={handleDelete}
      />
    </>
  );
};

export default AccountTypes;
