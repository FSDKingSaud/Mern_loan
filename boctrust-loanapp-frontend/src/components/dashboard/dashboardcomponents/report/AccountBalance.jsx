import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { handleCopy } from "../../../../../utilities/handleCopy";
import { toast } from "react-toastify";
import { handleExportToExcel } from "../../../../../utilities/handleExportToExcel";
import { handlePrint } from "../../../../../utilities/handlePrint";
import { handleExportToPDF } from "../../../../../utilities/handleExportToPDF";
import { useEffect, useRef, useState } from "react";
import apiClient from "../../../../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerAccounts } from "../../../../redux/reducers/accountReducer";
import { format } from "date-fns";
import PageLoader from "../../shared/PageLoader";
import TableStyles from "../tables/TableStyles.module.css";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  accountType: Yup.string().required("Account Type is required"),
  accountNumber: Yup.string().required("Account number is required"),
});

const initialValues = {
  accountType: "loan",
  accountNumber: "",
};

const AccountBalance = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem 0",
    },

    table: {
      marginLeft: "3rem",
      color: "#145098",
    },
    th: {
      color: "#145098",
      fontWeight: "bold",
      fontSize: "1.2rem",
    },
  };

  const user = useSelector((state) => state.adminAuth.user);
  const { customerAccounts } = useSelector((state) => state.accountReducer);
  
  const [accountBalance, setAccountBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);
  const printRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      if (!user?.banking?.accountDetails?.CustomerID) return;
      try {
        await dispatch(
          fetchCustomerAccounts(user?.banking?.accountDetails?.CustomerID)
        );
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [user]);

  const getBoctrustMfbAccBalance = async () => {
    if (!user) return;
    try {
      const { data } = await apiClient.post(`/bankone/accountEnquiry`, {
        accountNumber: user?.banking?.accountDetails?.AccountNumber,
      });

      setAccountBalance(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);

      await getBoctrustMfbAccBalance(values);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.accountCon} className="SecCon">
      <div>
        <DashboardHeadline>Account Balance Report</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={ref}
        >
          <Form>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="debitAccount">Account Number</label>
                <Field
                  as="select"
                  name="accountNumber"
                  className="Select"
                  style={styles.input}
                >
                  <option value="" label="Select one" />
                  {customerAccounts &&
                    customerAccounts
                      .filter((acc) => acc.accountType != "Loan")
                      .map((option) => (
                        <option
                          key={option.NUBAN}
                          value={option.NUBAN}
                          label={option.NUBAN}
                        />
                      ))}
                </Field>
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
      </div>
      <div style={styles.container}>
        <BocButton
          bgcolor="#636363"
          bradius="22px"
          width="90px"
          margin="0 8px"
          func={() => {
            if (accountBalance) {
              handleCopy(JSON.stringify(accountBalance), () => {
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
            if (accountBalance) {
              handleExportToExcel([accountBalance], "Account_Balance");
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
            if (accountBalance) {
              handleExportToPDF({
                filename: "Account_Balance_PDF",
                tableId: "accountBalanceTable",
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
            if (accountBalance) {
              handlePrint("Account Balance Print", printRef);
            }
          }}
        >
          Print
        </BocButton>
      </div>

      {/* balance table  */}
      <div ref={printRef}>
        <Table
          borderless
          hover
          responsive="sm"
          style={styles.table}
          className="DTable"
          id="accountBalanceTable"
        >
          <thead>
            <tr style={styles.th}>
              <th>Date</th>
              <th>Account Number</th>
              <th>Account Name</th>
              <th>Balance</th>
              <th>Current Balance</th>
            </tr>
          </thead>
          <tbody>
            {!accountBalance && isLoading ? (
              <tr className={TableStyles.row}>
                <td colSpan="7">
                  <PageLoader width="70px" />
                </td>
              </tr>
            ) : !accountBalance ? (
              <tr className={TableStyles.row}>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Nothing to Display
                </td>
              </tr>
            ) : (
              accountBalance && (
                <tr className={TableStyles.row}>
                  <td>{format(new Date(), "dd/LL/yyyy, hh:mm aaa")}</td>
                  <td>
                    <div className="d-flex">{accountBalance?.Nuban}</div>
                  </td>
                  <td>{accountBalance?.Name}</td>
                  <td>
                    {nigerianCurrencyFormat.format(
                      accountBalance.LedgerBalance / 100
                    )}
                  </td>
                  <td>
                    {nigerianCurrencyFormat.format(
                      accountBalance.AvailableBalance / 100
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AccountBalance;
