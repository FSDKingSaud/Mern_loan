import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  withdrawAccountNumber: Yup.string().required("Account number is required"),
  withdrawBankName: Yup.string().required("Bank name is required"),
  withdrawAmount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
});

const debitAccountOptions = [
  { value: "gtb", label: "GTB" },
  { value: "access", label: "Access" },
  // Add more options as needed
];

const initialValues = {
  withdrawAccountNumber: "",
  withdrawBankName: "",
  withdrawAmount: "",
};

const WithdrawMoney = () => {
  const handleSubmit = (values) => {
    // Handle form submission logic here
    console.log(values);
  };

  return (
    <div className="TransContainer">
      <DashboardHeadline>Withdraw to Bank Account</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="withdrawAccountNumber">Account Number</label>
              <Field
                type="text"
                name="withdrawAccountNumber"
                className="Input"
              />
              <ErrorMessage name="withdrawAccountNumber" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="withdrawBankName">Bank Name</label>
              <Field as="select" name="withdrawBankName" className="Select">
                <option value="" label="Select Bank name" />
                {debitAccountOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </Field>
              <ErrorMessage name="withdrawBankName" component="div" />
            </div>
          </div>
          <div className="SingleRow">
            <div className="FieldGroup">
              <label htmlFor="withdrawAmount">Amount</label>
              <Field type="text" name="withdrawAmount" className="Input" />
              <ErrorMessage name="withdrawAmount" component="div" />
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
              WITHDRAW MONEY
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default WithdrawMoney;
