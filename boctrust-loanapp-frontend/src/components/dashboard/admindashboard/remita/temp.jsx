  // {/* Salary Payment Details */}
  //       <div className="RowSection">
  //         <div id="PastSalary">
  //           <Headline
  //             align="left"
  //             fontSize="18px"
  //             text="Past Salary Payment Details"
  //           />
  //           {filteredSalaryDetails.length > 0 ? (
  //             <div className="DetailGrid">
  //               {filteredSalaryDetails.map((detail, index) => (
  //                 <div key={index} className="SalaryDetail">
  //                   <RowCard
  //                     title="Salary Payment Date"
  //                     text={detail.paymentDate.slice(0, 10)}
  //                   />
  //                   <RowCard title="Salary Amount" text={detail.amount} />
  //                   <RowCard
  //                     title="Account Number"
  //                     text={detail.accountNumber}
  //                   />
  //                   <RowCard title="Bank Code" text={detail.bankCode} />
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <Headline
  //               align="center"
  //               fontSize="16px"
  //               text="No salary details to display."
  //             />
  //           )}
  //         </div>
  //       </div>

  //       <hr />

  //       {/* Loan History Details */}
  //       <div className="RowSection">
  //         <div id="LoanHistory">
  //           <Headline
  //             align="left"
  //             fontSize="18px"
  //             text="Loan History Details"
  //           />
  //           {filteredLoanDetails.length > 0 ? (
  //             <div className="DetailGrid">
  //               {filteredLoanDetails.map((loan, index) => (
  //                 <div key={index} className="LoanDetail">
  //                   <RowCard title="Loan Provider" text={loan.loanProvider} />
  //                   <RowCard title="Loan Amount" text={loan.loanAmount} />
  //                   <RowCard
  //                     title="Outstanding Amount"
  //                     text={loan.outstandingAmount}
  //                   />
  //                   <RowCard
  //                     title="Loan Disbursement Date"
  //                     text={loan.loanDisbursementDate.slice(0, 10)}
  //                   />
  //                   <RowCard title="Status" text={loan.status} />
  //                   <RowCard
  //                     title="Repayment Amount"
  //                     text={loan.repaymentAmount}
  //                   />
  //                   <RowCard
  //                     title="Repayment Frequency"
  //                     text={loan.repaymentFreq}
  //                   />
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <Headline
  //               align="center"
  //               fontSize="16px"
  //               text="No loan details to display."
  //             />
  //           )}
  //         </div>
  //       </div>