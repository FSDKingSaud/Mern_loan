import React, { useState } from "react";
import PropTypes from "prop-types";
import RowCard from "./RowCard";
import Headline from "../../../shared/Headline";
import "./Remita.css";

const CheckSalaryDetails = ({ customerObj }) => {
  const customerData = customerObj?.remita?.remitaDetails?.data;

  // salary details list
  const salaryDetails =
    customerData?.salaryPaymentDetails?.length > 0
      ? customerData?.salaryPaymentDetails
      : [];

  // loan history details list
  const loanDetails =
    customerData?.loanHistoryDetails?.length > 0
      ? customerData?.loanHistoryDetails
      : [];

  const [filteredSalaryDetails, setFilteredSalaryDetails] = useState(
    salaryDetails.slice(0, 3)
  );
  const [filteredLoanDetails, setFilteredLoanDetails] = useState(
    loanDetails.slice(0, 3)
  );

  const handleMonthChange = (e) => {
    const selectedMonths = parseInt(e.target.value, 10);
    if (selectedMonths) {
      const filteredDetails = salaryDetails.slice(0, selectedMonths);
      setFilteredSalaryDetails(filteredDetails);

      const filteredLoan = loanDetails.slice(0, selectedMonths);
      setFilteredLoanDetails(filteredLoan);
    } else {
      setFilteredSalaryDetails(salaryDetails);
      setFilteredLoanDetails(loanDetails);
    }
  };

  if (!customerData) {
    return (
      <div className="DetailsCon">
        <Headline
          align="center"
          fontSize="18px"
          text="No salary details available"
        />
      </div>
    );
  }

  return (
    <>
      <div className="DetailsCon">
        {/* Customer Details */}
        <Headline align="left" fontSize="18px" text="Customer Details" />
        <div className="RowSectio">
          <RowCard title="Fullname:" text={customerData.customerName} />
          <RowCard title="Customer ID:" text={customerData.customerId} />
          <RowCard title="Account Number:" text={customerData.accountNumber} />
          <RowCard title="Bank Code:" text={customerData.bankCode} />
          <RowCard title="BVN:" text={customerData.bvn || "Not Available"} />
          <RowCard
            title="Next Payment Date:"
            text={customerData?.firstPaymentDate?.slice(0, 10)}
          />
        </div>
        <hr />

        {/* Salary Payment Filter */}
        <div>
          <select style={{ fontSize: "14px" }} onChange={handleMonthChange}>
            <option value="">Select Number of Months</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="9">9 months</option>
            <option value="12">12 months</option>
          </select>
        </div>

        {/* Salary Payment Details */}
        <div className="RowSection">
          <div id="PastSalary">
            <Headline
              align="left"
              fontSize="18px"
              text="Past Salary Payment Details"
            />
            {filteredSalaryDetails.length > 0 ? (
              <div className="DetailGrid">
                {filteredSalaryDetails.map((detail, index) => (
                  <div key={index} className="SalaryDetail">
                    <RowCard
                      title="Salary Payment Date"
                      text={detail.paymentDate.slice(0, 10)}
                    />
                    <RowCard title="Salary Amount" text={detail.amount} />
                    <RowCard
                      title="Account Number"
                      text={detail.accountNumber}
                    />
                    <RowCard title="Bank Code" text={detail.bankCode} />
                  </div>
                ))}
              </div>
            ) : (
              <Headline
                align="center"
                fontSize="16px"
                text="No salary details to display."
              />
            )}
          </div>
        </div>

        <hr />

        {/* Loan History Details */}
        <div className="RowSection">
          <div id="LoanHistory">
            <Headline
              align="left"
              fontSize="18px"
              text="Loan History Details"
            />
            {filteredLoanDetails.length > 0 ? (
              <div className="DetailGrid">
                {filteredLoanDetails.map((loan, index) => (
                  <div key={index} className="LoanDetail">
                    <RowCard title="Loan Provider" text={loan.loanProvider} />
                    <RowCard title="Loan Amount" text={loan.loanAmount} />
                    <RowCard
                      title="Outstanding Amount"
                      text={loan.outstandingAmount}
                    />
                    <RowCard
                      title="Loan Disbursement Date"
                      text={loan.loanDisbursementDate.slice(0, 10)}
                    />
                    <RowCard title="Status" text={loan.status} />
                    <RowCard
                      title="Repayment Amount"
                      text={loan.repaymentAmount}
                    />
                    <RowCard
                      title="Repayment Frequency"
                      text={loan.repaymentFreq}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <Headline
                align="center"
                fontSize="16px"
                text="No loan details to display."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

CheckSalaryDetails.propTypes = {
  customerObj: PropTypes.any,
  setOpenDetails: PropTypes.func,
};

export default CheckSalaryDetails;
