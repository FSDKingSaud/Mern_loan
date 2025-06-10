import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import updateDirectDebit from "./functions/updateDirectDebit";
import PageLoader from "../../shared/PageLoader";

const DirectDebitModal = ({ show, handleClose, customer }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  // handle decline direct debit request
  const handleDecline = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/api/direct-debit/update-direct-debit-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customer.customer._id,
            directDebitStatus: "declined",
            isDebitProcessed: false,
            mandateObj: { message: "Direct debit request declined" },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json(); // Parse JSON response
        console.log("Direct debit request declined successfully");
        setLoading(false);
        handleClose();
        console.log(data);
      } else {
        const errorData = await response.json(); // Parse error response
        console.error("Failed to decline direct debit request:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error declining direct debit request:", error.message);
      setLoading(false);
    }
  };

  // handle process direct debit request
  const handleProcess = async () => {
    setLoading(true);

    // check if start date and end date are empty
    if (!startDate || !endDate) {
      setLoading(false);
      return alert("Please select start date and end date");
    }
    
    try {
      const bodyData = {
        customer,
        startDate,
        endDate,
      };

      const response = await fetch(
        `${apiUrl}/api/direct-debit/create-direct-debit-mandate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      );

      if (response.ok) {
        // call updateDirectDebit function later
        const data = await response.json(); // Parse JSON response
        console.log("Direct debit request processed successfully");
        setLoading(false);
        handleClose();
        console.log(data);
      } else {
        const errorData = await response.json(); // Parse error response
        console.error("Failed to process direct debit request:", errorData);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing direct debit request:", error.message);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Direct Debit Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              value={`${customer.customer.firstname} ${customer.customer.lastname}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={customer.customer.salaryaccountnumber}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="text"
              value={`N${customer.loantotalrepayment}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Monthly Repayment Amount</Form.Label>
            <Form.Control
              type="text"
              value={`N${customer.monthlyrepayment}`}
              readOnly
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repayment Mode </Form.Label>
            <Form.Control type="text" value="Monthly" readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Repayment Number of Months </Form.Label>
            <Form.Control type="text" value={customer.numberofmonth} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direct Debit Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Direct Debit End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Form>

        {loading && <PageLoader width="80px" />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDecline}>
          Decline Mandate
        </Button>
        <Button variant="primary" onClick={handleProcess}>
          Create Mandate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DirectDebitModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  customer: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    salaryaccountnumber: PropTypes.string,
    loantotalrepayment: PropTypes.number,
  }).isRequired,
};

export default DirectDebitModal;
