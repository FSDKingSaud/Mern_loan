import PropTypes from "prop-types";

import Modal from "react-bootstrap/Modal";

const NoticeModal = ({ show, setShow }) => {
  const styles = {
    body: {
      position: "relative",
      padding: "0",
    },
    image: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
    },
  };

  return (
    <>
      <Modal
        onHide={() => setShow(false)}
        show={show}
        backdrop="static"
        keyboard={false}
        className="notice__modal"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body style={styles.body}>
          <img
            style={styles.image}
            src="/images/boctrust_notice.jpg"
            alt="boctrust_notice"
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

NoticeModal.propTypes = {
  setFirstStepData: PropTypes.func,
  setShow: PropTypes.func,
  show: PropTypes.bool,
};

export default NoticeModal;
