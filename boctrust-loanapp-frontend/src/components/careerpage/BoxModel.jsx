/* eslint-disable no-undef */
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import "./Career.css";

const BoxModel = (props) => {
  const { jobtitle, description, deadline, dateposted } =
    props.vacancy;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{jobtitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>
          Posted on: {dateposted} | Ending: {deadline}
        </h4>
        <p>{description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className="BtnApply" onClick={props.handleApply}>
          Start your Application
        </Button>
        <Button className="BtnClose" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

BoxModel.propTypes = {
  onHide: PropTypes.func,
  vacancy: PropTypes.object,
  handleApply: PropTypes.func,
};

export default BoxModel;
