import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../redux/reducers/adminAuthReducer";
import { Modal, Form, Button } from "react-bootstrap";
// import { login } from "../../../redux/reducers/userSlice";
import loginUserOnServer from "./loginUserOnServer";
import loginCustomerOnServer from "./loginCustomerOnServer";
import forgotPassword from "./forgotPassword";
import forgotPassCustomer from "./forgotPassCustomer";
import HeadLine from "../../shared/Headline";
import "./Login.css";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import PageLoader from "../shared/PageLoader";
import OtpModal from "../admindashboard/otpModal/OtpModal";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    loginAs: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [revealPassword, setRevealPassword] = useState(false);

  //   modal
  const [showOTP, setShowOTP] = useState(false);

  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [show, setShow] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const handleClose = () => setShow(false);
  const handleForgotPassword = () => setShow(true);

  // check if user is logged in and redirect to dashboard
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.adminAuth.user);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/staff-login") {
      setFormData({
        ...formData,
        loginAs: "staff",
      });
    } else {
      setFormData({
        ...formData,
        loginAs: "customer",
      });
    }
  }, [location]);

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  // handle forgot password submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const { loginAs } = formData;

    if (loginAs === "staff") {
      const response = await forgotPassword(forgotUsername, forgotEmail);
      if (response.success) {
        // clear fields
        setForgotUsername("");
        setForgotEmail("");

        // close modal
        setShow(false);
        setShowEmailSent(true);
      }
    } else if (loginAs === "customer") {
      const response = await forgotPassCustomer(forgotUsername, forgotEmail);
      if (response.success) {
        // clear fields
        setForgotUsername("");
        setForgotEmail("");

        // close modal
        setShow(false);
        setShowEmailSent(true);
      }
    }

    // clear fields
    setForgotUsername("");
    setForgotEmail("");

    // close modal
    setShow(false);
    setShowEmailSent(true);

    // setShowEmailSent to false after 5 seconds
    setTimeout(() => {
      setShowEmailSent(false);
    }, 5000);
  };

  //   handle on change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //   clear fields
  const clearField = () => {
    setFormData({
      username: "",
      password: "",
      loginAs: "",
    });
  };

  // handle form submit
  const handleSubmit = async (e) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const { username, password, loginAs } = formData;

      if (loginAs === "staff") {
        const response = await loginUserOnServer(username, password);

        if (response.success) {
          toast.success(response.success);
          setShowOTP(true);
        } else {
          // Handle login failure.
          setErrorMessage("Invalid username or password");
        }
      } else if (loginAs === "customer") {
        const response = await loginCustomerOnServer(username, password);
        if (response.success) {
          clearField();
          // Dispatch the login action with the user data.
          dispatch(loginUser(response));
          // setLogin(true);
        } else {
          // Handle login failure.
          setErrorMessage("Invalid username/password or account not activated");
        }
      }
    } catch (error) {
      toast.error("Cannot Login");
    } finally {
      setIsLoading(false);
    }
  };

  const otpVerificationSucc = async (response) => {
    // clear fields
    clearField();

    // Dispatch the login action with the user data.
    dispatch(loginUser(response));
  };

  return (
    <div className="LogContainer">
      <div>
        <HeadLine
          text={`Welcome Back ${
            formData.loginAs === "staff" ? "Staff" : "Customer"
          }!`}
        />
        <p>Please Enter your details to Login</p>
        <p className="Error">{errorMessage}</p>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-4">
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 password-group ">
            <Form.Control
              type={revealPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setRevealPassword(!revealPassword)}
              className="reveal-btn "
            >
              {revealPassword ? (
                <IoEyeOffOutline size={18} />
              ) : (
                <IoEyeOutline size={18} />
              )}
            </button>
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <p className="asText">Login as:</p>
            <div className="asBox">
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="customer"
                  onChange={handleChange}
                />
                <label className="Remember">Customer </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="staff"
                  onChange={handleChange}
                />
                <label className="Remember">Staff </label>
              </div>
            </div>
          </Form.Group> */}

          <Button disabled={isLoading} type="submit" className="LoginBtn">
            Login {isLoading && <PageLoader width="20" strokeColor="#ecaa00" />}
          </Button>
        </Form>
        <div>
          <p className="Forget" onClick={handleForgotPassword}>
            Forgot Password
          </p>
          {showEmailSent && (
            <p className="Forget" style={{ width: "290px" }}>
              A password reset link has been sent to your email. Click on the
              link to reset your password.
            </p>
          )}
        </div>

        <div>
          {formData.loginAs === "customer" ? (
            <p>
              Are you a Staff? <Link to="/staff-login">Login Here</Link>{" "}
            </p>
          ) : (
            <p>
              Are you a Customer? <Link to="/login">Login Here</Link>{" "}
            </p>
          )}
        </div>
      </div>

      {showOTP && (
        <OtpModal
          username={formData.username}
          showModal={showOTP}
          handleCloseModal={() => setShowOTP(false)}
          path="/admin/login-verification"
          otpVerificationSucc={otpVerificationSucc}
        />
      )}

      {/* popup modal for forgot password */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            It seems you&apos;ve forgotten your password. No worries, it happens
            to the best of us! To reset your password and regain access to your
            account, please enter your username and email below.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter username"
                name="forgotUsername"
                value={forgotUsername}
                onChange={(e) => setForgotUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </Form.Group>
            <p>I am a</p>
            <div className="asBox" style={{ marginBottom: "18px" }}>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="staff"
                  onChange={handleChange}
                />
                <label className="Remember">Staff </label>
              </div>
              <div>
                <input
                  type="radio"
                  name="loginAs"
                  className="radio"
                  value="customer"
                  onChange={handleChange}
                />
                <label className="Remember">Customer </label>
              </div>
            </div>
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleForgotPasswordSubmit(e)}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Login.propTypes = {
  setLogin: PropTypes.func,
};

export default Login;
