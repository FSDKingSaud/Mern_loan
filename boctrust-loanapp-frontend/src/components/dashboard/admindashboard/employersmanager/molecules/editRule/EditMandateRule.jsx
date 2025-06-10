import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import MandateRuleForm from "../MandateRuleForm";
import { IoClose } from "react-icons/io5";
import "./EditeRule.css";
import { fetchMandateRules } from "../../../../../../redux/reducers/mandateRuleReducer";
import { useDispatch } from "react-redux";
import apiClient from "../../../../../../lib/axios";

const EditMandateRule = ({ show, handleClose, selectedMandateRule }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleUpdateMandate = async (values) => {
    try {
      setIsLoading(true);

      // Handle form submission logic here
      await apiClient.put(`/mandate-rule/${selectedMandateRule._id}`, values);

      await dispatch(fetchMandateRules());

      setMessage("Edited Successfully");
      toast.success("Mandate Updated successfully");
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
          <MandateRuleForm
            formTitle={"Edit Mandate Rule"}
            handleSubmit={handleUpdateMandate}
            message={message}
            isLoading={isLoading}
            isUpdate
            initialValues={selectedMandateRule}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

EditMandateRule.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  selectedMandateRule: PropTypes.object,
};

export default EditMandateRule;
