import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import RowCard from "../remita/RowCard";

const LoanBalanceDetails = ({ loanObj, show, handleClose, fullName }) => {
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
            <Headline text="Loan Balance Details" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RowCard title="Customer's Name:" text={fullName ? fullName : ""} />
          <RowCard
            title="Account Number:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0].LoanAccountNo
                : ""
            }
          />
          <RowCard
            title="Account Balance:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0].AccountBalance
                : ""
            }
          />
          <RowCard
            title="Interest Not Paid:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0].InterestNoYetDue
                : ""
            }
          />
          <hr />
          <RowCard
            title="Principal Paid Till Date:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0].PrincipalPaidTillDate
                : ""
            }
          />
          <RowCard
            title="Total Amount Paid Till Date:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0]?.TotalAmountPaidTillDate
                : ""
            }
          />
          <RowCard
            title="Total Outstanding:"
            text={
              loanObj && loanObj.Message && loanObj.Message[0]
                ? loanObj.Message[0]?.TotalOutstandingAmount
                : ""
            }
          />
          <hr />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

LoanBalanceDetails.propTypes = {
  fullName: PropTypes.string,
  handleClose: PropTypes.any,
  loanObj: PropTypes.shape({
    Message: PropTypes.string
  }),
  show: PropTypes.any
}


export default LoanBalanceDetails;
