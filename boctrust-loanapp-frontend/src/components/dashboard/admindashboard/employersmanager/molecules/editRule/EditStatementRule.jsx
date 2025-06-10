import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import "./EditeRule.css";
import { useDispatch } from "react-redux";
import { fetchStatementRules } from "../../../../../../redux/reducers/statementRuleReducer";
import StatementRuleForm from "../StatementRuleForm";
import apiClient from "../../../../../../lib/axios";

const EditStatementRule = ({ show, handleClose, selectedMandateRule }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const dispatch = useDispatch();

  const handleUpdateStatementRule = async (values) => {
    try {
      setIsLoading(true);
   
      // Handle form submission logic here
      await apiClient.put(`/statement-rule/${selectedMandateRule._id}`, values);

      await dispatch(fetchStatementRules());

      setMessage("Edited Successfully");
      toast.success("Statement Updated successfully");
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
          <StatementRuleForm
            formTitle={"Edit Statement Rule"}
            handleSubmit={handleUpdateStatementRule}
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

EditStatementRule.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  selectedMandateRule: PropTypes.object,
};

export default EditStatementRule;
