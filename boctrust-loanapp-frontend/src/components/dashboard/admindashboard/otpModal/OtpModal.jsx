import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import apiClient from "../../../../lib/axios";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";

const OtpModal = ({
  showModal,
  email,
  username,
  path = "/admin/complete-registration",
  otpVerificationSucc,
  handleCloseModal
}) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.post(path, {
        otp,
        email,
        username,
      });
      otpVerificationSucc(data);
      console.log("Verification Successfull:", data);
      setIsLoading(false);
      handleCloseModal();
    } catch (error) {
      toast.error(error?.response?.data?.error || "could not verify otp");
      console.error("Error in Verification:", error);
      setIsLoading(false);
    }
  };

  return (
    <Modal show={showModal} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Enter OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="loanAmount">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!otp || isLoading}
          className="d-flex"
        >
          Verify OTP {isLoading && <PageLoader width="18px" />}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OtpModal;
