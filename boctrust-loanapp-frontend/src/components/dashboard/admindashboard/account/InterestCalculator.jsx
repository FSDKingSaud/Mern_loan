import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  accountType: Yup.string().required("Account type is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  purpose: Yup.string().required("Loan purpose is required"),
});

const loanProductOptions = [
  { value: "car loan", label: "Car Loan" },
  { value: "salary advance", label: "Salary Advance" },
  // Add more options as needed
];

const initialValues = {
  loanProduct: "",
  duration: "",
  amount: "",
  purpose: "",
};

const InterestCalculator = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  return (
    <div className="TransContainer">
      <DashboardHeadline>Loan Calcualator</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="loanProduct">Loan Product</label>
              <Field
                as="select"
                name="loanProduct"
                id="loanProduct"
                className="Select"
              >
                <option value="" label="Select a product" />
                {loanProductOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </Field>
              <ErrorMessage name="loanProduct" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="duration">Number of Months</label>
              <Field
                type="number"
                name="duration"
                id="duration"
                className="Input"
                min="1"
              />
              <ErrorMessage name="duration" component="div" />
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="amount">Amount</label>
              <Field type="text" name="amount" id="amount" className="Input" />
              <ErrorMessage name="amount" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="purpose">Purpose</label>
              <Field
                type="text"
                name="purpose"
                id="purpose"
                className="Input"
              />
              <ErrorMessage name="purpose" component="div" />
            </div>
          </div>
          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              width="35%"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Calculate
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default InterestCalculator;
