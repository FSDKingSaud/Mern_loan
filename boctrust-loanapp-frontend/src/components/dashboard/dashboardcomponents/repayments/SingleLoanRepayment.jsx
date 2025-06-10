import React, { useState } from "react";
import { calcDaysDiffFromNow } from "../../../../../utilities/calcDaysDiff";
import { format } from "date-fns";
import TableStyles from "../tables/TableStyles.module.css";
import { toast } from "react-toastify";
import apiClient from "../../../../lib/axios";
import RepayLoanFromSalaryModal from "./RepayLoanFromSalaryModal";

function SingleLoanRepayment({ loanRepaymentSchedule }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const handleRepayLoan = async ({ repaymentScheduleId, loanId, notes }) => {
    const { data } = await apiClient.post(
      `/bankone/repayLoanFromSalaryAcc/${loanId}`,
      {
        repaymentScheduleId,
        notes,
      }
    );
    if (data.Status == "Successful") {
      toast.success("Transaction successfull!!");
    }
  };

  return (
    <>
      {loanRepaymentSchedule &&
        loanRepaymentSchedule.map((loan) => (
          <tr key={loan.Id} className={TableStyles.row}>
            <td>{loan.Id}</td>
            <td>{loan.AccountNumber}</td>
            <td>
              {loan.PaymentDueDate &&
                format(loan.PaymentDueDate, "dd/LL/yyyy, hh:mm aaa")}{" "}
            </td>
            <td>
              <button
                className={`btn text-white ${
                  calcDaysDiffFromNow(loan.PaymentDueDate) >= 0
                    ? "btn-danger"
                    : "btn-secondary"
                }`}
              >
                {calcDaysDiffFromNow(loan.PaymentDueDate) >= 0
                  ? "Due"
                  : "Not Due"}
              </button>
            </td>
            <td>
              <div className="d-flex">
                <img src="/images/naira.png" alt="" width={15} />
                {loan.Total}
              </div>
            </td>
            <td>
              <button
                onClick={() => {
                  setShowModal(true);
                  setSelectedSchedule(loan);
                }}
                className={`${TableStyles.gold_btn} gold__gradientBtn`}
              >
                Pay Now
              </button>
            </td>
          </tr>
        ))}
      {showModal && selectedSchedule && (
        <RepayLoanFromSalaryModal
          show={showModal}
          repaymentScheduleObj={selectedSchedule}
          handleClose={() => setShowModal(false)}
          action={handleRepayLoan}
        />
      )}
    </>
  );
}

export default SingleLoanRepayment;
