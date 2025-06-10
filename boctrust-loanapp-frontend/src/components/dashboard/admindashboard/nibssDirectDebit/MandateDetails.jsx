import React from "react";
import "./debit.css";
import { format } from "date-fns";

const MandateDetails = ({ mandateDetails }) => {
  return (
    <div>
      <div className="section__div">
        <h5>Loan Details</h5>
        <div className="detail__line">
          <span>Loan Account: </span>
          <span className="emp">{mandateDetails?.loan?.loanAccountNumber}</span>
        </div>
        <div className="detail__line">
          <span>Loan Amount: </span>
          <span className="emp">{mandateDetails?.loan?.loanamount}</span>
        </div>
      </div>
      <div className="section__div">
        <h5>Mandate Details: </h5>
        <div className="detail__line">
          <span>Start Date: </span>
          <span className="emp">
            {mandateDetails?.startDate &&
              format(mandateDetails?.startDate, "do MMM yyyy, hh:mm aaa")}
          </span>
        </div>
        <div className="detail__line">
          <span>End Date: </span>
          <span className="emp">
            {mandateDetails?.endDate &&
              format(mandateDetails?.endDate, "do MMM yyyy, hh:mm aaa")}
          </span>
        </div>
        <hr />
        <div className="sub__section">
          <div className="detail__line">
            <span>Debit Mandate Status: </span>
            <span className="emp">{mandateDetails?.debitMandate?.status}</span>
          </div>
          <div className="detail__line">
            <span>Debit Mandate Active: </span>
            <span className="emp">
              {mandateDetails?.debitMandate?.isActive?.toString()}
            </span>
          </div>
          <div className="detail__line">
            <span>Debit Mandate code: </span>
            <span className="emp">{mandateDetails?.debitMandate?.code}</span>
          </div>
        </div>
        <hr />
        <div className="sub__section">
          <div className="detail__line">
            <span>Balance Mandate Status: </span>
            <span className="emp">
              {mandateDetails?.balanceMandate?.status}
            </span>
          </div>
          <div className="detail__line">
            <span>Balance Mandate Active: </span>
            <span className="emp">
              {mandateDetails?.balanceMandate?.isActive?.toString()}
            </span>
          </div>
          <div className="detail__line">
            <span>Balance Mandate code: </span>
            <span className="emp">{mandateDetails?.balanceMandate?.code}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandateDetails;
