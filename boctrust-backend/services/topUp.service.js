const EmailTemplate = require("../utils/emailTemp");
const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSms");
const {
  saveAndSendNotificationToUser,
} = require("../services/notification.service");
const Settings = require("../models/Settings");
const Loan = require("../models/Loan");

const sendTopUpNotification = async (customer) => {
  const emailTemp = EmailTemplate({
    buttonText: "Login to Apply",
    buttonLink: "https://www.boctrustmfb.com/login",
    firstName: customer.firstname,
    headline: "Loan Top-Up Eligibility",
    cta: `<p>If you have any questions, contact our support team at <a href="mailto:support@boctrustmfb.com">support@boctrustmfb.com</a> or call <strong>08177773196</strong>.</p> `,
    content: `<p>We're pleased to inform you that, based on your excellent loan repayment history, you are now eligible for a <strong>Loan Top-Up</strong>! 🎉</p>
        <p>Enjoy the following benefits:</p>
        <ul>
            <li>✅ Access additional funds quickly</li>
            <li>✅ Competitive interest rates</li>
            <li>✅ Seamless application process</li>
            <li>✅ Continued flexibility in repayment</li>
        </ul>

        <p>Click the button below to apply now</p>`,
  });

  await sendEmail({
    email: customer.email,
    html: emailTemp,
    subject: "You're Now Eligible for a Loan Top-Up!",
  });

  const smsMessage = `Dear ${customer.firstname}, you are now eligible for a Loan Top-Up based on your excellent repayment history!🎉. Get additional funds with ease. Apply now via your dashboard.`;
  await sendSMS(customer.phonenumber, smsMessage);

  await saveAndSendNotificationToUser({
    userType: "Customer",
    message: `You are now eligible for a Loan Top-Up based on your excellent repayment history!🎉. Get additional funds with ease`,
    userId: customer._id,
    type: "topuploan",
  });
};

const getUserLoanForTopUp = async (customerId) => {
  const settings = await Settings.findOne();
  const topUpMonthEligibility = 3 || settings.topUpEligibilityMonths;

  const userTopUpLoan = await Loan.findOne({
    customer: customerId,
    loanstatus: "completed",
    numberofmonth: { $gte: topUpMonthEligibility },
    createdAt: {
      $lte: new Date(
        new Date().setMonth(new Date().getMonth() - topUpMonthEligibility)
      ),
    },
    topUpNotificationSent: true,
  });

  return userTopUpLoan;
};

function calculateTopUpLoanValues(
  principal,
  annualInterestRate,
  loanDurationMonths,
  prevLoanAmount
) {
  let rate = annualInterestRate / 100;

  let loanDurationYears = loanDurationMonths / 12;

  let interest = principal * rate * loanDurationYears;

  let totalPayment = principal + interest + prevLoanAmount;

  let monthlyPayment = totalPayment / loanDurationMonths;

  return {
    interest: interest.toFixed(2),
    totalPayment: totalPayment.toFixed(2),
    monthlyPayment: monthlyPayment.toFixed(2),
  };
}

module.exports = {
  sendTopUpNotification,
  getUserLoanForTopUp,
  calculateTopUpLoanValues,
};
