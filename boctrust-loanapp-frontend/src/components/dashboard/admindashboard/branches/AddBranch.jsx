import { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  branchName: Yup.string().required("Branch name is required"),
  contactEmail: Yup.string().required("Contact email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  address: Yup.string().required("Address is required"),
});

const initialValues = {
  branchName: "",
  contactEmail: "",
  phoneNumber: "",
  address: "",
  note: "",
};

const AddBranch = ({ func }) => {
  const [message, setMessage] = useState("");
  const handleSubmit = async (values, { resetForm }) => {
    // Handle form submission logic here
    await apiClient.post(`/branch/branches`, values);

    // reset form
    resetForm();

    // set message
    setMessage("Branch added successfully");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="TransContainer">
      <DashboardHeadline>Add New Branch</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="branchName">Branch Name</label>
              <Field
                type="text"
                name="branchName"
                placeholder="Ikeja Branch"
                id="branchName"
                className="Input"
              />
              <ErrorMessage name="branchName" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="contactEmail">Contact Email</label>
              <Field
                type="text"
                name="contactEmail"
                id="contactEmail"
                className="Input"
                placeholder="ikeja@boctrustmfb.com"
              />
              <ErrorMessage name="contactEmail" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="phoneNumber">Phone Number</label>
              <Field
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                className="Input"
                placeholder="08012345678"
              />
              <ErrorMessage name="phoneNumber" component="div" />
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="address">Address</label>
              <Field
                type="text"
                name="address"
                id="address"
                className="Input"
              />
              <ErrorMessage name="address" component="div" />
            </div>
            <div className="FieldGroup">
              <label htmlFor="note">Note</label>
              <Field type="text" name="note" id="note" className="Input" />
              <ErrorMessage name="note" component="div" />
            </div>
          </div>
          <p style={{ textAlign: "center", color: "#145098" }}>{message}</p>

          <div className="BtnContainer">
            <BocButton
              type="submit"
              width="220px"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Add Branch
            </BocButton>
            <BocButton
              margin="1.5rem 0 0 0"
              type="submit"
              width="220px"
              bgcolor="gray"
              bradius="18px"
              func={() => func(false)}
            >
              Back to Branches
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

AddBranch.propTypes = {
  func: PropTypes.func,
};

export default AddBranch;
