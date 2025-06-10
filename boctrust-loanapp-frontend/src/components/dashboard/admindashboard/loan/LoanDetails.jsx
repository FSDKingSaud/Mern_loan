import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import RowCard from "../remita/RowCard";
import DisplayLoanProductName from "../../shared/DisplayLoanProductName";

import PageLoader from "../../shared/PageLoader";
import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";

const LoanDetails = ({
  loanObj,
  show,
  handleClose,
  canManage,
}) => {
  // Base URL for API
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const [startDate, setStartDate] = useState(loanObj.startDate || "");
  const [endDate, setEndDate] = useState(loanObj.endDate || "");
  const [isLoading, setIsLoading] = useState(false)

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // approve direct debit
  const handleApproval = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.");
      return;
    }

    setIsLoading(true);

    const data = {
      startDate,
      endDate,
      customerId: loanObj._id,
    };

    try {
      const response = await fetch(`${apiUrl}/api/direct-debit/create-mandate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error creating mandate:", responseData);
        toast.error(`Error: ${responseData.error || "Failed to create mandate"}`);
        setIsLoading(false);
        return;
      }

      toast.success("Mandate created successfully!")
      setIsLoading(false);
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.details.message);
      setIsLoading(false);
    } 
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Headline
              text={
                loanObj.customer?.banking?.accountDetails?.CustomerName ||
                `${loanObj?.customer?.firstname} ${loanObj?.customer?.lastname}`
              }
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RowCard
            title="Loan ID:"
            text={loanObj.customer?.banking?.accountDetails?.CustomerID}
          />
          <hr />
          <RowCard title="Valid BVN:" text={loanObj.customer?.bvnnumber} />
          <hr />
          <RowCard title="KYC:" text="Completed" />
          <hr />
          <RowCard
            title="Loan Product:"
            text={<DisplayLoanProductName loan={loanObj} />}
          />
          <hr />
          <RowCard title="Loan Amount:" text={loanObj.loanamount} />
          <hr />
          <RowCard title="Total Repayment:" text={loanObj.loantotalrepayment} />
          <hr />
          <RowCard title="Repayment Month:" text={loanObj.numberofmonth} />
          <hr />
          <RowCard title="Loan Status:" text={loanObj.loanstatus} />
          <hr />
          <div className="mb-3">
            <Form.Group controlId="startDate">
              <Form.Label>Start Date:</Form.Label>
              <Form.Control
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </Form.Group>
          </div>
          <div className="mb-3">
            <Form.Group controlId="endDate">
              <Form.Label>End Date:</Form.Label>
              <Form.Control
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
        

            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {isLoading ? <PageLoader width="18px"/> : 
              <div>
                  {canManage && (
                    <Button onClick={handleApproval} variant="primary">
                      Approve
                    </Button>
                  )}
              </div>}
           
        </Modal.Footer>
      </Modal>
       <ToastContainer />
    </>
  );
};

LoanDetails.propTypes = {
  handleClose: PropTypes.func,
  show: PropTypes.bool,
  canManage: PropTypes.string,
  loanObj: PropTypes.shape({
    customer: PropTypes.object,
    loanamount: PropTypes.number,
    loantotalrepayment: PropTypes.number,
    numberofmonth: PropTypes.number,
    loanstatus: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
};

export default LoanDetails;
