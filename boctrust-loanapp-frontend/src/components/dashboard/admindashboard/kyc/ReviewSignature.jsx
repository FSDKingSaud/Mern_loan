import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "./Kyc.css";
import ViewBySection from "../remita/ViewBySection";
import useSearch from "../../../../../utilities/useSearchName";
import useSearchByDate from "../../../../../utilities/useSearchByDate";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";

// custom hook
import usePagination from "../../../../customHooks/usePagination";
import usePaginatedData from "../../../../customHooks/usePaginationData";


const ReviewSignature = () => {
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
    padding: {
      color: "#ecaa00",
    },
  };

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );

  // custom hook state pagination
  const [showCount, setShowCount] = useState(5);
  const [totalPage, setTotalPage] = useState(1);

  // custom hook destructuring
  const { currentPage, goToNextPage, goToPreviousPage, setPage } =
    usePagination(1, totalPage);

  const { paginatedData: paginatedCustomersList, totalPages } =
    usePaginatedData(customers, showCount, currentPage);

    
  const status = useSelector((state) => state.customerReducer.status);
  
  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // update searchCustomer state
  const [searchCustomer, setSearchCustomer] = useState([]);
  useEffect(() => {
    if (customers?.length > 0) {
      setSearchCustomer(customers);
    } else {
      setSearchCustomer([]);
    }
  }, [customers]);

  // handle search by
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    customers,
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
  const { filteredDateData } = useSearchByDate(customers, "createdAt");
  const searchByDate = () => {
    setSearchCustomer(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCustomer());
    setSearchCustomer(customers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    customers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setSearchCustomer(searchData);
  }, [searchData]);

  return (
    <div>
      <div>
        <ViewBySection
          setSearch={setSearchTerm}
          setDateRange={setDateRange}
          dateRange={dateRange}
          searchDateFunc={searchByDate}
          handleReload={handleReload}
        />
      </div>

      {/* data loader */}
      {status === "loading" && <PageLoader />}

      {/* table section */}
      <div className="Section RBox DCard">
        <DashboardHeadline
          height="52px"
          mspacer="2rem 0 -3.5rem -1rem"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table hover responsive="sm">
            <thead style={styles.head}>
              <tr>
                <th>Customer ID</th>
                <th>Full Name</th>
                <th>Is match</th>
                <th>Valid ID Submitted</th>
                <th>Facial Capture</th>
                <th>Valid Signature</th>
                <th>KYC Approved</th>
              </tr>
            </thead>
            <tbody>
              {searchCustomer?.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
              {searchCustomer?.map((customer) => (
                <tr key={customer._id}>
                  <td>{customer.customerId}</td>
                  <td>{customer.firstname + " " + customer.lastname}</td>
                  <td>
                    {customer.kyc.isFacialMatch ? (
                      <span style={styles.approved}>Yes</span>
                    ) : (
                      <span style={styles.completed}>No</span>
                    )}
                  </td>
                  <td>
                    {customer.kyc.isIdCardValid ? (
                      <span style={styles.approved}>Yes</span>
                    ) : (
                      <span style={styles.completed}>No</span>
                    )}
                  </td>
                  <td>
                    {customer.kyc.isPhotoCaptured ? (
                      <span style={styles.approved}>Yes</span>
                    ) : (
                      <span style={styles.completed}>No</span>
                    )}
                  </td>
                  <td>
                    {customer.kyc.isSignatureValid ? (
                      <span style={styles.approved}>Yes</span>
                    ) : (
                      <span style={styles.completed}>No</span>
                    )}
                  </td>
                  <td>
                    {customer.kyc.isKycApproved ? (
                      <span style={styles.approved}>Yes</span>
                    ) : (
                      <span style={styles.completed}>No</span>
                    )}
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
  );
};

export default ReviewSignature;
