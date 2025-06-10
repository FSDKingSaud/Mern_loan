import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import PageLoader from "../../shared/PageLoader";
import Table from "react-bootstrap/Table";
import "../../Dashboard.css";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NoResult from "../../../shared/NoResult";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import searchList from "../../../../../utilities/searchListFunc";
import sortByCreatedAt from "../../shared/sortedByDate";

// custom hook
import usePaginatedData from "../../../../customHooks/usePaginationData";
import BocButton from "../../shared/BocButton";

const styles = {
  table: {
    overflowX: "auto",
  },
  head: {
    color: "#fff",
    fontSize: "1.2rem",
  },
  booked: {
    color: "#145098",
  },
  completed: {
    color: "#5cc51c",
  },
  withcredit: {
    color: "#f64f4f",
  },
  withdisbursement: {
    color: "#ecaa00",
  },
};

const CustomersList = ({
  count,
  setTotalPages,
  currentPage,
  searchTerms,
  setSelectedCustomer,
  setShowInfo,
}) => {
  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer("isKycApproved"));
  }, [dispatch]);

  // search customer list
  const [customerList, setCustomerList] = useState([]);
  // check customers not empty and update customerList
  // update customerList to show 10 customers on page load
  // or on count changes
  // custom pagination update
  const { paginatedData: paginatedCustomersList, totalPages } =
    usePaginatedData(customers, count, currentPage);

  useEffect(() => {
    // setBranchesList(paginatedCustomersList); // Update local state with paginated data
    if (paginatedCustomersList?.length > 0) {
      // const filteredCustomer = paginatedCustomersList?.filter(
      //   (customer) => customer?.kyc.isKycApproved === true
      // );
      // setCustomerList(filteredCustomer);
      setCustomerList(paginatedCustomersList);
    }
  }, [paginatedCustomersList]);

  useEffect(() => {
    setTotalPages(totalPages); // Update total pages when it changes
  }, [totalPages, setTotalPages]);

  // update customerList on search
  const handleSearch = () => {
    const currSearch = searchList(customers, searchTerms, `firstname`);
    setCustomerList(currSearch);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerms]);

  return (
    <>
      {status === "loading" && <PageLoader />}
      <div>
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -2.95rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table borderless hover responsive="sm" className="RBox">
            <thead style={styles.head}>
              <tr>
                <th>Photo</th>
                <th>A/C Number</th>
                <th>Customer ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Branch</th>
                {/* <th>Action</th> */}
              </tr>
            </thead>
            <tbody>
              {customerList?.length === 0 && <NoResult name="customer" />}
              {sortByCreatedAt(customerList)?.map((customer) => (
                <tr key={customer._id}>
                  <td>
                    <img
                      className="CustomerImg"
                      src={
                        customer?.photocaptureImg?.includes("undefined")
                          ? "/images/avater.jpg"
                          : customer.photocaptureImg
                      }
                      alt={customer.firstname}
                    />
                  </td>

                  <td>
                    {customer?.banking?.accountDetails?.AccountNumber || "-"}
                  </td>
                  <td>
                    {customer?.banking?.accountDetails?.CustomerID || "-"}
                  </td>
                  <td>{customer.firstname}</td>
                  <td>{customer.lastname}</td>
                  <td>{customer.email}</td>
                  <td>{customer.username}</td>
                  <td>{capitalizeEachWord(customer.branch)}</td>
                  <td>
                    <BocButton
                      func={() => {
                        setSelectedCustomer(customer);
                        setShowInfo(true);
                      }}
                      bgcolor="#ecaa00"
                      bradius="8px"
                    >
                      View
                    </BocButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {/* next and previous button  */}
      {/* <NextPreBtn
        nextFunc={handleGoNext}
        count={currentPage}
        numberOfPages={Math.ceil((customerList?.length - 1) / showCount)}
        prevFunc={handleGoPrev}
      /> */}

      {/* show loan details model  */}
      {/* {show && (
        <LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />
      )} */}
    </>
  );
};

CustomersList.propTypes = {
  searchTerms: PropTypes.string,
  showCount: PropTypes.number,
};

export default CustomersList;
