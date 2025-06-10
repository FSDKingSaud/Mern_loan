const cron = require("node-cron");
const Settings = require("../models/Settings");
const Loan = require("../models/Loan");
const { sendTopUpNotification } = require("../services/topUp.service");
const Customer = require("../models/Customer");
const {
  calculateOverdueLoansfromRepaymentSchedule,
  sendOverdueLoanNotification,
} = require("../services/loanServices.service");
const { default: axios } = require("axios");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Checking for Over due loans ...");
    const token = process.env.BANKONE_TOKEN;
    const loans = await Loan.find({
      loanstatus: "completed",
    })
      .populate("customer")
      .sort({ createdAt: -1 });

    await Promise.all(
      loans.map(async (loan) => {
        if (loan?.loanAccountNumber) {
          const { data: repaymentSchedule } = await axios.get(
            `${process.env.BANKONE_BASE_URL}/BankOneWebAPI/api/loan/GetLoanRepaymentSchedule/2?authToken=${token}&loanAccountNumber=${loan.loanAccountNumber}`
          );

          let { overdueLoans: loanRepaymentSchedule, totalOverdueAmount } =
            calculateOverdueLoansfromRepaymentSchedule(repaymentSchedule);

          if (loanRepaymentSchedule.length > 0) {
            await sendOverdueLoanNotification({
              customer: loan.customer,
              loanAccountNumber: loan.loanAccountNumber,
              amount: totalOverdueAmount,
              dueDate: loanRepaymentSchedule
                .map((item) => item.PaymentDueDate)
                .join(", "),
            });
          }
        }
      })
    );

    console.log("Notification sent")
  } catch (error) {
    console.log(error);
  }
});

module.exports = cron;
