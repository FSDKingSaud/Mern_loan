/* eslint-disable react/prop-types */

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const ViewContact = (props) => {
  const contact = props.data;

  console.log("details", contact);
  // close model box
  const handleClose = () => {
    props.onHide();
  };

  const styles = {
    span: {
      fontWeight: "bold",
      color: "black",
      marginLeft: "40px",
    },
    text: {
      padding: "1.3rem",
    },
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
          Answer Wiki/Support
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* edit form */}
        <div>
          <div className="FieldGroup">
            <p>
              Subject: <span style={styles.span}>{contact.subject}</span>
            </p>
            <p>
              Full Name: <span style={styles.span}>{contact.fullName}</span>
            </p>
            <p>
              Phone Number:{" "}
              <span style={styles.span}>{contact.phoneNumber}</span>
            </p>
            <p>
              Email: <span style={styles.span}>{contact.email}</span>
            </p>
          </div>

          <div className="FieldGroup">
            <label htmlFor="message">Message</label>
            <textarea
              rows="10"
              name="message"
              id="message"
              value={contact.message}
              readOnly
              style={styles.text}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewContact;
