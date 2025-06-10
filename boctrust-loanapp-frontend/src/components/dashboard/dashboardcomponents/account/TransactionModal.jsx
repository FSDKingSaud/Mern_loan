/* eslint-disable no-undef */
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";
import styles from "./TransactionStyles.module.css";

const TransactionModal = ({ handleClose, selectedTransaction }) => {
  return (
    <>
      <Modal
        show={selectedTransaction}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modal__body}>
          <div className={styles.modal__topSection}>
            <div >
              <h5>
                {selectedTransaction?.RecordType === "Credit" ? "+" : "-"}
                {nigerianCurrencyFormat.format(
                  selectedTransaction?.Amount / 100
                )}
              </h5>
              <span>{selectedTransaction?.PostingType}</span>
            </div>

            <div>
              {selectedTransaction?.status === "Successful" ? (
                <span className="badge_success">
                  {selectedTransaction?.status}
                </span>
              ) : (
                <span className="badge_pending">
                  {selectedTransaction?.status}
                </span>
              )}
            </div>
          </div>

          <div className={styles.more__details}>
            <div>
              <p>Account Number</p>
              <h6>{selectedTransaction?.AccountNumber || "NIL"}</h6>
            </div>
            <div>
              <p>Transaction Date</p>
              <h6>{selectedTransaction?.TransactionDateString || "NIL"}</h6>
            </div>
            <div>
              <p>Narration</p>
              <h6>{selectedTransaction?.Narration || "NIL"}</h6>
            </div>
            <div>
              <p>ReferenceID</p>
              <h6>{selectedTransaction?.ReferenceID || "NIL"}</h6>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

TransactionModal.propTypes = {
  handleClose: PropTypes.func,
  selectedTransaction: PropTypes.object,
};

export default TransactionModal;
