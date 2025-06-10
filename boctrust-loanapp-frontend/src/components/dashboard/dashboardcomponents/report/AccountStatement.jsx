import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerAccounts } from "../../../../redux/reducers/accountReducer";
import { toast } from "react-toastify";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";
import { handleExportToExcel } from "../../../../../utilities/handleExportToExcel";
import { handleExportToPDF } from "../../../../../utilities/handleExportToPDF";
import { handleCopy } from "../../../../../utilities/handleCopy";
import { handlePrint } from "../../../../../utilities/handlePrint";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  accountNumber: Yup.string().required("Account number is required"),
});

const today = new Date();
const oneMonthAgo = new Date();

oneMonthAgo.setMonth(today.getMonth() - 1);

const initialValues = {
  startDate: oneMonthAgo,
  endDate: today,
  accountNumber: "",
};

const AccountStatement = ({
  isLoading,
  setLoading,
  setAccountStatement,
  accountStatement,
  printRef,
}) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem 0 0 0.9rem",
    },
    input: {
      width: "300px",
    },
  };

  const user = useSelector((state) => state.adminAuth.user);
  const { customerAccounts } = useSelector((state) => state.accountReducer);

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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const { data } = await apiClient.get(
        `/bankone/loanAccountStatement?accountNumber=${values.accountNumber}&fromDate=${values.startDate}&toDate=${values.endDate}`
      );
      setAccountStatement(data);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <label htmlFor="createAccount">Start Date</label>
                <Field
                  type="date"
                  name="startDate"
                  className="Input"
                  style={styles.input}
                />
                <ErrorMessage
                  className="error__msg"
                  name="startDate"
                  component="div"
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="createAccount">End Date</label>
                <Field
                  type="date"
                  name="endDate"
                  className="Input"
                  style={styles.input}
                />
                <ErrorMessage
                  className="error__msg"
                  name="endDate"
                  component="div"
                />
              </div>
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
                      .filter((acc) => acc.accountType == "Loan")
                      .map((option) => (
                        <option
                          key={option.accountNumber}
                          value={option.accountNumber}
                          label={option.accountNumber}
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
        <div style={styles.container}>
          <BocButton
            bgcolor="#636363"
            bradius="22px"
            width="90px"
            margin="0 8px"
            func={() => {
              if (accountStatement) {
                handleCopy(JSON.stringify(accountStatement), () => {
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
              if (accountStatement) {
                handleExportToExcel(accountStatement, "Account_Statement");
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
              if (accountStatement) {
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
              if (accountStatement) {
                handlePrint("Account Statement Print", printRef);
              }
            }}
          >
            Print
          </BocButton>
        </div>
      </div>
    </>
  );
};

export default AccountStatement;
