import { Formik, Form, Field, ErrorMessage } from "formik";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import * as Yup from "yup";
import PropTypes from "prop-types";
import BocButton from "../../../shared/BocButton";
import PageLoader from "../../../shared/PageLoader";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  ruleTitle: Yup.string().required("Rule title is required"),
  maximumTenure: Yup.string().required("Tenure threshold is required"),
  maximumAmount: Yup.string().required("Amount threshold is required"),
  logicalRelationship: Yup.string(),
});

// Define options for select inputs
const tenures = [
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "12 months", label: "12 Months" },
  { value: "24 months", label: "24 Months" },
  { value: "36 months", label: "36 Months" },
  { value: "48 months", label: "48 Months" },
  { value: "Unlimited", label: "No Maximum Tenure" },
  // Add more options as needed
];

const EmployerLetterRuleForm = ({
  formTitle,
  initialValues,
  isLoading,
  isUpdate,
  handleSubmit,
  message,
}) => {
  return (
    <div className="add__statementContainer">
      <div className="TransContainer ">
        <DashboardHeadline>{formTitle}</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="appForm">
              <div className="FieldRow rule__title">
                <div className="FieldGroup ">
                  <label htmlFor="ruleTitle">Rule Title</label>
                  <Field
                    type="text"
                    name="ruleTitle"
                    id="ruleTitle"
                    className="Input"
                  ></Field>
                  <ErrorMessage
                    name="ruleTitle"
                    component="div"
                    className="error__msg"
                  />
                </div>

                <div className="FieldGroup">
                  <label htmlFor="logicalRelationship">
                    Logical Relationship
                  </label>
                  <Field
                    as="select"
                    name="logicalRelationship"
                    id="logicalRelationship"
                    className="Select"
                  >
                    {["AND", "OR"].map((option) => (
                      <option key={option} value={option} label={option} />
                    ))}
                  </Field>
                </div>
              </div>

              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="maximumTenure">Maximum Tenure</label>
                  <Field
                    as="select"
                    name="maximumTenure"
                    id="maximumTenure"
                    className="Select"
                    disabled={values?.noMaxTenure}
                    onChange={(e) => {
                      setFieldValue("maximumTenure", e.target.value);
                      if (values?.noMaxTenure) {
                        setFieldValue("maximumTenure", 0);
                      }
                    }}
                  >
                    <option value="" label="Select tenure" />
                    {tenures.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      />
                    ))}
                  </Field>
                  <ErrorMessage
                    className="error__msg"
                    name="maximumTenure"
                    component="div"
                  />

                  <div className="MandateLabel">
                    <Field
                      type="checkbox"
                      name="noMaxTenure"
                      className="Gap"
                      onClick={(e) => {
                        if (e.target.checked) {
                          setFieldValue("maximumTenure", 0);
                        }
                        setFieldValue("noMaxTenure", e.target.checked);
                      }}
                    />
                    No Maximum Tenure
                  </div>
                </div>

                <div className="FieldGroup">
                  <label htmlFor="maximumAmount">Maximum Amount</label>
                  <Field
                    type="text"
                    name="maximumAmount"
                    id="maximumAmount"
                    disabled={values?.noMaxAmount}
                    className="Input"
                    onChange={(e) => {
                      setFieldValue("maximumAmount", e.target.value);
                      if (values?.noMaxAmount) {
                        setFieldValue("maximumAmount", 0);
                      }
                    }}
                  ></Field>
                  <ErrorMessage
                    className="error__msg"
                    name="maximumAmount"
                    component="div"
                  />

                  <div className="MandateLabel">
                    <Field
                      type="checkbox"
                      name="noMaxAmount"
                      className="Gap"
                      onClick={(e) => {
                        if (e.target.checked) {
                          setFieldValue("maximumAmount", 0);
                        }
                        setFieldValue("noMaxAmount", e.target.checked);
                      }}
                    />
                    No Maximum Amount
                  </div>
                </div>
              </div>

              {message && (
                <div style={{ textAlign: "center", color: "#145098" }}>
                  {message}
                </div>
              )}

              <div className="BtnContainer">
                <BocButton
                  fontSize="1.6rem"
                  type="submit"
                  bgcolor="#ecaa00"
                  bradius="18px"
                >
                  {isUpdate ? "Update Rule" : "Create Rule"}
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

EmployerLetterRuleForm.propTypes = {
  handleSubmit: PropTypes.func,
  formTitle: PropTypes.string,
  isLoading: PropTypes.bool,
  isUpdate: PropTypes.bool,
  message: PropTypes.string,
  initialValues: PropTypes.object,
};

export default EmployerLetterRuleForm;
