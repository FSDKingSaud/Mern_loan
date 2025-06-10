import React, { useEffect, useState } from "react";
import apiClient from "../../../../lib/axios";
import MandateDetails from "../nibssDirectDebit/MandateDetails";
import BanlanceEnquiry from "../nibssDirectDebit/BanlanceEnquiry";
import PerformDirectDebit from "../nibssDirectDebit/PerformDirectDebit";
import TransactionSuccess from "../nibssDirectDebit/TransactionSuccess";
import PageLoader from "../../shared/PageLoader";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import Headline from "../../../shared/Headline";

const DirectDebitModal = ({ show, handleClose, repaymentSchedule, loanId }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFT, setIsLoadingFT] = useState(false);
  const [mandateDetails, setMandateDetails] = useState(null);
  const [selectedRepaymentId, setSelectedRepaymentId] = useState(
    repaymentSchedule?.map((item) => item.Id)
  );

  const [accoutBalance, setAccoutBalance] = useState(null);
  const [nameEnquiryResponse, setNameEnquiryResponse] = useState(null);

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await apiClient.get(`/nibss/by-loanId/${loanId}`);

        setMandateDetails(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  const makeBalanceEnquiry = async () => {
    try {
      setIsLoading(true);
      const { data } = await apiClient.get(
        `nibss/name-enquiry/${mandateDetails._id}`
      );
      setNameEnquiryResponse(data);
      const { data: balanceResponse } = await apiClient.get(
        `nibss/balance-enquiry/${mandateDetails._id}?targetAccountNumber=${data.accountNumber}&targetBankVerificationNumber=${data.bankVerificationNumber}&targetAccountName=${data.accountName}&destinationInstitutionCode=${data.destinationInstitutionCode}`
      );
      setAccoutBalance(balanceResponse);
      console.log(balanceResponse, "balanceResponse");
      setStep(2);
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const performFundTransfer = async () => {
    setIsLoadingFT(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        setIsLoading(true);

        await apiClient.post(`/nibss/perform-debit`, {
          mandateId: mandateDetails._id,
          amount,
          originatorKYCLevel: nameEnquiryResponse.kycLevel,
          nameEnquiryRef: nameEnquiryResponse.transactionId,
          accountName: nameEnquiryResponse.accountName,
          accountNumber: nameEnquiryResponse.accountNumber,
          originatorBankVerificationNumber:
            nameEnquiryResponse.bankVerificationNumber,
          repaymentIds: selectedRepaymentId,
          transactionLocation: `${position.coords.latitude} ${position.coords.longitude}`,
        });

        toast.success("Transaction Successful!");
        setStep((curr) => curr + 1);
      } catch (error) {
        toast.error(error?.response?.data?.error || "Something went Wrong");
      } finally {
        setIsLoading(false);
        setIsLoadingFT(false);
      }
    });
  };

  const proceedToDebit = () => {
    if (repaymentSchedule) {
      setStep(3);
    }
  };

  const handleSelectAction = async () => {
    step === 1
      ? await makeBalanceEnquiry()
      : step === 2
      ? proceedToDebit()
      : step === 3
      ? performFundTransfer()
      : handleClose();
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="booking__modal"
      >
        <Modal.Header closeButton>
          <div>
            <Modal.Title>
              <h4>Processing Debit </h4>
              {mandateDetails?.customer && (
                <Headline
                  text={
                    mandateDetails?.customer?.banking?.accountDetails
                      ?.CustomerName ||
                    `${mandateDetails?.customer?.firstname} ${mandateDetails?.customer?.lastname}`
                  }
                />
              )}
            </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <PageLoader width="70px" />
          ) : step == 1 && mandateDetails ? (
            <MandateDetails mandateDetails={mandateDetails} />
          ) : step == 1 && !mandateDetails ? (
            <div>
              <p>Mandate Not Created yet</p>
            </div>
          ) : step == 2 && accoutBalance ? (
            <BanlanceEnquiry accoutBalance={accoutBalance} />
          ) : step === 3 ? (
            <PerformDirectDebit
              setAmount={setAmount}
              originatorKYCLevel={nameEnquiryResponse.kycLevel}
              nameEnquiryRef={nameEnquiryResponse.transactionId}
              mandateId={mandateDetails._id}
              accountName={nameEnquiryResponse.accountName}
              amount={amount}
              repaymentSchedule={repaymentSchedule}
              selectedRepaymentId={selectedRepaymentId}
              setSelectedRepaymentId={setSelectedRepaymentId}
            />
          ) : (
            <TransactionSuccess />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Button
            disabled={isLoading || isLoadingFT || step == 1 && !mandateDetails || !selectedRepaymentId}
            onClick={handleSelectAction}
            variant="primary"
            className="d-flex"
          >
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DirectDebitModal;
