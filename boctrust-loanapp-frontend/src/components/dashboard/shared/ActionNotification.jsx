import PropTypes from "prop-types";
// import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ActionNotification = ({handleProceed, handleClose, show}) => {
    
  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title> Action Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure, you want to complete this action?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceed}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

ActionNotification.propTypes = {
    handleProceed: PropTypes.func,
    handleClose: PropTypes.func,
    show: PropTypes.bool,
};

export default ActionNotification;
