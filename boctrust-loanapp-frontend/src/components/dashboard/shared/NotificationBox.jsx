import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const NotificationBox = ({message, handleClose, show }) => {
  return (
    <>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title> Action Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

NotificationBox.propTypes = {
  message: PropTypes.string,
  handleClose: PropTypes.func,
  show: PropTypes.bool,
};

export default NotificationBox;
