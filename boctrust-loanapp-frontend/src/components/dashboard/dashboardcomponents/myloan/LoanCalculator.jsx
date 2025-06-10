import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../../redux/reducers/productReducer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import interestRate from "../../../shared/calculatorfunc";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  loanProduct: Yup.string().required("Loan product is required"),
  duration: Yup.number().min(1).required("Loan duration is required"),
  amount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  purpose: Yup.string().required("Loan purpose is required"),
});

const initialValues = {
  loanProduct: "",
  duration: "",
  amount: "",
  purpose: "",
};

const LoanCalculator = () => {
  const [loanRepayment, setLoanRepayment] = useState("");

  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  const loanProducts = useSelector(
    (state) => state.productReducer.products.products
  );
  const handleSubmit = (values) => {
    // find loan product
    const loanProduct = loanProducts.find(
      (product) => product._id === values.loanProduct
    );

    // calculate loan repayment
    const rate = loanProduct.interestRate;
    const amount = parseInt(values.amount);
    const duration = parseInt(values.duration) * 30;
    const repayInterest = interestRate(amount, duration, rate);

    const totalRepayment = amount + repayInterest;

    setLoanRepayment(`Total repayment: ${totalRepayment}`);
  };

  return (
    <div className="TransContainer SecCon ">
      <DashboardHeadline>Loan Calcualator</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="">
          <div className="FieldRow">
            <div className="FieldGroup" style={{ marginBottom: "18px" }}>
              <label htmlFor="loanProduct">Loan Product</label>
              <Field
                as="select"
                name="loanProduct"
                id="loanProduct"
                className="Select"
              >
                <option value="" label="Select a product" />
                {loanProducts?.map((option) => (
                  <option
                    key={option._id}
                    value={option._id}
                    label={option.productName}
                  />
                ))}
              </Field>
              <ErrorMessage className="error__msg" name="loanProduct" component="div" />
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

          {/* calculation result */}
          {loanRepayment && (
            <div
              style={{ color: "orange", textAlign: "center", fontSize: "28px" }}
            >
              {loanRepayment}
            </div>
          )}

          <div className="BtnContainer">
            <BocButton
              fontSize="1.6rem"
              type="submit"
              width="220px"
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

export default LoanCalculator;
