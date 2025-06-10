/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import styles from "./Repayment.module.css";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Modal } from "react-bootstrap";
import PageLoader from "../../shared/PageLoader";
import apiClient from "../../../../lib/axios";
import DashboardHeadline from "../../shared/DashboardHeadline";
import LabeledInput from "../../../shared/labeledInput/LabeledInput";

const RepayLoanFromSalaryModal = ({
  show,
  btnText = "Send",
  action,
  handleClose,
  repaymentScheduleObj,
}) => {
  const [userDetails, setUserDetails] = useState({
    debitAccount: "",
    debitAccountName: "",
    notes: "",
    loanId: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const { data } = await apiClient.get(
        `/loans/getLoanFromAccountNumber/${repaymentScheduleObj.AccountNumber}`
      );

      setUserDetails({
        ...userDetails,
        debitAccount: data.customer?.salaryaccountnumber,
        debitAccountName: data.customer?.salaryaccountname,
        loanId: data._id,
      });
    };

    getData();
  }, []);

  const handleOnchange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await action({
        repaymentScheduleId: repaymentScheduleObj.Id,
        notes: userDetails.notes,
        loanId: userDetails.loanId,
      });

      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Something went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

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
          <DashboardHeadline>Repay Loan from Salary Account</DashboardHeadline>
          <button onClick={handleClose} className="btn btn-light close-btn">
            <IoClose size={20} color="rgb(244 63 94)" />
          </button>

          {userDetails.debitAccount ? (
            <>
              <div className={styles.grid__wrap}>
                <div className="">
                  <p>Account Number:</p>
                  <span>{repaymentScheduleObj.AccountNumber}</span>
                </div>
                <div>
                  <p>Payment Due Date:</p>
                  <span>{repaymentScheduleObj.PaymentDueDate}</span>
                </div>

                <div>
                  <p>Interest:</p>
                  <span>{repaymentScheduleObj.Interest}</span>
                </div>
                <div>
                  <p>Total:</p>
                  <span>{repaymentScheduleObj.Total}</span>
                </div>
              </div>

              <form onSubmit={handleProceed} className="form__wrapper">
                <div className=" ">
                  <LabeledInput
                    label="Debit Account"
                    name="debitAccount"
                    value={userDetails.debitAccount}
                    setInputValue={handleOnchange}
                    disabled
                  />
                  <span className="credit_accountName">
                    {userDetails.debitAccountName}
                  </span>
                </div>

                <div>
                  <LabeledInput
                    label="Note"
                    name="notes"
                    value={userDetails.notes}
                    setInputValue={handleOnchange}
                  />
                </div>

                <button disabled={isLoading} className="gold__gradientBtn">
                  <span className="d-flex">
                    {btnText}
                    {isLoading && (
                      <PageLoader strokeColor="white" width="20px" />
                    )}
                  </span>
                </button>
              </form>
            </>
          ) : (
            <PageLoader width="70px" />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default RepayLoanFromSalaryModal;
