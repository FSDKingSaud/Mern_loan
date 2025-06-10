import { useState } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  mandateTitle: Yup.string().required("Mandate title is required"),
  duration: Yup.string().required("Duration is required"),
  dateCreated: Yup.string().required("Date created is required"),
  assignedTo: Yup.string().required("Assigned to is required"),
});

const initialValues = {
  mandateTitle: "",
  duration: "",
  dateCreated: "",
  assignedTo: "",
};

const DebitMandates = ({ func }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [message, setMessage] = useState("");
  const handleSubmit = async (values, { resetForm }) => {
    // Handle form submission logic here
    await fetch(`${apiUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // reset form
    resetForm();

    // set message
    setMessage("New debit mandate added successfully");
    setTimeout(() => {
      setMessage("");
    }, 3000);
    };
    
    const durations = [
        { value: "daily", label: "Daily" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "biannually", label: "Biannually" },
        { value: "annually", label: "Annually" },
    ];

  return (
    <div className="TransContainer">
      <DashboardHeadline>Create New Debit Mandate Rule</DashboardHeadline>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="branchId">Mandate Title</label>
              <Field
                type="text"
                name="mandateTitle"
                id="mandateTitle"
                className="Input"
                placeholder="Enter Mandate Title"
              />
              <ErrorMessage name="mandateTitle" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="duration">Duration</label>
              <Field
                as="select"
                name="duration"
                id="duration"
                className="Select"
              >
                <option value="" label="Select a duration" />
                {durations.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  />
                ))}
              </Field>
              <ErrorMessage name="duration" component="div" />
            </div>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="dateCreated">Date Created</label>
              <Field
                type="date"
                name="dateCreated"
                id="dateCreated"
                className="Input"
              />
              <ErrorMessage name="dateCreated" component="div" />
            </div>

            <div className="FieldGroup">
              <label htmlFor="assignedTo">Assigned to</label>
              <Field
                type="text"
                name="assignedTo"
                id="assignedTo"
                className="Input"
                placeholder="Enter Assigned To"
              />
              <ErrorMessage name="assignedTo" component="div" />
            </div>
          </div>
          <p style={{ textAlign: "center", color: "#145098" }}>{message}</p>

          <div className="BtnContainer">
            <BocButton
              type="submit"
              width="420px"
              bgcolor="#ecaa00"
              bradius="18px"
            >
              Add Debit Mandate
            </BocButton>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

DebitMandates.propTypes = {
  func: PropTypes.func,
};

export default DebitMandates;
