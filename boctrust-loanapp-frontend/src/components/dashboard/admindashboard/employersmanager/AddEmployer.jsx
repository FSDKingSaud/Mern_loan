import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardHeadline from "../../shared/DashboardHeadline";
import "../../dashboardcomponents/transferdashboard/Transfer.css";
import BocButton from "../../shared/BocButton";
import SelectField from "../../../loanapplication/loanform/formcomponents/SelectField";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployerLetterRules } from "../../../../redux/reducers/employerLetterRuleReducer";
import { fetchStatementRules } from "../../../../redux/reducers/statementRuleReducer";
import { fetchMandateRules } from "../../../../redux/reducers/mandateRuleReducer";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";

// Define validation schema using Yup
const validationSchema = Yup.object().shape({
  employersName: Yup.string().required("Employers name is required"),
  employersAddress: Yup.string().required("Employer address is required"),
});

const initialValues = {
  employersName: "",
  employersAddress: "",
  mandateRule: "",
  statementRule: "",
  employerLetterRule: "",
};

const AddEmployer = () => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const { employerLetterRules } = useSelector(
    (state) => state.employerLetterRuleReducer
  );
  const { statementRules } = useSelector((state) => state.statementRuleReducer);
  const { mandateRules } = useSelector((state) => state.mandateRuleReducer);

  useEffect(() => {
    const getData = async () => {
      try {
        await dispatch(fetchEmployerLetterRules());
        await dispatch(fetchStatementRules());
        await dispatch(fetchMandateRules());
      } catch (error) {
        toast.error(error.message);
      }
    };

    getData();
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setIsLoading(true);

      const data = {
        employersName: values.employersName,
        employersAddress: values.employersAddress,
        mandateRule: values.mandateRule,
        statementRule: values.statementRule,
        employerLetterRule: values.employerLetterRule,
        newLoanFee: {
          applicationFee: values.newApplicantApplicationFee || 0,
          managementFee: values.newApplicantManagementFee || 0,
          insuranceFee: values.newApplicantInsuranceFee || 0,
        },
        returningLoanFee: {
          applicationFee: values.reApplicantApplicationFee || 0,
          managementFee: values.reApplicantManagementFee || 0,
          insuranceFee: values.reApplicantInsuranceFee || 0,
        },
      };

      // Handle form submission logic here
      await apiClient.post(`/agency/employers`, data);

      // Reset form after submission
      resetForm();
      // Set message after successful submission
      setMessage("Employer added successfully");
      toast.success("Employer added successfully");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add__employerContainer">
      <div className="TransContainer">
        <DashboardHeadline>Add New Employer</DashboardHeadline>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="appForm">
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="employersName">Employers Name</label>
                <Field
                  type="text"
                  name="employersName"
                  id="employersName"
                  className="Input"
                />
                <ErrorMessage
                  name="employersName"
                  component="div"
                  className="error__msg"
                />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="employersAddress">Employers Address</label>
                <Field
                  type="text"
                  name="employersAddress"
                  id="employersAddress"
                  className="Input"
                />
                <ErrorMessage
                  name="employersAddress"
                  component="div"
                  className="error__msg"
                />
              </div>

              <div className="FieldGroup">
                <SelectField label="Mandate Rule" name="mandateRule">
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {mandateRules ? (
                    mandateRules?.map((mandateRule) => {
                      return (
                        <option key={mandateRule._id} value={mandateRule._id}>
                          {mandateRule.mandateTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>
            </div>

            <div className="FieldRow">
              <div className="FieldGroup">
                <SelectField label="Statement Rule" name="statementRule">
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {statementRules ? (
                    statementRules?.map((statementRule) => {
                      return (
                        <option
                          key={statementRule._id}
                          value={statementRule._id}
                        >
                          {statementRule.ruleTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>

              <div className="FieldGroup">
                <SelectField
                  label="Employment Letter Rule"
                  name="employerLetterRule"
                >
                  <option value="">Select</option>
                  {/* <option value="000">No Bank</option> */}
                  {employerLetterRules ? (
                    employerLetterRules?.map((employerRule) => {
                      return (
                        <option key={employerRule._id} value={employerRule._id}>
                          {employerRule.ruleTitle}
                        </option>
                      );
                    })
                  ) : (
                    <div>
                      <PageLoader width="28px" />
                    </div>
                  )}
                </SelectField>
                <div className="error__msg" />
              </div>
            </div>

            <div className="input__containerWrapper">
              <h4>New Applicants Fee</h4>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="newApplicantApplicationFee">
                    Application Fee (NGN)
                  </label>
                  <Field
                    type="text"
                    name="newApplicantApplicationFee"
                    id="newApplicantApplicationFee"
                    className="Input"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="newApplicantManagementFee">
                    Management Fee (%)
                  </label>
                  <Field
                    type="text"
                    name="newApplicantManagementFee"
                    id="newApplicantManagementFee"
                    className="Input"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="newApplicantInsuranceFee">
                    Insurance Fee (%)
                  </label>
                  <Field
                    type="text"
                    name="newApplicantInsuranceFee"
                    id="newApplicantInsuranceFee"
                    className="Input"
                  />
                </div>
              </div>
            </div>
            <div className="input__containerWrapper">
              <h4>Returning Applicants Fee</h4>
              <div className="FieldRow">
                <div className="FieldGroup">
                  <label htmlFor="reApplicantApplicationFee">
                    Application Fee (NGN)
                  </label>
                  <Field
                    type="text"
                    name="reApplicantApplicationFee"
                    id="reApplicantApplicationFee"
                    className="Input"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="reApplicantManagementFee">
                    Management Fee  (%)
                  </label>
                  <Field
                    type="text"
                    name="reApplicantManagementFee"
                    id="reApplicantManagementFee"
                    className="Input"
                  />
                </div>
                <div className="FieldGroup">
                  <label htmlFor="reApplicantInsuranceFee">Insurance Fee (%)</label>
                  <Field
                    type="text"
                    name="reApplicantInsuranceFee"
                    id="reApplicantInsuranceFee"
                    className="Input"
                  />
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
                fontSize="1.2rem"
                type="submit"
                bgcolor="#ecaa00"
                bradius="16px"
                width={"200px"}
              >
                Add Employer
                {isLoading && <PageLoader strokeColor="#fff" width="20px" />}
              </BocButton>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default AddEmployer;
