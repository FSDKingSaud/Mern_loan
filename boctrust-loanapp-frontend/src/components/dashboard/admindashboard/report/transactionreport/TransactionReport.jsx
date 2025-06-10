import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BocButton from "../../../shared/BocButton";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import "../Report.css";
import NextPreBtn from "../../../shared/NextPreBtn";
import TransactionReportList from "./TransactionReportList";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date isRequired"),
  endDate: Yup.string().required("End date is required"),
  customerId: Yup.string().required("Account number is required"),
  loanType: Yup.string().required("Loan type is required"),
  loanStatus: Yup.string().required("Select loan status"),
});

const initialValues = {
  customerId: "",
  startDate: "",
  endDate: "",
  loanType: "",
  loanStatus: "",
};

const TransactionReport = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  const loanTypes = [
    { label: "business loan", value: "Business Loan" },
    { label: "salary advance", value: "Salary Advance" },
    { label: "sme loan", value: "SME Loan" },
    { label: "car loan", value: "car Loan" },
    { label: "travel loan", value: "Travel Loan" },
  ];

  const loanStatus = [
    { label: "with md", value: "With COO" },
    { label: "completed", value: "Completed" },
    { label: "booked", value: "Booked" },
    { label: "with credit", value: "With Credit" },
    { label: "completed", value: "Completed" },
  ];

  return (
    <div>
      <div className="TransContainer">
        <DashboardHeadline>Generate New Transaction Report</DashboardHeadline>
        {/* form section */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="startDate">Start Date</label>
                <Field
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="InputElem"
                />
                <ErrorMessage name="startDate" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="endDate">End Date</label>
                <Field
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="InputElem"
                />
                <ErrorMessage name="endDate" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="customerId">Customer ID</label>
                <Field
                  type="text"
                  name="customerId"
                  id="customerId"
                  className="InputElem"
                />
                <ErrorMessage name="customerId" component="div" />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="loanType">Loan Type</label>
                <Field
                  as="select"
                  name="loanType"
                  id="loanType"
                  className="Select"
                >
                  <option value="" label="Select Loan Type" />
                  {loanTypes.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Field>
                <ErrorMessage name="loanType" component="div" />
              </div>
              <div className="FieldGroup">
                <label htmlFor="loanStatus">Loan Status</label>
                <Field
                  as="select"
                  name="loanStatus"
                  id="loanStatus"
                  className="Select"
                >
                  <option value="" label="Select Loan Status" />
                  {loanStatus.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      label={option.label}
                    />
                  ))}
                </Field>
                <ErrorMessage name="loanStatus" component="div" />
              </div>
            </div>

            <div className="BtnRow">
              <div className="BtnContainer">
                <BocButton
                  margin="0"
                  fontSize="1.6rem"
                  type="submit"
                  bgcolor="#ecaa00"
                  bradius="18px"
                >
                  Submit
                </BocButton>
              </div>
            </div>
          </Form>
        </Formik>
        {/* format section btn */}
        <div className="FormatBtn">
          <p>Output As:</p>
          <div>
            <BocButton bgcolor="gray">Copy</BocButton>
            <BocButton bgcolor="green">Excel</BocButton>
            <BocButton bgcolor="#145098">PDF</BocButton>
            <BocButton>Print</BocButton>
          </div>
        </div>
      </div>
      <div className="ReportCon">
        {/* report table  */}
        <TransactionReportList />

        {/* next prev btn  */}
        <NextPreBtn />
      </div>
    </div>
  );
};

export default TransactionReport;
