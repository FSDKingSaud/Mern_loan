/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAccount } from "../../../../redux/reducers/accountReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiClient from "../../../../lib/axios";

const EditAccount = (props) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();
  const account = props.account;

  // form state
  const [editAccountName, setEditAccountName] = useState("");
  const [editInterestRate, setEditInterestRate] = useState("");
  const [editInterestMethod, setEditInterestMethod] = useState("");
  const [editInterestPeriod, setEditInterestPeriod] = useState("");
  const [editStatus, setEditStatus] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    setEditAccountName(account.accountName);
    setEditInterestRate(account.interestRate);
    setEditInterestMethod(account.interestMethod);
    setEditInterestPeriod(account.interestPeriod);
    setEditStatus(account.status);
  };

  useEffect(() => {
    updateFormObject();
  }, [account]);

  // clear form fields
  const clearForm = () => {
    setEditAccountName("");
    setEditInterestRate("");
    setEditInterestMethod("");
    setEditInterestPeriod("");
    setEditStatus("");
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedAccount = {
      accountName: editAccountName,
      interestRate: editInterestRate,
      interestMethod: editInterestMethod,
      interestPeriod: editInterestPeriod,
      status: editStatus,
    };

    await apiClient.put(`/account/accounts/${account._id}`, updatedAccount);

    clearForm();
    handleClose();
    dispatch(fetchAccount());
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
          Edit Account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="accountName" style={{ marginTop: "-1rem" }}>
              Account Name
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editAccountName}
              onChange={(e) => setEditAccountName(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="interestRate" style={{ marginTop: "-1rem" }}>
              Interest Rate
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editInterestRate}
              onChange={(e) => setEditInterestRate(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="interestMethod" style={{ marginTop: "-1rem" }}>
              Interest Method
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editInterestMethod}
              onChange={(e) => setEditInterestMethod(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="interestPeriod" style={{ marginTop: "-1rem" }}>
              Interest Period
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editInterestPeriod}
              onChange={(e) => setEditInterestPeriod(e.target.value)}
            />
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

export default EditAccount;
