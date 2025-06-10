import PropTypes from "prop-types"
import { Modal, Button } from "react-bootstrap";
import Headline from "../../../shared/Headline";
import RowCard from "../remita/RowCard";

const CheckCustomerDetails = ({
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
            <Headline text="Customer Details" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RowCard
            title="Customer's Name:"
            text={loanObj && loanObj.OtherName ? loanObj.OtherName + " " + loanObj.LastName : ""}
          />
          <RowCard
            title="BVN Number:"
            text={loanObj ? loanObj.BankVerificationNumber : ""}
          />
          <RowCard
            title="Phone Number:"
            text={loanObj ? loanObj.PhoneNumber : ""}
          />
          <RowCard title="Email:" text={loanObj ? loanObj.Email : ""} />
          <RowCard title="Address:" text={loanObj ? loanObj.Address : ""} />
          <hr />
          <RowCard
            title="Account Number:"
            text={
              loanObj && loanObj.Accounts && loanObj.Accounts[0]
                ? loanObj.Accounts[0].AccountNumber
                : ""
            }
          />
          <RowCard
            title="Account Type:"
            text={
              loanObj && loanObj.Accounts && loanObj.Accounts[0]
                ? loanObj.Accounts[0].AccountType
                : ""
            }
          />
          <RowCard
            title="Date Created:"
            text={
              loanObj && loanObj.Accounts && loanObj.Accounts[0]
                ? loanObj.Accounts[0].DateCreated
                : ""
            }
          />
          <RowCard
            title="Last Activity Date:"
            text={
              loanObj && loanObj.Accounts && loanObj.Accounts[0]
                ? loanObj.Accounts[0].LastActivityDate
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

CheckCustomerDetails.propTypes = {
  handleClose: PropTypes.any,
  loanObj: PropTypes.shape({
    Accounts: PropTypes.any,
    Address: PropTypes.any,
    BankVerificationNumber: PropTypes.any,
    Email: PropTypes.any,
    LastName: PropTypes.any,
    OtherName: PropTypes.string,
    PhoneNumber: PropTypes.any
  }),
  show: PropTypes.any
}

export default CheckCustomerDetails;
