import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import "../../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../../shared/BocButton";

// toast styles
import "react-toastify/dist/ReactToastify.css";
import PageLoader from "../../../shared/PageLoader";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  mandateTitle: Yup.string().required("Mandate title is required"),
  mandateDuration: Yup.string().required("Mandate duration is required"),
});

// Define options for select inputs
 const mandateTitles = [
  {
    value: "365 Days Eligibility",
    label: "Loan Eligibility after 365 days",
    duration: "365 days",
  },
  {
    value: "365 Days Eligibility (Stacked)",
    label: "Loan Eligibility after 365 days (stacked)",
    duration: "365 days",
  },
  {
    value: "180 Days Eligibility",
    label: "Loan Eligibility after 180 days",
    duration: "180 days",
  },
  {
    value: "90 Days Eligibility",
    label: "Loan Eligibility after 90 days",
    duration: "90 days",
  },
  {
    value: "30 Days Eligibility",
    label: "Loan Eligibility after 30 days",
    duration: "30 days",
  },

  // Add more options as needed
];

const durationOptions = [
  { value: "365 days", label: "365 Days" },
  { value: "180 days", label: "180 Days" },
  { value: "90 days", label: "90 Days" },
  { value: "30 days", label: "30 Days" },
  // Add more options as needed
];

const secondaryDuration = [
  { value: "365", label: "365 Days" },
  { value: "180", label: "180 Days" },
  { value: "90", label: "90 Days" },
  { value: "30", label: "30 Days" },
  // Add more options as needed
];

const MandateRuleForm = ({
  formTitle,
  initialValues,
  isLoading,
  isUpdate,
  handleSubmit,
  message,
}) => {
  return (
    <div className="add__mandateRule">
      <div className="TransContainer">
        <DashboardHeadline>{formTitle}</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form className="appForm">
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="mandateTitle">Mandate Title</label>
                  <Field
                    as="select"
                    name="mandateTitle"
                    id="mandateTitle"
                    className="Select"
                    onBlur={() => {
                      setFieldValue(
                        "mandateDuration",
                        mandateTitles.find(
                          (item) => values.mandateTitle == item.value
                        )?.duration
                      );
                    }}
                  >
                    <option value="" label="Select a title" />
                    {mandateTitles.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Field>
                  <ErrorMessage
                    name="mandateTitle"
                    component="div"
                    className="error__msg"
                  />
                </div>

                <div className="FieldGroup">
                  <label htmlFor="mandateDuration">Duration</label>
                  <Field
                    as="select"
                    name="mandateDuration"
                    id="mandateDuration"
                    className="Select"
                    disabled={true}
                  >
                    <option value="" label="Select duration" />
                    {durationOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Field>
                  <ErrorMessage
                    name="mandateDuration"
                    component="div"
                    className="error__msg"
                  />
                </div>
              </div>

              <div className="FieldRow">
                <div className="RadioCon FieldGroup">
                  <label htmlFor="allowStacking">
                    Allow Remita Rule Stacking
                  </label>
                  <div className="Input">
                    <label className="MandateLabel">
                      <Field
                        type="radio"
                        name="allowStacking"
                        value="yes"
                        className="Gap"
                      />
                      Yes
                    </label>
                    <label className="MandateLabel">
                      <Field
                        type="radio"
                        name="allowStacking"
                        value="no"
                        className="Gap"
                      />
                      No
                    </label>
                  </div>

                  <ErrorMessage
                    name="allowStacking"
                    component="div"
                    className="error__msg"
                  />
                </div>

                <div className="FieldGroup">
                  <label htmlFor="secondaryDuration">
                    Secondary Rule Duration
                  </label>
                  <Field
                    as="select"
                    name="secondaryDuration"
                    id="secondaryDuration"
                    className="Select"
                    disabled={
                      !values.allowStacking || values.allowStacking === "no"
                    }
                  >
                    <option value="" label="Select duration" />
                    {secondaryDuration.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Field>
                  <ErrorMessage
                    name="secondaryDuration"
                    component="div"
                    className="error__msg"
                  />
                </div>
              </div>

              {message && (
                <div style={{ textAlign: "center", color: "#145098" }}>
                  {message}
                </div>
              )}

              <div className="BtnContainer">
                <BocButton
                  fontSize="1.2rem"
                  type="submit"
                  bgcolor="#ecaa00"
                  bradius="18px"
                  width={"200px"}
                  disable={isLoading}
                >
                 {  isUpdate ?  "Update Mandate" : "Create Mandate"}
                  {isLoading && <PageLoader strokeColor="#fff" width="20px" />}
                </BocButton>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

MandateRuleForm.propTypes = {
  handleSubmit: PropTypes.func,
  formTitle: PropTypes.string,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool,
  message: PropTypes.string,
  initialValues: PropTypes.object,
};

export default MandateRuleForm;
