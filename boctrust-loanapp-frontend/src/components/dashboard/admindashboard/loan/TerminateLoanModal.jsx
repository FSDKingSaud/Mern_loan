import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import PageLoader from "../../shared/PageLoader";

const TerminateLoanModal = ({
  show,
  handleClose,
  isLoading,
  handleProceed,
}) => {
  const currentUser = useSelector((state) => state.adminAuth.user);

  return (
    <div>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>{"Confirm Manual Termination"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>I have terminated the loan manually </p>
          <div className="sec__item">
            <strong>Staff Name: </strong>
            <strong>{currentUser.fullName}</strong>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="primary"
            onClick={handleProceed}
          >
            Proceed {isLoading && <PageLoader width="18px" />}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TerminateLoanModal;
