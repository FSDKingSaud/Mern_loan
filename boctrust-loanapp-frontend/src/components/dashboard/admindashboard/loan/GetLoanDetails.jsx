import PropTypes from "prop-types"
import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import RowCard from "../remita/RowCard";

const GetLoanDetails = ({
  loanObj,
  show,
  handleClose,
}) => {
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
            <Headline text="Loan Account Details" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RowCard
            title="Customer's Name:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].Name : " "}
          />
          <RowCard
            title="Number:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].Number : ""}
          />
          <RowCard
            title="Customer's ID:"
            text={loanObj ? loanObj.CustomerIDInString : ""}
          />
          <RowCard
            title="Account Officer:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].AccountOfficer : ""}
          />
          <hr />
          <RowCard
            title="Loan Amount:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].LoanAmount : ""}
          />
          <RowCard
            title="Loan Cycle:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].Loancycle : ""}
          />
          <RowCard
            title="Loan Balance:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].BalanceInNairy : ""}
          />
          <RowCard
            title="Interest Rate:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].InterestRate : ""}
          />
          <hr />
          <RowCard
            title="Date Created:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].DateCreated : ""}
          />
          <RowCard
            title="Status:"
            text={loanObj && loanObj.Message && loanObj.Message[0] ? loanObj.Message[0].RealLoanStatus : ""}
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

GetLoanDetails.propTypes = {
  currentPage: PropTypes.string,
  handleApproval: PropTypes.any,
  handleClose: PropTypes.any,
  loanObj: PropTypes.shape({
    CustomerIDInString: PropTypes.string,
    Message: PropTypes.any
  }),
  show: PropTypes.any
}

export default GetLoanDetails;
