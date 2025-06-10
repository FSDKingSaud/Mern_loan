import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSelectedProduct } from "../../../../redux/reducers/productReducer";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import interestRate, {
  calculateSimpleInterest,
} from "../../../shared/calculatorfunc";
import apiClient from "../../../../lib/axios";
import EmailTemplate from "../../../shared/EmailTemplate";
import sendEmail from "../../../../../utilities/sendEmail";
import { toast } from "react-toastify";
import sendSMS from "../../../../../utilities/sendSms";
import PageLoader from "../../shared/PageLoader";
import { calcDaysDiffFromNow } from "../../../../../utilities/calcDaysDiff";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  loanproduct: Yup.string().required("Loan product is required"),
  numberofmonth: Yup.string().required("Loan Duration is required"),
  loanamount: Yup.number()
    .typeError("Amount must be a number")
    .required("Amount is required"),
  loanpurpose: Yup.string(),
});

const initialValues = {
  loanproduct: "",
  interestRate: "",
  numberofmonth: "",
  loanamount: "",
  monthlyrepayment: "",
  loantotalrepayment: "",
  loanpurpose: "",
};

const ApplyLoan = () => {
  const [message, setMessage] = useState("");
  const [choosenProduct, setChoosenProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef();

  // fetch loan product
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSelectedProduct());
  }, [dispatch]);

  const calculateRepayment = () => {
    if (
      ref.current?.values.loanproduct &&
      ref.current?.values.interestRate &&
      ref.current?.values.numberofmonth &&
      ref.current?.values.loanamount
    ) {
      // const loanRate = choosenProduct?.interestRate;

      const { totalPayment, monthlyPayment } = calculateSimpleInterest(
        Number(ref.current?.values.loanamount),
        Number(ref.current?.values.interestRate),
        Number(ref.current?.values.numberofmonth)
      );

      ref.current?.setFieldValue("monthlyrepayment", monthlyPayment);
      ref.current?.setFieldValue("loantotalrepayment", totalPayment);
    }
  };

  useEffect(() => {
    calculateRepayment();
  }, [choosenProduct]);

  const loanProducts = useSelector((state) => state.productReducer.products);

  // get current login user
  const user = useSelector((state) => state.adminAuth.user);
  const isAccountCreated = user?.banking.isAccountCreated;

  // update message
  const updateMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // send email notification
  const handleSendEmail = async () => {
    try {
      const emailTemplateHtml = ReactDOMServer.renderToString(
        <EmailTemplate
          firstName={customerName}
          content="Your loan application has been received. We will get back to you shortly."
        />
      );
      const options = {
        email: user.email,
        subject: "Loan Application Notification",
        html: emailTemplateHtml,
      };
      sendEmail(options);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle loan submission
  const handleSubmit = async (values, { resetForm }) => {
    if (!isAccountCreated) {
      updateMessage(
        "Your account is being processed. You would be contacted when it is activated"
      );
      return;
    }

    const deductions =
      calcDaysDiffFromNow(user.employmentstartdate) <
        Number(user?.employer?.mandateRule?.mandateDuration.split(" ")[0]) &&
      user?.employer?.mandateRule?.allowStacking == "yes"
        ? "remita"
        : calcDaysDiffFromNow(user?.employmentstartdate) >=
            Number(
              user?.employer?.mandateRule?.mandateDuration.split(" ")[0]
            ) && careertype.toLowerCase() === "government employee"
        ? "ippis"
        : "";

    const loanApplication = {
      loanproduct: values.loanproduct,
      monthlyrepayment: values.monthlyrepayment,
      numberofmonth: values.numberofmonth,
      loanamount: values.loanamount,
      loanpurpose: values.loanpurpose,
      loantotalrepayment: values.loantotalrepayment,
      deductions: deductions,
    };

    // send the object to the backend
    try {
      setIsLoading(true);
      const { data } = await apiClient.post(`/loans`, loanApplication);
      const phone = "234" + user.phonenumber.slice(1);

      handleSendEmail();
      await sendSMS(
        phone,
        "Your loan application has been received. We will get back to you shortly."
      );

      // reset form
      resetForm();

      updateMessage("Loan application submitted successfully");
      toast.success("Loan application submitted successfully");

      return data;
    } catch (error) {
      updateMessage("An error occurred. Please try again");
      toast.error(error?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="apply__forLoan ">
      <div className="TransContainer SecCon">
        <DashboardHeadline>Apply for New Loan</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          innerRef={ref}
        >
          <Form className="appForm">
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="loanproduct">Loan Product</label>

                <Field name="loanproduct" id="loanproduct">
                  {({ field, form }) => (
                    <select
                      {...field}
                      onChange={(event) => {
                        field.onChange(event);

                        const found = loanProducts.find(
                          (product) => product?._id == event.target.value
                        );

                        setChoosenProduct(found);
                      }}
                      onBlur={(event) => {
                        field.onBlur(event);

                        if (choosenProduct) {
                          form.setFieldValue(
                            "interestRate",
                            choosenProduct?.interestRate
                          );
                        }
                      }}
                      id="loanproduct"
                      className="Select"
                    >
                      <option value="" label="Select a product" />
                      {/* <option>Select Product</option> */}
                      {loanProducts?.map((product) => (
                        <option key={product?.productCode} value={product?._id}>
                          {product.productTitle}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                <ErrorMessage
                  name="loanproduct"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="interestRate">Interest Rate</label>
                <Field
                  type="text"
                  name="interestRate"
                  id="interestRate"
                  className="Input"
                  disabled
                />

                <ErrorMessage
                  name="interestRate"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="loanamount">Loan Amount</label>

                <Field name="loanamount" id="loanamount">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="loanamount"
                      id="loanamount"
                      className="Input"
                      onBlur={(e) => {
                        field.onBlur(e);
                        calculateRepayment();
                      }}
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="loanamount"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="numberofmonth">Number of months</label>

                <Field name="numberofmonth" id="numberofmonth">
                  {({ field }) => (
                    <input
                      {...field}
                      type="text"
                      name="numberofmonth"
                      id="numberofmonth"
                      className="Input"
                      onBlur={(e) => {
                        field.onBlur(e);
                        calculateRepayment();
                      }}
                    />
                  )}
                </Field>

                <ErrorMessage
                  name="numberofmonth"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="numberofmonth">Loan Purpose</label>

                <Field
                  type="text"
                  name="loanpurpose"
                  id="loanpurpose"
                  className="Input"
                />
                <ErrorMessage
                  name="loanpurpose"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>
            <div className="FieldRow autoFill">
              <div className="FieldGroup">
                <label htmlFor="monthlyrepayment">Monthly Repayment</label>
                <Field
                  type="text"
                  name="monthlyrepayment"
                  id="monthlyrepayment"
                  className="Input"
                  disabled
                />
                <ErrorMessage
                  name="monthlyrepayment"
                  className="error__msg"
                  component="div"
                />
              </div>

              <div className="FieldGroup">
                <label htmlFor="loantotalrepayment">Loan Total Repayment</label>
                <Field
                  type="text"
                  name="loantotalrepayment"
                  id="loantotalrepayment"
                  className="Input"
                  disabled
                />
                <ErrorMessage
                  name="loantotalrepayment"
                  className="error__msg"
                  component="div"
                />
              </div>
            </div>

            {message && (
              <div style={{ color: "orange", textAlign: "center" }}>
                {message}
              </div>
            )}
            <div className="BtnContainer">
              <BocButton
                fontSize="1.6rem"
                type="submit"
                bgcolor="#ecaa00"
                bradius="18px"
                disable={isLoading}
              >
                Submit Application
                {isLoading ? (
                  <PageLoader width="20px" strokeColor="#145088" />
                ) : null}
              </BocButton>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default ApplyLoan;
