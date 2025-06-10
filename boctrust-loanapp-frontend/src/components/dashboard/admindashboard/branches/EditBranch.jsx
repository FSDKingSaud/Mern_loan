/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBranches } from "../../../../redux/reducers/branchReducer";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import apiClient from "../../../../lib/axios";

const EditBranch = (props) => {
  const dispatch = useDispatch();
  const branch = props.branches;
  const actionType = props.actionType;

  // form state
  const [editBranchId, setEditBranchId] = useState("");
  const [editBranchName, setEditBranchName] = useState("");
  const [editBranchEmail, setEditBranchEmail] = useState("");
  const [editBranchPhone, setEditBranchPhone] = useState("");
  const [editBranchAddress, setEditBranchAddress] = useState("");
  const [editNote, setEditNote] = useState("");

  // pass object data to form
  const updateFormObject = () => {
    setEditBranchId(branch.branchId);
    setEditBranchName(branch.branchName);
    setEditBranchEmail(branch.contactEmail);
    setEditBranchPhone(branch.phoneNumber);
    setEditBranchAddress(branch.address);
    setEditNote(branch.note);
  };

  useEffect(() => {
    updateFormObject();
  }, [branch]);

  // clear form fields
  const clearForm = () => {
    setEditBranchId("");
    setEditBranchName("");
    setEditBranchEmail("");
    setEditBranchPhone("");
    setEditBranchAddress("");
    setEditNote("");
    dispatch(fetchBranches());
  };

  // close model box
  const handleClose = () => {
    props.onHide();
    clearForm();
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_BASE_URL;
    const updatedBranch = {
      branchId: editBranchId,
      branchName: editBranchName,
      contactEmail: editBranchEmail,
      phoneNumber: editBranchPhone,
      address: editBranchAddress,
      note: editNote,
    };

    await apiClient.put(`/branch/branches/${branch._id}`, updatedBranch);

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
          {actionType === "edit" ? "Edit Branch" : "Branch Details"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <form onSubmit={handleSubmit}>
          <div className="FieldGroup">
            <label htmlFor="branchId" style={{ marginTop: "-1rem" }}>
              Branch ID
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editBranchId}
              onChange={(e) => setEditBranchId(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="branchName" style={{ marginTop: "-1rem" }}>
              Branch Name
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editBranchName}
              onChange={(e) => setEditBranchName(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="contactEmail" style={{ marginTop: "-1rem" }}>
              Contact Email
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editBranchEmail}
              onChange={(e) => setEditBranchEmail(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="phoneNumber" style={{ marginTop: "-1rem" }}>
              Phone Number
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editBranchPhone}
              onChange={(e) => setEditBranchPhone(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="address" style={{ marginTop: "-1rem" }}>
              Branch Address
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editBranchAddress}
              onChange={(e) => setEditBranchAddress(e.target.value)}
            />
          </div>

          <div className="FieldGroup">
            <label htmlFor="note" style={{ marginTop: "-1rem" }}>
              Notes
            </label>
            <input
              type="text"
              style={{ width: "100%" }}
              className="Input"
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        {actionType === "edit" && (
          <Button variant="primary" type="button" onClick={handleSubmit}>
            Update
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default EditBranch;
