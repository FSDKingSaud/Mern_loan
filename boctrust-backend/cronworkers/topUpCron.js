const cron = require("node-cron");
const Settings = require("../models/Settings");
const Loan = require("../models/Loan");
const { sendTopUpNotification } = require("../services/topUp.service");
const Customer = require("../models/Customer");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Checking for loans eligible for Top Up");

    const settings = await Settings.findOne();
    const topUpMonthEligibility = settings.topUpEligibilityMonths;

    const eligibleLoans = await Loan.find({
      loanstatus: "completed",
      numberofmonth: { $gte: topUpMonthEligibility },
      createdAt: {
        $lte: new Date(
          new Date().setMonth(new Date().getMonth() - topUpMonthEligibility)
        ),
      },
      topUpNotificationSent: false,
    });

    // Note: You might also need to figure out if the person has been
    // judicously paying his loan for the elapsed duration

    if (eligibleLoans.length === 0) {
      console.log("No eligible loans found");
      return;
    }

    await Promise.all(
      eligibleLoans.map(async (loan) => {
        const foundCustomer = await Customer.findById(loan.customer);
        await sendTopUpNotification(foundCustomer);
        loan.topUpNotificationSent = true;
        foundCustomer.topUpLoanEligibility.isEligible = true;
        await loan.save();
        await foundCustomer.save();
      })
    );

    console.log("notification sent");
  } catch (error) {
    console.log(error);
  }
});

module.exports = cron;
