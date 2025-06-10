/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import LabeledSelect from "../../../../shared/labeledInput/LabeledSelect";
import LabeledInput from "../../../../shared/labeledInput/LabeledInput";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Modal } from "react-bootstrap";
import "./TransferMoney.css";
import PageLoader from "../../../shared/PageLoader";

import apiClient from "../../../../../lib/axios";
import { MdEdit } from "react-icons/md";

const TransferMoney = ({
  isReadonly,
  setIsReadonly,
  show,
  debitAccounts,
  loanObj,
  btnText = "Send",
  action,
  handleClose,
}) => {
  const [userDetails, setUserDetails] = useState({
    debitAccount: "",
    creditAccount: loanObj?.customer?.salaryaccountnumber,
    amount: loanObj.loanamount,
    notes: loanObj?.debursementDetails?.notes,
  });
  const [creditAccountName, setCreditAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await apiClient.post(`/bankone/accountNameEnquiry`, {
          bankCode: loanObj?.customer?.bankcode,
          accountNumber: loanObj?.customer?.salaryaccountnumber,
        });

        setCreditAccountName(response.data?.Name);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, [loanObj?.customer?.bankcode, loanObj?.customer?.salaryaccountnumber]);

  useEffect(() => {
    if (loanObj?.debursementDetails?.debitAccount) {
      setUserDetails({
        ...userDetails,
        debitAccount: loanObj?.debursementDetails?.debitAccount,
      });
    }
  }, [loanObj?.debursementDetails?.debitAccount]);

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
        ...userDetails,
        creditAccountName,
      });
      handleClose();
    } catch (error) {
      toast.error(error.message);
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
          <DashboardHeadline>Transfer to other banks</DashboardHeadline>
          <button onClick={handleClose} className="btn btn-light close-btn">
            <IoClose size={20} color="rgb(244 63 94)" />
          </button>
          {isReadonly && (
            <div className="d-flex justify-content-end">
              <button
                onClick={() => setIsReadonly(false)}
                type="button"
                className="btn btn-outline-dark"
              >
                <MdEdit /> Update
              </button>
            </div>
          )}
          {debitAccounts ? (
            <form onSubmit={handleProceed} className="form__wrapper">
              <div className="form__row">
                <div>
                  <LabeledSelect
                    data={debitAccounts}
                    label="Debit Account"
                    name="debitAccount"
                    value={userDetails.debitAccount}
                    onSelect={handleOnchange}
                    disabled={isReadonly}
                  />
                  <span className="credit_accountName"></span>
                </div>
                <div>
                  <LabeledInput
                    label="Credit Account"
                    name="creditAccount"
                    value={userDetails.creditAccount}
                    setInputValue={handleOnchange}
                    disabled
                  />
                  <span className="credit_accountName">
                    {creditAccountName}
                  </span>
                </div>
              </div>

              <div className="form__row">
                <LabeledInput
                  label="Amount "
                  name="amount"
                  value={userDetails.amount}
                  setInputValue={handleOnchange}
                  disabled={isReadonly}
                />
                <LabeledInput
                  label="Note"
                  name="notes"
                  value={userDetails.notes}
                  setInputValue={handleOnchange}
                  disabled={isReadonly}
                />
              </div>

              <button disabled={isLoading} className="gold__gradientBtn">
                <span className="d-flex">
                  {btnText}
                  {isLoading && <PageLoader strokeColor="white" width="20px" />}
                </span>
              </button>
            </form>
          ) : (
            <PageLoader />
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TransferMoney;
