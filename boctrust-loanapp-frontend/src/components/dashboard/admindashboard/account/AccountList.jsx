import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import PageLoader from "../../shared/PageLoader";
import NoResult from "../../../shared/NoResult";
import searchList from "../../../../../utilities/searchListFunc";
import sortByCreatedAt from "../../shared/sortedByDate";
import { fetchAllLoanOfficers } from "../../../../redux/reducers/loanOfficerReducer";
import usePaginatedData from "../../../../customHooks/usePaginationData";

const AccountList = ({ count, setTotalPage, currentPage, searchTerms }) => {
  const styles = {
    table: {},
    head: { color: "#fff", fontSize: "1.2rem" },
    completed: { color: "#5cc51c" },
  };

  const [filteredCustomers, setFilteredCustomers] = useState(null);
  const [customerList, setCustomerList] = useState(null);

  // Redux dispatch & selectors
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers?.customer
  );
  const status = useSelector((state) => state.customerReducer.status);
  const allLoanOfficers = useSelector(
    (state) => state.loanOfficerReducer.allLoanOfficers
  );

  // Custom pagination hook
  const { paginatedData: paginatedCustomersList, totalPages } =
    usePaginatedData(filteredCustomers, count, currentPage);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllCustomer());
    dispatch(fetchAllLoanOfficers());
  }, [dispatch]);

  // Filter customers by account creation
  useEffect(() => {
    setFilteredCustomers(
      customers?.filter(
        (customer) => customer?.banking?.isAccountCreated === true
      )
    );
  }, [customers]);

  useEffect(() => {
    // Search customer list
    setCustomerList(
      searchTerms
        ? searchList(filteredCustomers, searchTerms, "firstname")
        : paginatedCustomersList
    );
  }, [searchTerms, filteredCustomers, paginatedCustomersList]);

  // Update total pages in parent component
  useEffect(() => {
    setTotalPage(totalPages);
  }, [totalPages]);

  const handleGetAgent = (agentcode) => {
    const agent = allLoanOfficers?.find((officer) => officer.Code == agentcode);
    return agent ? agent.Name : "Boctrust";
  };

  return (
    <div>
      {status === "loading" && <PageLoader />}
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.95rem -1rem"
        bgcolor="#145098"
      />
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Account Number</th>
              <th>Customer</th>
              <th>Account ID</th>
              <th>Account Officer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customerList?.length === 0 && <NoResult name="customer" />}
            {customerList ? (
              sortByCreatedAt(customerList)?.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    {customer.banking?.accountDetails?.AccountNumber || "N/A"}
                  </td>
                  <td>
                    {customer.banking?.accountDetails?.CustomerName || "N/A"}
                  </td>
                  <td>
                    {customer.banking?.accountDetails?.CustomerID || "N/A"}
                  </td>
                  <td>{handleGetAgent(customer?.agentCode)}</td>
                  <td style={styles.completed}>Active</td>
                </tr>
              ))
            ) : (
              <PageLoader width="100px" />
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

AccountList.propTypes = {
  searchTerms: PropTypes.string,
  count: PropTypes.number.isRequired,
  setTotalPages: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default AccountList;
