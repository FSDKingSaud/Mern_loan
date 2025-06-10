const BankoneCollection = require("../models/BankoneCollection");
const Loan = require("../models/Loan");
const LoanDisbursement = require("../models/LoanDisbursment");
const LoanRepayment = require("../models/LoanRepayment");
const NDDMandate = require("../models/NDDMandate");
const EmailTemplate = require("../utils/emailTemp");
const { generateTransactionRef } = require("../utils/generateTransactionRef");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSms");
const {
  handleInterBankTransfer,
  handleGetTransactionQuery,
} = require("./bankoneOperationsServices");
const {
  saveAndSendNotificationToUser,
  getUsersToSendNotificationFromTarget,
  saveAndSendNotification,
} = require("./notification.service");

function calculateOverdueLoansfromRepaymentSchedule(repaymentSchedules) {
  const today = new Date();
  let overdueLoans = [];
  let totalOverdueAmount = 0;

  repaymentSchedules.forEach((loanSchedule) => {
    const paymentDueDate = new Date(loanSchedule.PaymentDueDate);
    const isPaymentApplied =
      loanSchedule.IsPrincipalApplied &&
      loanSchedule.IsInterestApplied &&
      loanSchedule.IsFeeApplied;

    if (paymentDueDate < today && !isPaymentApplied) {
      const overdueAmount = parseFloat(loanSchedule.Total.replace(",", ""));
      totalOverdueAmount += overdueAmount;

      overdueLoans.push(loanSchedule);
    }
  });

  return { overdueLoans, totalOverdueAmount: totalOverdueAmount.toFixed(2) };
}

function getAmountAndDurationOfPaymentLeft(repaymentSchedules) {
  let durationLeft = 0;
  let amountLeft = 0;

  repaymentSchedules.forEach((loanSchedule) => {
    const isPaymentApplied =
      loanSchedule.IsPrincipalApplied &&
      loanSchedule.IsInterestApplied &&
      loanSchedule.IsFeeApplied;

    if (!isPaymentApplied) {
      const overdueAmount = parseFloat(loanSchedule.Total.replace(",", ""));
      amountLeft += overdueAmount;

      durationLeft++;
    }
  });

  return { durationLeft, amountLeft: Number(amountLeft.toFixed(2)) };
}

// Ensure to pass either repaymentScheduleId:string or  repaymentScheduleIds:string[]
async function createOrUpdateLoanRepaymentAndCollection({
  loan,
  transferRes,
  repaymentTotal,
  repaymentScheduleId,
  repaymentScheduleIds,
}) {
  const foundBankoneRepayment = await BankoneCollection.findOne({
    loan: loan._id,
  });

  if (foundBankoneRepayment) {
    if (repaymentScheduleId) {
      foundBankoneRepayment.repaymentScheduleIds.push(repaymentScheduleId);
    } else {
      foundBankoneRepayment.repaymentScheduleIds.push(...repaymentScheduleIds);
    }
    await foundBankoneRepayment.save();
  } else {
    const bankoneRepayment = await BankoneCollection({
      loan: loan._id,
      customer: loan.customer._id,
      collectionId: reference,
      status: transferRes.Status,
      amount: repaymentTotal,
      reference,
      repaymentScheduleIds: repaymentScheduleId
        ? [repaymentScheduleId]
        : repaymentScheduleIds,
      paymentDate: new Date(),
    });

    const newRepayment = new LoanRepayment({
      collectionRef: bankoneRepayment._id,
      collectionType: "BankoneCollection",
    });

    await newRepayment.save();
  }

  return true;
}

const sendOverdueLoanNotification = async ({
  customer,
  loanAccountNumber,
  amount,
  dueDate,
}) => {
  const emailTemp = EmailTemplate({
    buttonText: "Login to Make Repayment",
    buttonLink: "https://www.boctrustmfb.com/login",
    firstName: customer.firstname,
    headline: "Overdue Loan Reminder",
    cta: `<p>If you have any questions, contact our support team at <a href="mailto:support@boctrustmfb.com">support@boctrustmfb.com</a> or call <strong>08177773196</strong>.</p> `,
    content: `<p>We hope this email finds you well. We want to remind you that your loan payment of <b>${amount}</b> was due on <b> ${dueDate}</b> and remains unpaid.</p>

    <p>To avoid penalties and additional charges, we kindly request that you make the payment as soon as possible. You can complete your payment by loging in using the link below or by visiting your nearest branch.</p>

    <p>If you have already made the payment, please disregard this message. Otherwise, kindly settle your outstanding balance immediately to prevent further action.</p>`,
  });

  await sendEmail({
    email: customer.email,
    html: emailTemp,
    subject: "Urgent: Your Loan Payment is Overdue",
  });

  const smsMessage = `Dear ${customer.firstname},  your loan payment of ${amount} was due on ${dueDate} and is now overdue. Kindly make payment immediately to avoid penalties. Pay now. Need help? Call 08177773196.`;
  await sendSMS(customer.phonenumber, smsMessage);

  const usersToSend = await getUsersToSendNotificationFromTarget("admins");

  await saveAndSendNotificationToUser({
    userType: "Customer",
    message: `Your loan payment of ${amount} was due on ${dueDate} and is now overdue. Kindly make the payment to avoid penalties. Click below to pay now.`,
    userId: customer._id,
    type: "overdueLoan",
  });

  await saveAndSendNotification({
    targetUsers: usersToSend,
    message: `Customer ${customer.fullname} ${customer.lastname} (Loan Account: ${loanAccountNumber}) has an overdue loan of ${amount} due since ${dueDate}. Please take necessary action.`,
    type: "overdueLoan",
    metadata: {
      loanAccountNumber,
    },
  });
};

const handleLoanDisbursement = async ({
  customerBankoneId,
  customerId,
  loanId,
  amount,
  debitAccount,
  customerName,
  disbursementaccountnumber,
  bankcode,
  creditAccountName,
  notes,
}) => {
  const reference = `TF${customerBankoneId}${generateTransactionRef()}`;

  const transferRequestPayload = {
    Amount: amount,
    PayerAccountNumber: debitAccount,
    Payer: customerName,
    ReceiverAccountNumber: disbursementaccountnumber,
    ReceiverBankCode: bankcode,
    ReceiverName: creditAccountName,
    Narration: notes,
    TransactionReference: reference,
    Token: token,
  };

  const transferRes = await handleInterBankTransfer(transferRequestPayload);

  console.log(transferRes, "transferRes");

  if (transferRes.IsSuccessFul && transferRes.Status === "Successful") {
    await new LoanDisbursement({
      loan: loanId,
      customer: customerId,
      collectionId: reference,
      status: transferRes.Status,
      amount: Number(amount),
      reference,
      paymentDate: new Date(),
    }).save();

    await new NDDMandate({
      loan: loanId,
      customer: customerId,
    }).save();

    await Loan.findByIdAndUpdate(loanId, {
      disbursementstatus: "approved",
      loanstatus: "completed",
    });

    return res.json(transferRes);
  } else if (
    transferRes.Status === "Pending" ||
    transferRes.ResponseCode == "91" ||
    transferRes.ResponseCode == "06"
  ) {
    const tsqRes = await handleGetTransactionQuery({
      amount: Number(amount),
      date: formatDate(new Date()),
      ref: reference,
    });

    if (tsqRes.Status == "Successful") {
      await new LoanDisbursement({
        loan: loanId,
        customer: customerId,
        collectionId: reference,
        status: tsqRes.Status,
        amount: Number(amount),
        reference,
        paymentDate: new Date(),
      }).save();

      await new NDDMandate({
        loan: loanId,
        customer: customerId,
      }).save();

      await Loan.findByIdAndUpdate(loanId, {
        disbursementstatus: "approved",
        loanstatus: "completed",
      });

      return res.json(tsqRes);
    } else {
      console.log(tsqRes, "tsqRes");
      return res
        .status(500)
        .json({ error: tsqRes.ResponseMessage || "Something Went Wrong" });
    }
  } else {
    return res
      .status(500)
      .json({ error: transferRes.ResponseMessage || "Something Went Wrong" });
  }
};

const createLoanDisbursmentMandateAndUpdateLoanStatus = async ({
  loanId,
  customerId,
  uniqueIdentifier,
  status,
  amount,
  reference,
}) => {
  await new LoanDisbursement({
    loan: loanId,
    customer: customerId,
    collectionId: reference,
    status,
    amount: Number(amount),
    reference,
    paymentDate: new Date(),
  }).save();

  await new NDDMandate({
    loan: loanId,
    customer: customerId,
  }).save();

  await Loan.findByIdAndUpdate(loanId, {
    disbursementstatus: "approved",
    loanstatus: "completed",
  });

  return true;
};

const handleApproveBooking = async (loanId) => {
  // Find the customer by ID
  const loan = await Loan.findByIdAndUpdate(loanId, {
    loanstatus: "booked",
  });

  if (loan.deductions === "remita") {
    loan.remita.remitaStatus = "disbursement_notice";
    await loan.save();
  }

  return loan;
};

module.exports = {
  calculateOverdueLoansfromRepaymentSchedule,
  createOrUpdateLoanRepaymentAndCollection,
  getAmountAndDurationOfPaymentLeft,
  sendOverdueLoanNotification,
  handleLoanDisbursement,
  createLoanDisbursmentMandateAndUpdateLoanStatus,
  handleApproveBooking,
};
