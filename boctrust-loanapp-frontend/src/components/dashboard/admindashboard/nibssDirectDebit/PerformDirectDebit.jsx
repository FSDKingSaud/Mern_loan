import { format } from "date-fns";
import {
  getOverdueAmountForSelected,
  getOverdueScheduleDatesAndId,
} from "../loan/getOverdueSchedule";
import { useEffect } from "react";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

const PerformDirectDebit = ({
  mandateId,
  amount,
  setAmount,
  originatorKYCLevel,
  nameEnquiryRef,
  accountName,
  repaymentSchedule,
  selectedRepaymentId,
  setSelectedRepaymentId,
}) => {
  useEffect(() => {
    if (selectedRepaymentId) {
      setAmount(
        getOverdueAmountForSelected(repaymentSchedule, selectedRepaymentId)
      );
    }
  }, [selectedRepaymentId]);

  return (
    <div className="direct__debit">
      <div className="balanceEnquiry__wrapper">
        <div className="row__line">
          <div className="sec__item">
            <h4>Originator KYC Level</h4>
            <h2>{originatorKYCLevel}</h2>
          </div>
          <div className="sec__item">
            <h4>Account Name</h4>
            <h2>{accountName}</h2>
          </div>
        </div>
        {/* <div className="sec__item">
          <h4>Mandate Id</h4>
          <h2>{mandateId}</h2>
        </div> */}

        <div className="sec__item">
          <h4>Name Enquiry Ref</h4>
          <h2>{nameEnquiryRef}</h2>
        </div>
        <div className="sec__item">
          <h4>Select Loan Overdue to Pay</h4>
          <div className="d-flex gap-4">
            {getOverdueScheduleDatesAndId(repaymentSchedule).map(
              (data, index) => (
                <div key={index} className="d-flex gap-2 align-items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      console.log(e.target.checked, "e.target.checked");
                      if (e.target.checked) {
                        setSelectedRepaymentId((ids) => [...ids, data.id]);
                      } else {
                        setSelectedRepaymentId((ids) =>
                          ids.filter((id) => id !== data.id)
                        );
                      }
                    }}
                    checked={selectedRepaymentId.includes(data.id)} // Remove function, use boolean
                  />
                  <span>
                    {data ? format(new Date(data.date), "dd/LL/yyyy") : "N/A"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="FieldGroup">
        <label htmlFor="amount">Amount</label>

        <input
          onChange={(e) => setAmount(e.target.value)}
          value={nigerianCurrencyFormat.format(amount)}
          type="text"
          name="amount"
          disabled
          id="amount"
          className="Input"
        />
      </div>
    </div>
  );
};

export default PerformDirectDebit;
