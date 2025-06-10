/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import DetailsCard from "./DetailsCard";
import PageLoader from "../../shared/PageLoader";
import updateSalaryHistory from "./updateSalaryHistory.js";
import "./Remita.css";

import sendSMS from "../../../../../utilities/sendSms.js";
import sendEmail from "../../../../../utilities/sendEmail.js";
import EmailTemplate from "../../../shared/EmailTemplate.jsx";
import ReactDOMServer from "react-dom/server";
import apiClient from "../../../../lib/axios.js";
import { toast, ToastContainer } from "react-toastify";
// toast styles
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllLoans } from "../../../../redux/reducers/loanReducer.js";

const LoanDetailModel = (props) => {
  const apiUrl = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();

  // current login admin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  const customerLoan = props.customer;
  const customer = customerLoan?.customer;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const [canUserApprove, setCanUserApprove] = useState(false);

  useEffect(() => {
    setCanUserApprove(currentUser?.userRole?.can.includes("approveRemitaLoan"));
  }, [currentUser]);

  // close model box
  const handleClose = () => {
    props.onHide();
  };

  // send email notification
  const handleSendEmail = () => {
    const emailTemplateHtml = ReactDOMServer.renderToString(
      <EmailTemplate
        firstName={customer.firstname}
        content=" Your loan application has been approved."
      />
    );
    const options = {
      email: customer.email,
      subject: "Loan Application Notification",
      html: emailTemplateHtml,
    };
    sendEmail(options);
  };

  // submit update to api endpoint
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setIsLoading(true);

      // get customer history from remita
      const { data: disbursement } = await apiClient.post(
        `/remita/loan-disbursement-notification`,
        {
          loanId: customerLoan._id,
        }
      );

      if (disbursement.data.status === "success") {
        // send sms notification to customer
        // sendSMS(
        //   customer.phone,
        //   `Dear ${customer.firstname}, your loan application has been approved.`
        // );

        // send email notification to customer
        // handleSendEmail();

        await dispatch(fetchAllLoans());

        // show notification
        toast.success(disbursement.data.responseMsg);

        handleClose();
      } else {
        toast.error(disbursement.data.responseMsg);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Cannot Perform Request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectLoan = async (loanId) => {
    try {
      setIsLoadingReject(true);

      await updateSalaryHistory(loanId, "rejected");
      await dispatch(fetchAllLoans());
      toast.success("Loan Rejected Successfully");
      handleClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Cannot Perform Request");
    } finally {
      setIsLoadingReject(false);
    }
  };

  return (
    <>
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
            {customer.firstname} {customer.lastname} Loan Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* details section */}
          <div className="row">
            <div className="col-sm12 col-md-6 left-col">
              <DetailsCard
                title="Disbursement Account Number"
                text={
                  customer.disbursementaccountnumber ||
                  customer.salaryaccountnumber
                }
              />
              <DetailsCard
                title="Disbursement Bank"
                text={
                  customer.disbursementbankname || customer.salaryaccountname
                }
              />

              <DetailsCard title="Income from employer" text="N250,000" />

              <DetailsCard
                title="Loan Amount"
                text={`N${customerLoan.loanamount || "0.00"}`}
              />

              <DetailsCard
                title="Collection Amount"
                text={`N${customerLoan.loantotalrepayment || "0.00"}`}
              />
            </div>
            <div className="col-sm12 col-md-6">
              <DetailsCard
                title="Date of Disbursement"
                text="23-02-2023 .  16:49"
              />

              <DetailsCard
                title="Date of Collection"
                text="23-03-2025 .  17:25"
              />

              <DetailsCard title="Total Collection amount" text="N122,500" />

              <DetailsCard title="Number of Repayements" text="2" />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {isLoading && <PageLoader />}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {canUserApprove &&
            customerLoan?.remita?.remitaStatus === "disbursement_notice" && (
              <>
                <Button
                  disabled={
                    customerLoan?.remita?.remitaStatus !== "disbursement_notice"
                  }
                  className="btn btn-danger"
                  type="button"
                  onClick={handleRejectLoan}
                >
                  Reject Loan
                </Button>
                <Button
                  disabled={
                    customerLoan?.remita?.remitaStatus !== "disbursement_notice"
                  }
                  variant="primary"
                  type="button"
                  onClick={handleSubmit}
                >
                  Approve Loan
                </Button>
              </>
            )}
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default LoanDetailModel;
