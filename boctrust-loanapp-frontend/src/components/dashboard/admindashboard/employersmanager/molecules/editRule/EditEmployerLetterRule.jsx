import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import "./EditeRule.css";
import { useDispatch } from "react-redux";
import { fetchEmployerLetterRules } from "../../../../../../redux/reducers/employerLetterRuleReducer";
import EmployerLetterRuleForm from "../EmployerLetterRuleForm";
import apiClient from "../../../../../../lib/axios";

const EditEmployerLetterRule = ({ show, handleClose, selectedRule }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleUpdate = async (values) => {
    try {
      setIsLoading(true);
     
      // Handle form submission logic here
      await apiClient.put(`/employer-letter-rule/${selectedRule._id}`, values);

      await dispatch(fetchEmployerLetterRules());

      setMessage("Edited Successfully");
      toast.success("Employer Letter Updated successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <div className="edit__mandateRuleContainer">
          <button onClick={handleClose} className="btn btn-light close-btn">
            <IoClose size={20} color="rgb(244 63 94)" />
          </button>
          <EmployerLetterRuleForm
            formTitle={"Edit Employer Letter Rule"}
            handleSubmit={handleUpdate}
            message={message}
            isLoading={isLoading}
            isUpdate
            initialValues={selectedRule}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

EditEmployerLetterRule.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  selectedRule: PropTypes.object,
};

export default EditEmployerLetterRule;
