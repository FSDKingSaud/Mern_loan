const cron = require("node-cron");
const NDDMandate = require("../models/NDDMandate");
const { checkAndUpdateMandateStatus } = require("../services/nibss.service");


cron.schedule("0 8-17/4 * * 1-5", async () => {
  console.log(
    "Running NIBSS Mandate Status update Every 4 hours 8am - 5pm, monday to friday "
  );

  const activeMandates = await NDDMandate.find({
    $or: [{ "balanceMandate.isActive": true }, { "debitMandate.isActive": true }],
  });



  await Promise.all(
    activeMandates.map(async (mandate) => {
      await  checkAndUpdateMandateStatus(mandate._id, "balance");
      await checkAndUpdateMandateStatus(mandate._id, "balance");
    })
  );

  
});

module.exports = cron;
