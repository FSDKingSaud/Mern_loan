/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../customers/Customer.css";
import "./CreateNewAdmin.css";
import validationSchema from "./validationSchema";
import { userTypes } from "../../../../lib/userRelated";
import { useDispatch, useSelector } from "react-redux";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  fetchAdmins,
  fetchRolesAndPermisions,
} from "../../../../redux/reducers/adminUserReducer";
import apiClient from "../../../../lib/axios";
import OtpModal from "../otpModal/OtpModal";

const initialValues = {
  fullName: "",
  photo: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  userRole: "",
  userType: "",
};

const CreateNewAdmin = () => {
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [email, setEmail] = useState("");

  let resetFunc = null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { rolesAndPermission } = useSelector((state) => state.adminUserReducer);

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchRolesAndPermisions());
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);

      if (values.userType !== "super_admin" && !values.userRole) {
        return toast.error("Please provide a User Role");
      }

      // Handle form submission logic here
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("photo", values.photo);
      formData.append("email", values.email.toLowerCase());
      formData.append("phone", values.phone);
      formData.append("username", values.username.toLowerCase());
      formData.append("password", values.password);

      formData.append("userType", values.userType);

      if (values.userType && values.userType === "super_admin") {
        const adminRole = rolesAndPermission?.find(
          (item) => item.value === "super_admin"
        );

        formData.append("userRole", adminRole?._id);
      } else {
        formData.append("userRole", values.userRole);
      }

      const res = await apiClient.post(`/admin/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status == 201) {
        setShowOTP(true);
        resetFunc = resetForm;
        setEmail(values.email.toLowerCase());
      } else {
        const errorResponse = await res.json();
        toast.error(errorResponse?.error || "Something Went Wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const otpVerificationSucc = async () => {
    // clear fields
    if (resetFunc) {
      resetFunc();
    }

    setNotification("New admin user added successfully");
    setShowOTP(false)

    setTimeout(() => {
      setNotification("");
    }, 3000);

    await dispatch(fetchAdmins());

    toast.success("New admin user added successfully");
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="TransContainer">
      <DashboardHeadline>Add New User</DashboardHeadline>
      <div className="FormCon">
        <form onSubmit={formik.handleSubmit}>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                id="fullName"
                className="Input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
              />
              {formik.errors.fullName && formik.touched.fullName ? (
                <div className="Error">{formik.errors.fullName}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                name="photo"
                accept=".jpg, .jpeg, .png"
                onBlur={formik.handleBlur}
                id="photo"
                className="Input"
                onChange={(event) => {
                  formik.setFieldValue("photo", event.currentTarget.files[0]);
                }}
                style={{ paddingBottom: "38px", fontSize: "12px" }}
              />
              {formik.errors.photo && formik.touched.photo ? (
                <div className="Error">{formik.errors.photo}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="email">Office Email</label>
              <input
                type="text"
                name="email"
                placeholder="Enter office email"
                id="email"
                onBlur={formik.handleBlur}
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.errors.email && formik.touched.email ? (
                <div className="Error">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="e.g. +2347047202860"
                id="phone"
                onBlur={formik.handleBlur}
                className="Input"
                onChange={(event) => {
                  const value = event.target.value;
                  // Ensure the phone number starts with a "+" and only contains digits after the "+"
                  const formattedValue = value.startsWith("+")
                    ? value
                    : `+${value}`;
                  formik.setFieldValue("phone", formattedValue);
                }}
                value={formik.values.phone}
              />
              {formik.errors.phone && formik.touched.phone ? (
                <div className="Error">{formik.errors.phone}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                id="username"
                onBlur={formik.handleBlur}
                className="Input"
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.errors.username && formik.touched.username ? (
                <div className="Error">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="FieldGroup IUpload">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                onBlur={formik.handleBlur}
                placeholder="Enter password"
                id="password"
                className="Input"
                onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password ? (
                <div className="Error">{formik.errors.password}</div>
              ) : null}
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="userType">User Type</label>
              <select
                name="userType"
                onBlur={formik.handleBlur}
                id="userType"
                className="Input"
                onChange={formik.handleChange}
              >
                <option value="">Select Type</option>
                {userTypes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formik.errors.userType && formik.touched.userType ? (
                <div className="Error">{formik.errors.userType}</div>
              ) : null}
            </div>

            {rolesAndPermission && (
              <div className="FieldGroup">
                <label htmlFor="userRole">User Roles</label>
                <select
                  name="userRole"
                  onBlur={formik.handleBlur}
                  disabled={
                    !formik.values.userType ||
                    formik.values.userType === "super_admin"
                  }
                  onChange={formik.handleChange}
                  id="userRole"
                  className="Input"
                >
                  <option value="">Select Role</option>
                  {rolesAndPermission.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formik.errors.userRole && formik.touched.userRole ? (
                  <div className="Error">{formik.errors.userRole}</div>
                ) : null}
              </div>
            )}
          </div>

          {/* adminRoles checkbox options section */}
          {/* <div className="AdminRoles">
            <label htmlFor="adminRoles">Admin Roles</label>

            <div className="CheckboxContainer">
              {adminRoles?.map((option) => (
                <div key={option.value} className="CheckboxGrou">
                  <input
                    type="checkbox"
                    name="adminRoles"
                    id={option.value}
                    value={option.value}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor={option.value} className="checkboxLabel">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {formik.errors.adminRoles && formik.touched.adminRoles ? (
              <div className="Error">{formik.errors.adminRoles}</div>
            ) : null}
          </div> */}

          {/* notification message */}
          <div className="Notification">
            <p>{notification}</p>
          </div>

          <div className="BtnRow">
            <div className="BtnContainer">
              <BocButton
                fontSize="1.3rem"
                type="button"
                bgcolor="gray"
                bradius="18px"
                func={() => navigate(-1)}
                width={"200px"}
              >
                Cancel
              </BocButton>
            </div>
            <div className="BtnContainer">
              <BocButton
                fontSize="1.3rem"
                type="submit"
                bgcolor="#ecaa00"
                bradius="18px"
                width={"200px"}
              >
                {isLoading ? <PageLoader width="16px" /> : "Submit"}
              </BocButton>
            </div>
          </div>
        </form>
      </div>

      {showOTP && (
        <OtpModal
          email={email}
          showModal={showOTP}
          otpVerificationSucc={otpVerificationSucc}
        />
      )}
    </div>
  );
};

export default CreateNewAdmin;
