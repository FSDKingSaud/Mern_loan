/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployers } from "../../../../redux/reducers/employersManagerReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./EmployerManager.css";
import { fetchMandateRules } from "../../../../redux/reducers/mandateRuleReducer";
import { fetchStatementRules } from "../../../../redux/reducers/statementRuleReducer";
import apiClient from "../../../../lib/axios";
import { fetchEmployerLetterRules } from "../../../../redux/reducers/employerLetterRuleReducer";

const EditEmployer = (props) => {
  const dispatch = useDispatch();
  const employers = props.employerData;
  const { mandateRules } = useSelector((state) => state.mandateRuleReducer);
  const { statementRules } = useSelector((state) => state.statementRuleReducer);
  const { employerLetterRules } = useSelector(
    (state) => state.employerLetterRuleReducer
  );

  // form state
  const [editEmployerName, setEditEmployerName] = useState("");
  const [editEmployerAddress, setEditEmployerAddress] = useState("");
  const [editMandateRule, setEditMandateRule] = useState(employers.mandateRule);
  const [editStatementRule, setEditStatementRule] = useState(
    employers.statementRule
  );
  const [editEmploymentLetterRule, setEditEmploymentLetterRule] = useState(
    employers.employerLetterRule
  );
  const [newApplicantApplicationFee, setNewApplicantApplicationFee] =
    useState("");
  const [newApplicantManagementFee, setNewApplicantManagementFee] =
    useState("");
  const [newApplicantInsuranceFee, setNewApplicantInsuranceFee] = useState("");
  const [reApplicantApplicationFee, setReApplicantApplicationFee] =
    useState("");
  const [reApplicantManagementFee, setReApplicantManagementFee] = useState("");
  const [reApplicantInsuranceFee, setReApplicantInsuranceFee] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    // check if object is empty
    if (Object.keys(employers).length === 0) {
      return;
    }

    setEditEmployerName(employers.employersName);
    setEditEmployerAddress(employers.employersAddress);
    setEditMandateRule(employers.mandateRule);
    setEditStatementRule(employers.statementRule);
    setEditEmploymentLetterRule(employers.employerLetterRule);

    setNewApplicantApplicationFee(employers.newLoanFee.applicationFee);
    setNewApplicantManagementFee(employers.newLoanFee.managementFee);
    setNewApplicantInsuranceFee(employers.newLoanFee.insuranceFee);

    setReApplicantApplicationFee(employers.returningLoanFee.applicationFee);
    setReApplicantManagementFee(employers.returningLoanFee.managementFee);
    setReApplicantInsuranceFee(employers.returningLoanFee.insuranceFee);
  };

  useEffect(() => {
    updateFormObject();
  }, [employers]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchMandateRules());
      await dispatch(fetchStatementRules());
      await dispatch(fetchEmployerLetterRules());
    };

    getData();
  }, [dispatch]);

  // clear form fields
  const clearForm = () => {
    setEditEmployerName("");
    setEditEmployerAddress("");
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
    dispatch(fetchEmployers());
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = import.meta.env.VITE_BASE_URL;

    if (!editEmployerName || !editEmployerAddress || !editMandateRule) {
      console.log("Failing ")
      return;
    }

    const updatedEmployer = {
      employersName: editEmployerName,
      employersAddress: editEmployerAddress,
      mandateRule: editMandateRule?._id,
      statementRule: editStatementRule?._id,
      employerLetterRule: editEmploymentLetterRule?._id,

      newLoanFee: {
        applicationFee: newApplicantApplicationFee || 0,
        managementFee: newApplicantManagementFee || 0,
        insuranceFee: newApplicantInsuranceFee || 0,
      },
      returningLoanFee: {
        applicationFee: reApplicantApplicationFee || 0,
        managementFee: reApplicantManagementFee || 0,
        insuranceFee: reApplicantInsuranceFee || 0,
      },
    };
    await apiClient.put(`/agency/employers/${employers._id}`, updatedEmployer);

    await dispatch(fetchEmployers());

    clearForm();
    handleClose();
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Employer Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit} className="edit__employerWrapper">
          <div className="FieldGroup  ">
            <label htmlFor="employerName" style={{ marginTop: "-1rem" }}>
              Employers Name
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editEmployerName}
              onChange={(e) => setEditEmployerName(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="employerAddress" style={{ marginTop: "-1rem" }}>
              Employers Address
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editEmployerAddress}
              onChange={(e) => setEditEmployerAddress(e.target.value)}
            />
          </div>

          <hr />

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="mandateTitle" style={{ marginTop: "-1rem" }}>
                Mandate Title
              </label>
              <select
                className="Select"
                style={{
                  width: "100%",
                }}
                value={editMandateRule?._id}
                onChange={(e) => {
                  const rule = mandateRules?.find(
                    (item) => e.target.value == item._id
                  );
                  setEditMandateRule(rule);
                }}
              >
                {mandateRules?.map((item, index) => (
                  <option key={index} value={item._id}>
                    {item.mandateTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="FieldGroup">
              <label htmlFor="mandateDuration" style={{ marginTop: "-1rem" }}>
                Mandate Duration
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editMandateRule?.mandateDuration}
                disabled
              />
            </div>
          </div>
          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="mandateTitle" style={{ marginTop: "-1rem" }}>
                Allow Stacking
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editMandateRule?.allowStacking}
                disabled
              />
            </div>

            <div className="FieldGroup">
              <label htmlFor="mandateDuration" style={{ marginTop: "-1rem" }}>
                Secondary Duration
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editMandateRule?.secondaryDuration}
                disabled
              />
            </div>
          </div>

          <hr />
          <div className="FieldGroup">
            <label htmlFor="mandateTitle" style={{ marginTop: "-1rem" }}>
              Statement Rule Title
            </label>
            <select
              className="Select"
              style={{
                width: "100%",
              }}
              value={editStatementRule?._id}
              onChange={(e) => {
                const rule = statementRules?.find(
                  (item) => e.target.value == item._id
                );
                setEditStatementRule(rule);
              }}
            >
              <option>-None Selected-</option>
              {statementRules?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.ruleTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="maximumTenure" style={{ marginTop: "-1rem" }}>
                Maximum Tenure
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editStatementRule?.maximumTenure}
                disabled
              />
            </div>

            <div className="FieldGroup">
              <label htmlFor="maximumAmount" style={{ marginTop: "-1rem" }}>
                Maximum Amount
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editStatementRule?.maximumAmount}
                disabled
              />
            </div>
          </div>
          <hr />
          <div className="FieldGroup">
            <label htmlFor="mandateTitle" style={{ marginTop: "-1rem" }}>
              Employment Letter Rule Title
            </label>
            <select
              className="Select"
              style={{
                width: "100%",
              }}
              value={editEmploymentLetterRule?._id}
              onChange={(e) => {
                const rule = employerLetterRules?.find(
                  (item) => e.target.value == item._id
                );

                setEditEmploymentLetterRule(rule);
              }}
            >
              <option>-None Selected-</option>
              {employerLetterRules?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.ruleTitle}
                </option>
              ))}
            </select>
          </div>

          <div className="FieldRow">
            <div className="FieldGroup">
              <label htmlFor="maximumTenure" style={{ marginTop: "-1rem" }}>
                Maximum Tenure
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editEmploymentLetterRule?.maximumTenure}
                disabled
              />
            </div>

            <div className="FieldGroup">
              <label htmlFor="maximumAmount" style={{ marginTop: "-1rem" }}>
                Maximum Amount
              </label>
              <input
                type="text"
                style={{ width: "100%" }}
                className="Input"
                value={editEmploymentLetterRule?.maximumAmount}
                disabled
              />
            </div>
          </div>

          <div className="input__containerWrapper">
            <h4>New Applicants Fee</h4>
            <div className="FieldRow">
              <div className="FieldGroup">
                <label htmlFor="newApplicantApplicationFee">
                  Application Fee (NGN)
                </label>
                <input
                  type="text"
                  name="newApplicantApplicationFee"
                  id="newApplicantApplicationFee"
                  className="Input"
                  value={newApplicantApplicationFee}
                  onChange={(e) => setNewApplicantApplicationFee(e.target.value)}
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="newApplicantManagementFee">
                  Management Fee (%)
                </label>
                <input
                  type="text"
                  name="newApplicantManagementFee"
                  id="newApplicantManagementFee"
                  className="Input"
                  value={newApplicantManagementFee}
                  onChange={(e) => setNewApplicantManagementFee(e.target.value)}
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="newApplicantInsuranceFee">
                  Insurance Fee (%)
                </label>
                <input
                  type="text"
                  name="newApplicantInsuranceFee"
                  id="newApplicantInsuranceFee"
                  className="Input"
                  value={newApplicantInsuranceFee}
                  onChange={(e) => setNewApplicantInsuranceFee(e.target.value)}
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
                <input
                  type="text"
                  name="reApplicantApplicationFee"
                  id="reApplicantApplicationFee"
                  className="Input"
                  value={reApplicantApplicationFee}
                  onChange={(e) => setReApplicantApplicationFee(e.target.value)}
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="reApplicantManagementFee">
                  Management Fee (%)
                </label>
                <input
                  type="text"
                  name="reApplicantManagementFee"
                  id="reApplicantManagementFee"
                  className="Input"
                  value={reApplicantManagementFee}
                  onChange={(e) => setReApplicantManagementFee(e.target.value)}
                />
              </div>
              <div className="FieldGroup">
                <label htmlFor="reApplicantInsuranceFee">
                  Insurance Fee (%)
                </label>
                <input
                  type="text"
                  name="reApplicantInsuranceFee"
                  id="reApplicantInsuranceFee"
                  className="Input"
                  value={reApplicantInsuranceFee}
                  onChange={(e) => setReApplicantInsuranceFee(e.target.value)}
                />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        <Button variant="primary" type="button" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditEmployer;
