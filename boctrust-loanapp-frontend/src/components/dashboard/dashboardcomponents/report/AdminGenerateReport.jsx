import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";
import { handleExportToExcel } from "../../../../../utilities/handleExportToExcel";
import { handleExportToPDF } from "../../../../../utilities/handleExportToPDF";
import { handleCopy } from "../../../../../utilities/handleCopy";
import { handlePrint } from "../../../../../utilities/handlePrint";
import { Table } from "react-bootstrap";
import TableStyles from "../tables/TableStyles.module.css";
import { format } from "date-fns";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  accountNumber: Yup.string(),
  customerId: Yup.string(),
});

const today = new Date();
const oneMonthAgo = new Date();

oneMonthAgo.setMonth(today.getMonth() - 1);

const initialValues = {
  accountNumber: "",
  customerId: "",
};

const AdminGenerateReport = () => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "0.85rem",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem 0 0 0.9rem",
    },
    input: {
      width: "300px",
    },

    pending: {
      color: "#145098",
    },
    completed: {
      color: "#5cc51c",
    },
  };

  const [loansReport, setLoansReport] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const printRef = useRef();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await apiClient.get(
        `/loans/report/loans-and-account-balances?accountNumber=${values.accountNumber}&customerId=${values.customerId}`
      );
      setLoansReport(data);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="TransContainer SecCon">
        <DashboardHeadline>Account Statement</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="debitAccount">Customer ID</label>
                <Field
                  type="text"
                  name="customerId"
                  className="Input"
                  style={styles.input}
                />
                <ErrorMessage
                  className="error__msg"
                  name="customerId"
                  component="div"
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="debitAccount">Account Number</label>
                <Field
                  type="text"
                  name="accountNumber"
                  className="Input"
                  style={styles.input}
                />
                <ErrorMessage
                  className="error__msg"
                  name="accountNumber"
                  component="div"
                />
              </div>
            </div>
            <div className="BtnContainer">
              <BocButton
                fontSize="1.6rem"
                type="submit"
                width="220px"
                bgcolor="#ecaa00"
                bradius="25px"
              >
                FILTER
                {isLoading ? (
                  <PageLoader width="20px" strokeColor="#145088" />
                ) : null}
              </BocButton>
            </div>
          </Form>
        </Formik>
        <div style={styles.container}>
          <BocButton
            bgcolor="#636363"
            bradius="22px"
            width="90px"
            margin="0 8px"
            func={() => {
              if (loansReport) {
                handleCopy(JSON.stringify(loansReport), () => {
                  toast.success("Items Copied to Clipboard");
                });
              }
            }}
          >
            Copy
          </BocButton>
          <BocButton
            bgcolor="#636363"
            bradius="22px"
            width="90px"
            margin="0 8px"
            func={() => {
              if (loansReport) {
                handleExportToExcel(loansReport, "Account_Statement");
              }
            }}
          >
            Excel
          </BocButton>
          <BocButton
            bgcolor="#636363"
            bradius="22px"
            width="90px"
            margin="0 8px"
            func={() => {
              if (loansReport) {
                handleExportToPDF({
                  filename: "Account_Statement_PDF",
                  tableId: "accountStatementTable",
                });
              }
            }}
          >
            PDF
          </BocButton>
          <BocButton
            bgcolor="#636363"
            bradius="22px"
            width="90px"
            margin="0 8px"
            func={() => {
              if (loansReport) {
                handlePrint("Account Statement Print", printRef);
              }
            }}
          >
            Print
          </BocButton>
        </div>
      </div>

      <div className="SecCon" ref={printRef}>
        <DashboardHeadline
          height="46px"
          mspacer="2rem 0 -3.55rem 0"
          bgcolor="#145098"
        ></DashboardHeadline>
        <div style={styles.table}>
          <Table
            id="accountStatementTable"
            borderless
            hover
            responsive="sm"
            className="DTable"
          >
            <thead style={styles.head}>
              <tr>
                <th>Customer Id</th>
                <th>Loan Account No.</th>
                <th>Date Created</th>
                <th>Loan Product</th>
                <th>Amount</th>
                <th>Paid Amount</th>
                <th>Due Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!loansReport && isLoading ? (
                <tr className={TableStyles.row}>
                  <td colSpan="7">
                    <PageLoader width="70px" />
                  </td>
                </tr>
              ) : !loansReport || loansReport.length === 0 ? (
                <tr className={TableStyles.row}>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Nothing to Display
                  </td>
                </tr>
              ) : (
                loansReport &&
                loansReport.map((data, index) => {
                  return (
                    <tr key={index} className={TableStyles.row}>
                      <td>
                        {data?.customer.banking.accountDetails.CustomerID}
                      </td>
                      <td>{data?.loanAccountNumber}</td>

                      <td>
                        {data?.createdAt
                          ? format(data?.createdAt, "dd/LL/yyyy, hh:mm aaa")
                          : ""}
                      </td>
                      <td className="">{data.loanproduct.ProductName}</td>
                      <td className="">
                        {nigerianCurrencyFormat.format(data.loanamount)}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(
                          data.accountBalance.PrincipalDueButUnpaid +
                            data.accountBalance.InterestDueButUnpaid +
                            data.accountBalance.LoanFeeDueButUnPaid +
                            data.accountBalance.PenaltyDueButUnpaid
                        )}
                      </td>
                      <td>
                        {nigerianCurrencyFormat.format(
                          data.accountBalance.TotalAmountPaidTillDate
                        )}
                      </td>
                      <td className="booking_status">
                        {data.TotalAmountPaidTillDate == data.loanamount ? (
                          <span className="badge_success">Completed</span>
                        ) : (
                          <span className="badge_pending">Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminGenerateReport;
