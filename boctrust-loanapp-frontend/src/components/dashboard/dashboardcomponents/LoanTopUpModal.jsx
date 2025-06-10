// top up loan modal
import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import "./LoanTopUp.css";
import PageLoader from "../shared/PageLoader";
import apiClient from "../../../lib/axios";

const LoanTopUpModal = ({ showModal, handleCloseModal, customerID }) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;
  const [loanAmount, setLoanAmount] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleLoanAmountChange = (e) => setLoanAmount(e.target.value);
  const handleRepaymentMonthsChange = (e) => setRepaymentMonths(e.target.value);

  const handleSubmit = async () => {
    setProcessing(true);

    const loanData = {
      loanAmount,
      loanDuration: repaymentMonths, // Ensure `repaymentMonths` is defined
      customerId: customerID, // Pass the valid customer ID
      note: "Top-up loan request", // Optional note
    };

    try {
      const { data } = await apiClient.post(
        `${apiUrl}/api/top-up/top-up-request`,
        loanData
      );

      console.log("Top-up loan request successful:", data);
      setProcessing(false);
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting top-up request:", error);
      setProcessing(false);
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCloseModal}
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Top Up Your Loan! Enjoy peace of mind</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="loanAmount">
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter loan amount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
              step={10000}
            />
          </Form.Group>

          <Form.Group controlId="repaymentMonths" className="mt-3">
            <Form.Label>Repayment Months</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter repayment months"
              value={repaymentMonths}
              onChange={handleRepaymentMonthsChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {processing && <PageLoader />}
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!loanAmount || !repaymentMonths}
        >
          Send Request
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanTopUpModal;
