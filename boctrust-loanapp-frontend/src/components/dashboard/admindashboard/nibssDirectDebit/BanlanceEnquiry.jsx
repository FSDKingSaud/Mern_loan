import React from "react";
import { nigerianCurrencyFormat } from "../../../../../utilities/formatToNiaraCurrency";

const BanlanceEnquiry = ({ accoutBalance }) => {
  return (
    <div className="balanceEnquiry__wrapper">
      <div className="sec__item">
        <h4>Account Balance:</h4>
        <h2>{nigerianCurrencyFormat.format(Number(accoutBalance.availableBalance))}</h2>
      </div>

      <div className="row__line">
        <div className="sec__item">
          <h4>Account Name</h4>
          <h2>{accoutBalance.targetAccountName}</h2>
        </div>
        <div className="sec__item">
          <h4>Target BVN</h4>
          <h2>{accoutBalance.targetBankVerificationNumber}</h2>
        </div>
      </div>
    </div>
  );
};

export default BanlanceEnquiry;
