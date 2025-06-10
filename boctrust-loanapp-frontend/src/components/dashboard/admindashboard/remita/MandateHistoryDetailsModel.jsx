/* eslint-disable react/prop-types */
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DetailsCard from "./DetailsCard";
import PageLoader from "../../shared/PageLoader";
import "./Remita.css";

const LoanDetailModel = (props) => {
  const customer = props.customer;
  const customerData = customer?.data;

  // close model box
  const handleClose = () => {
    props.onHide();
  };

  // check if customer object is empty
  if (Object.keys(customer).length === 0) {
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
            Customer mandate data not available. Try again
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <PageLoader />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

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
          {customerData?.data?.firstName} {customerData?.data?.lastName} Mandate History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* details section */}
        <div className="row">
          <div className="col-sm12 col-md-6 left-col">
            <DetailsCard title="Customer ID" text={customerData?.data?.customerId} />

            <DetailsCard
              title="Salary Account Number"
              text={customerData.data.salaryAccount}
            />

            <DetailsCard
              title="Salary Account Bank"
              text={customerData.data.salaryBankCode}
            />

            <DetailsCard
              title="Mandate Reference"
              text={customerData.data.loanMandateReference}
            />

            <DetailsCard title="Lender" text={customerData.data.lenderDetails} />

            <DetailsCard
              title="Total Disbursed"
              text={`N${customerData?.data?.totalDisbursed || "0.00"}`}
            />

            <DetailsCard
              title="Outstanding Balance"
              text={`N${customerData?.data?.outstandingLoanBal || "0.00"}`}
            />
          </div>
          <div className="col-sm12 col-md-6">
            <DetailsCard title="Status" text={customerData?.data.status} />

            <DetailsCard
              title="Disbursement Bank"
              text={customerData?.data?.disbursementAccountBank}
            />

            <DetailsCard
              title="Disbursement Account Number"
              text={customerData?.data?.disbursementAccount}
            />

            <DetailsCard title="Total Collection amount" text={customerData?.data?.repayment || "0.00"} />

            <DetailsCard
              title="Date of Disbursement"
              text={customerData?.data?.dateOfDisbursement.slice(0, 10)}
            />

            <DetailsCard
              title="Date of Collection Start"
              text={customerData?.data?.collectionStartDate.slice(0, 10)}
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

export default LoanDetailModel;
