import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerAccounts } from "../../../../redux/reducers/accountReducer";
import { useEffect } from "react";
import PageLoader from "../../shared/PageLoader";
import { handleCopy } from "../../../../../utilities/handleCopy";
import { toast } from "react-toastify";
import { handleExportToExcel } from "../../../../../utilities/handleExportToExcel";
import { handleExportToPDF } from "../../../../../utilities/handleExportToPDF";
import { handlePrint } from "../../../../../utilities/handlePrint";
import { fetchUserTransactions } from "../../../../redux/reducers/transactionReducer";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  accountNumber: Yup.string().required("Account number is required"),
});

const initialValues = {
  startDate: "",
  endDate: "",
  accountNumber: "",
};

const TransactionReportTop = ({ isLoading, setLoading, printRef }) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem 0",
    },
    input: {
      width: "300px",
    },
  };

  const { userTransactions } = useSelector((state) => state.transactionReducer);

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
    if (!user) return;
    try {
      setLoading(true);

      await dispatch(
        fetchUserTransactions({
          accountNumber: values.accountNumber,
          fromDate: values.startDate,
          toDate: values.endDate,
        })
      );

    
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="TransContainer">
        <DashboardHeadline>Transaction Report</DashboardHeadline>
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
                disable={isLoading}
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
          func={() => {
            if (userTransactions) {
              handleCopy(JSON.stringify(userTransactions), () => {
                toast.success("Items Copied to Clipboard");
              });
            }
          }}
          bgcolor="#636363"
          bradius="22px"
          width="90px"
          margin="0 8px"
        >
          Copy
        </BocButton>
        <BocButton
          func={() => {
            if (userTransactions) {
              handleExportToExcel(userTransactions, "Transaction_Report");
            }
          }}
          bgcolor="#636363"
          bradius="22px"
          width="90px"
          margin="0 8px"
        >
          Excel
        </BocButton>
        <BocButton
          func={() => {
            if (userTransactions) {
              handleExportToPDF({
                filename: "Transaction_Report_PDF",
                tableId: "transactionReportTable",
              });
            }
          }}
          bgcolor="#636363"
          bradius="22px"
          width="90px"
          margin="0 8px"
        >
          PDF
        </BocButton>
        <BocButton
          func={() => {
            if (userTransactions) {
              handlePrint("Transaction Report Print", printRef);
            }
          }}
          bgcolor="#636363"
          bradius="22px"
          width="90px"
          margin="0 8px"
        >
          Print
        </BocButton>
      </div>
    </>
  );
};

export default TransactionReportTop;
