import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../../../lib/axios";
import DisplayLoanProductName from "../../../shared/DisplayLoanProductName";
import PageLoader from "../../../shared/PageLoader";
import BocButton from "../../../shared/BocButton";

const styles = {
  date: {
    width: "120px",
    fontSize: "12px",
    border: "1px solid #d9d9d9",
    padding: "0.3rem",
    margin: "0",
  },
};

const LoanStatementRecord = ({
  loan,
  setIsProcessing,

  setAccountStatement,
}) => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckBalance = async (payload) => {
    if (!payload.loanAccountNumber) {
      return toast.error("No Loan Account Number");
    }
    try {
      setIsProcessing(true);
      setIsLoading(true);

      const { data } = await apiClient.get(
        `/bankone/loanAccountStatement?accountNumber=${payload.loanAccountNumber}&fromDate=${fromDate}&toDate=${toDate}`
      );
      setAccountStatement(data);
    } catch (error) {
      toast.error(error?.response?.data?.error);
      console.log(error);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <tr>
      <td>{loan.customer?.banking?.accountDetails?.CustomerID || "N/A"}</td>
      <td>
        <DisplayLoanProductName loan={loan} />
      </td>
      <td>
        {loan?.customer?.banking?.accountDetails?.CustomerName ||
          `${loan?.customer?.firstname} ${loan?.customer?.lastname}`}
      </td>
      <td>{loan?.customer?.banking?.accountDetails?.AccountNumber || "N/A"}</td>
      <td>N{loan.loanamount}</td>
      <td style={styles.date}>
        <input
          style={styles.date}
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </td>
      <td>
        <input
          style={styles.date}
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </td>
      <td>
        <div>
          <BocButton
            func={() => handleCheckBalance(loan)}
            bradius="12px"
            fontSize="12px"
            width="80px"
            margin="4px"
            bgcolor="#ecaa00"
          >
            Check
            {isLoading && <PageLoader strokeColor="#0284c7" width="12px" />}
          </BocButton>
        </div>
      </td>
    </tr>
  );
};

export default LoanStatementRecord;
