import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
// import ReCAPTCHA from "react-google-recaptcha";
import ConfirmField from "./ConfirmField";
import Headline from "../../shared/Headline";
import PhoneOtp from "./PhoneOtp";
import "./Form.css";
import axios from "axios";
import { toast } from "react-toastify";
import { IoIosArrowBack } from "react-icons/io";

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const CreateAccount = ({
  handleSubmit,
  phoneNumber,
  customerEmail,
  customerName,
  setShowLoanForm,
}) => {
  const { values, setFieldValue } = useFormikContext();
  const { password, confirmpassword } = values;
  const [isValid, setIsValid] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const handleInputChange = (fieldName, event) => {
    // Update the field value as the user types
    setFieldValue(fieldName, event.target.value);
  };

  useEffect(() => {
    if (password && passwordRegex.test(password)) {
      if (confirmpassword && password === confirmpassword) {
        setIsValid(true);
        setPasswordError("");
        setErrorMsg("");
      } else {
        setIsValid(false);
        setErrorMsg("Passwords do not match");
      }
    } else {
      setIsValid(false);
      setPasswordError(
        "Password must be at least 8 characters with at least 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character"
      );
    }
  }, [password, confirmpassword]);

  const handleCreateAccount = async () => {
    try {
      //  Check if Email is Valid
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/customer/checkValidEmail`,
        {
          email: values.email,
          username: values.username,
        }
      );

      setModalShow(true);
    } catch (error) {
      toast.error("Email Or Username Already Exist");
    }
  };

  return (
    <>
      <div className="SignUpContainer">
        <div className=" SignUpInner">
          <div>
            <button
              onClick={() => setShowLoanForm(true)}
              type="button"
              className="btn btn-light"
            >
              <IoIosArrowBack />
            </button>
            <Headline color="#000" text="Create Login / User Details" />
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <ConfirmField
                placeholderText="Email"
                fieldName="email"
                type="text"
                values={values}
                func={handleInputChange}
              />
              <ConfirmField
                placeholderText="Username"
                fieldName="username"
                type="text"
                values={values}
                func={handleInputChange}
              />
              <ConfirmField
                placeholderText="Password"
                fieldName="password"
                type="password"
                values={values}
                func={handleInputChange}
              />
              <ConfirmField
                placeholderText="Confirm Password"
                fieldName="confirmpassword"
                type="password"
                values={values}
                func={handleInputChange}
              />
            </div>
            <div className="col-sm-12 col-md-4 RecaptchaBox">
              {/* <div className="RecaptchaBadge ">
                <ReCAPTCHA
                  sitekey={key}
                  onChange={handleRecaptcha}
                  // ref={captchaRef}
                />
              </div> */}

              <div className="ProceedBtn mt-6">
                {!isValid ? (
                  <button type="button" className="BtnNoAction">
                    Create Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleCreateAccount()}
                    className="BtnAction BtnSecondary BtnCreate"
                  >
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </div>
          <p className="Error">{errorMsg}</p>
          <p className="Error">{passwordError}</p>
        </div>
      </div>
      <PhoneOtp
        show={modalShow}
        onHide={() => setModalShow(false)}
        phonenumber={phoneNumber}
        customerEmail={customerEmail}
        customerName={customerName}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

CreateAccount.propTypes = {
  handleSubmit: PropTypes.func,
  setShowLoanForm: PropTypes.func,
  phoneNumber: PropTypes.string,
  customerEmail: PropTypes.string,
  customerName: PropTypes.string,
};

export default CreateAccount;
