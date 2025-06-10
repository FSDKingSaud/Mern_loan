import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCustomer } from "../../../../redux/reducers/customerReducer";
import getDateOnly from "../../../../../utilities/getDate";
import capitalizeEachWord from "../../../../../utilities/capitalizeFirstLetter";
import LoanDetails from "./LoanDetails";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import sortByCreatedAt from "../../shared/sortedByDate";

const ActiveLoans = () => {
  const styles = {
    table: {
      //   margin: "0 2rem 0 3rem",
      fontSize: "14px",
    },
    head: {
      color: "#fff",
      fontSize: "1rem",
    },
    padding: {
      color: "#5cc51c",
    },
  };

    // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customerReducer.customers.customer
  );
  const status = useSelector((state) => state.customerReducer.status);

  useEffect(() => {
    dispatch(fetchAllCustomer());
  }, [dispatch]);

  // filtere customer by isKycApproved
  const filteredCustomers = customers?.filter(
    (customer) => customer.kyc.isKycApproved === true && customer.kyc.loanstatus === "completed"
  );

  const [show, setShow] = useState(false);
  const [loanObj, setLoanObj] = useState({});
  // handle close loan details
  const handleClose = () => {
    setLoanObj({});
    setShow(false);
  };

  // handle show loan details
  const handleShow = (id) => {
    const loan = filteredCustomers.find((customer) => customer._id === id);
    setLoanObj(loan);
    setShow(true);
  };

  return (
    <>
      {/* data loader */}
      {status === "loading" && <PageLoader />}
      <DashboardHeadline
        height="52px"
        mspacer="2rem 0 -2.5rem -1rem"
        bgcolor="#145098"
      ></DashboardHeadline>
      <div style={styles.table}>
        <Table borderless hover responsive="sm">
          <thead style={styles.head}>
            <tr>
              <th>Loan ID</th>
              <th>Loan Product</th>
              <th>Borrower</th>
              <th>A/C Number</th>
              <th>Date</th>
              <th>Applied Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortByCreatedAt(filteredCustomers)?.map((customer) => {
              return (
                <tr key={customer._id}>
                  <td>{customer.banking?.accountDetails?.Message.Id}</td>
                  <td>{customer.loanProduct || "General Loan"}</td>
                  <td>{customer.banking?.accountDetails?.Message.FullName}</td>
                  <td>
                    {customer.banking?.accountDetails?.Message.AccountNumber}
                  </td>
                  <td>{getDateOnly(customer.createdAt)}</td>
                  <td>N{customer.loanamount}</td>
                  <td style={styles.padding}>
                    {" "}
                    {capitalizeEachWord(customer.kyc.loanstatus)}
                  </td>
                  <td>
                    <div>
                      <BocButton
                        func={() => handleShow(customer._id)}
                        bradius="12px"
                        fontSize="12px"
                        width="80px"
                        margin="4px"
                        bgcolor="#ecaa00"
                      >
                        Details
                      </BocButton>
                    </div>
                  </td>
                </tr>
              );
            }
            )}
          </tbody>
        </Table>
      </div>
      <NextPreBtn />

      {/* show loan details model */}
      {show && (<LoanDetails show={show} handleClose={handleClose} loanObj={loanObj} />)}
    </>
  );
};

export default ActiveLoans;
