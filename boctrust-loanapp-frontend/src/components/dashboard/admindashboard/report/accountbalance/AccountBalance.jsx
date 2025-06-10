import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import BocButton from "../../../shared/BocButton";
import DashboardHeadline from "../../../shared/DashboardHeadline";
// import "../../customers/Customer.css";
import "../Report.css";
import AccountBalanceList from "./AccountBalanceList";
import NextPreBtn from "../../../shared/NextPreBtn";
import PageLoader from "../../../shared/PageLoader";
import apiClient from "../../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date isRequired"),
  endDate: Yup.string().required("End date is required"),
  customerId: Yup.string().required("Customer account is required"),
});

const initialValues = {
  customerId: "",
  startDate: "",
  endDate: "",
};

const AccountBalance = () => {
  
  const [accountBalance, setAccountBalance] = useState([]);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (values) => {
    // Handle form submission logic here
    setProcessing(true);
    try {
      const { data: loanBalanceData } = await apiClient.get(
        `/bankone/balanceEnquiry/${values.customerId}`
      );

      if (loanBalanceData) {
        setAccountBalance(loanBalanceData);
        setProcessing(false);
      }
    } catch (error) {
      setProcessing(false);
      throw new Error(error);
    }
  };

  return (
    <div>
      <div className="TransContainer">
        <DashboardHeadline>Generate Customer Balance Report</DashboardHeadline>
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
            <div className="BtnRow">
              <div className="BtnContainer">
                {processing ? (
                  <PageLoader />
                ) : (
                  <BocButton
                    margin="0"
                    fontSize="1.6rem"
                    type="submit"
                    bgcolor="#ecaa00"
                    bradius="18px"
                  >
                    Submit
                  </BocButton>
                )}
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
        <AccountBalanceList accountBalance={accountBalance} />

        {/* next prev btn  */}
        <NextPreBtn />
      </div>
    </div>
  );
};

export default AccountBalance;
