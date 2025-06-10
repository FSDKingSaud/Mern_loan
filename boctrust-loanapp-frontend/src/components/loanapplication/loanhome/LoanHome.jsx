import { useState, useEffect } from "react";
import axios from "axios"; // Ensure axios is imported
import { Formik } from "formik";
import * as Yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
import Button from "react-bootstrap/Button";
import "../Loan.css";
import Header from "../../shared/Header";
import Headline from "../../shared/Headline";
import LoanStep from "./LoanStep";
import BocTrustMsg from "./BocTrustMsg";
import Testimonial from "./Testimonial";
import EmailSection from "./EmailSection";
import LoanFirstStep from "../loanform/LoanFirstStep";

const LoanHome = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [startObject, setStartObject] = useState({});
  const [minLoanAmount, setMinLoanAmount] = useState("");
  const [minLoanAmountMessage, setMinLoanAmountMessage] = useState("");

  const apiUrl = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    AOS.init({ duration: 2000 });

    const fetchMinLoanAmount = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/settings/settings`);
        if (response.data?.settings?.minimumLoanAmount) {
          setMinLoanAmount(Number(response.data.settings.minimumLoanAmount));
          setMinLoanAmountMessage(
            `Minimum Loan Amount: ${Number(
              response.data.settings.minimumLoanAmount
            ).toLocaleString()}`
          );
        }
      } catch (error) {
        console.error("Error fetching Minimum Loan Amount:", error);
        setMinLoanAmountMessage("Unable to fetch minimum loan amount.");
      }
    };

    fetchMinLoanAmount();
  }, []);

  // Handle Email Apply Button
  const handleApplyBtn = () => {
    setIsOpened(true);
    setStartObject({});
  };

  return (
    <>
      {isOpened ? (
        <LoanFirstStep data={startObject} />
      ) : (
        <div className="LoanHome">
          <Header imgurl="/images/boctrustformheader.jpg" />
          <div className="TopSection">
            <div className="TopText">
              <Headline
                align="left"
                color="#fff"
                fontSize="2.5rem"
                text="Quick & easy loans for anyone"
              />
              <p>
                Take care of your personal needs or grow your small business
                with our quick loans
              </p>
            </div>
            <div>
              <Formik
                initialValues={{
                  loanamount: "",
                  careertype: "",
                }}
                validationSchema={Yup.object({
                  loanamount: Yup.string()
                    .required("Required")
                    .test(
                      "is-valid-number",
                      "Loan amount must be a valid number",
                      (value) => !isNaN(Number(value?.replace(/,/g, ""))) // Remove commas and check if it's a valid number
                    )
                    .test(
                      "min-loan-amount",
                      `Loan amount must be at least ${Number(minLoanAmount).toLocaleString()}`,
                      (value) => {
                        const numericValue = Number(value?.replace(/,/g, ""));
                        return numericValue >= minLoanAmount;
                      }
                    ),
                  careertype: Yup.string().required("Required"),
                })}
                onSubmit={(values, { setSubmitting }) => {
                  setStartObject(values);
                  setSubmitting(false);
                  setIsOpened(true);
                }}
              >
                {(formik) => (
                  <form onSubmit={formik.handleSubmit} className="HeroCard">
                    <Headline
                      fontSize="1.5rem"
                      spacer="0"
                      text="How much do you need?"
                    />
                    <p>{minLoanAmountMessage}</p>
                    <input
                      className="Field"
                      id="loanamount"
                      type="text"
                      value={
                        formik.values.loanamount
                          ? `₦${Number(formik.values.loanamount).toLocaleString()}`
                          : ""
                      } // Add ₦ and format the number for display
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/₦|,/g, ""); // Remove ₦ and commas
                        if (!isNaN(rawValue) && rawValue !== "") {
                          formik.setFieldValue("loanamount", rawValue); // Store only numeric value
                        } else if (rawValue === "") {
                          formik.setFieldValue("loanamount", ""); // Allow clearing the field
                        }
                      }}
                      onBlur={(e) => {
                        const rawValue = e.target.value.replace(/₦|,/g, ""); // Remove ₦ and commas
                        if (!isNaN(rawValue) && rawValue !== "") {
                          formik.setFieldValue("loanamount", rawValue); // Ensure raw value is stored
                        }
                      }}
                    />
                    {formik.touched.loanamount && formik.errors.loanamount ? (
                      <p className="ErrorMsg">{formik.errors.loanamount}</p>
                    ) : null}

                    <Headline
                      fontSize="1.5rem"
                      spacer="18px 0"
                      text=" Business Owner or Employee?"
                    />
                    <select
                      className="Field"
                      id="careertype"
                      {...formik.getFieldProps("careertype")}
                    >
                      <option value="default">Select one</option>
                      <option value="government employee">
                        Government Employee
                      </option>
                      <option value="private employee">Private Employee</option>
                      <option value="business owner">Business Owner</option>
                    </select>
                    {formik.touched.careertype && formik.errors.careertype ? (
                      <p className="ErrorMsg">{formik.errors.careertype}</p>
                    ) : null}

                    <Button
                      className="ActionBtn"
                      variant="primary"
                      size="lg"
                      type="submit"
                      disabled={
                        !formik.values.loanamount || // Loan amount is missing
                        Number(formik.values.loanamount.replace(/,/g, "")) < minLoanAmount || // Loan amount is below minimum
                        !formik.values.careertype || // Profession is missing
                        formik.values.careertype === "default" // Default option is selected
                      }
                    >
                      Apply Now
                    </Button>
                  </form>
                )}
              </Formik>
            </div>
          </div>

          {/* Loan Step Section */}
          <div data-aos="fade-up">
            <LoanStep />
          </div>

          {/* BocTrust About Section */}
          <div data-aos="fade-up">
            <BocTrustMsg />
          </div>

          {/* Testimonial Section */}
          <div data-aos="fade-up">
            <Testimonial />
          </div>

          {/* Email List Section */}
          <div data-aos="fade-up">
            <EmailSection handleBtn={handleApplyBtn} />
          </div>
        </div>
      )}
    </>
  );
};

export default LoanHome;
