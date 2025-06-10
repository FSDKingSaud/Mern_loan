import React, { useRef } from "react";
import { Modal } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import BocButton from "../../../shared/BocButton";
import { handleCopy } from "../../../../../../utilities/handleCopy";
import { toast } from "react-toastify";
import { handleExportToExcel } from "../../../../../../utilities/handleExportToExcel";
import { handleExportToPDF } from "../../../../../../utilities/handleExportToPDF";
import { handlePrint } from "../../../../../../utilities/handlePrint";
import PageLoader from "../../../shared/PageLoader";
import ReportDetails from "../../../dashboardcomponents/report/ReportDetails";
import "../transferMoney/TransferMoney.css";

const LoanStatementModal = ({
  show,
  accountStatement,
  handleClose,
  isLoading,
}) => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "2rem 0 0 0.9rem",
    },
    input: {
      width: "300px",
    },
  };
  const printRef = useRef();

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Body>
        <div className="transfer__container">
          <button onClick={handleClose} className="btn btn-light close-btn">
            <IoClose size={20} color="rgb(244 63 94)" />
          </button>
          {!isLoading ? (
            <div>
              <div style={styles.container}>
                <BocButton
                  bgcolor="#636363"
                  bradius="22px"
                  width="90px"
                  margin="0 8px"
                  func={() => {
                    if (accountStatement) {
                      handleCopy(JSON.stringify(accountStatement), () => {
                        toast.success("Items Copied to Clipboard");
                      });
                    }
                  }}
                >
                  Copy
                </BocButton>
                <BocButton
                  bgcolor="#636363"
                  bradius="22px"
                  width="90px"
                  margin="0 8px"
                  func={() => {
                    if (accountStatement) {
                      handleExportToExcel(
                        accountStatement,
                        "Account_Statement"
                      );
                    }
                  }}
                >
                  Excel
                </BocButton>
                <BocButton
                  bgcolor="#636363"
                  bradius="22px"
                  width="90px"
                  margin="0 8px"
                  func={() => {
                    if (accountStatement) {
                      handleExportToPDF({
                        filename: "Account_Statement_PDF",
                        tableId: "accountStatementTable",
                      });
                    }
                  }}
                >
                  PDF
                </BocButton>
                <BocButton
                  bgcolor="#636363"
                  bradius="22px"
                  width="90px"
                  margin="0 8px"
                  func={() => {
                    if (accountStatement) {
                      handlePrint("Account Statement Print", printRef);
                    }
                  }}
                >
                  Print
                </BocButton>
              </div>
              <ReportDetails
                printRef={printRef}
                isLoading={isLoading}
                accountStatement={accountStatement}
              />
            </div>
          ) : (
            <PageLoader />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoanStatementModal;
