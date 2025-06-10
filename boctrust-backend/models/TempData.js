const mongoose = require('mongoose');

const TempDataSchema = mongoose.Schema({
    bvn: String,
    careerType: String,
    loanProduct: Object,
    loanAmount: String,
    numberOfMonths: String,
    loanTotalRepayment: String,
    monthlyRepayment: String,
});

const TempData = mongoose.model('TempData', TempDataSchema);
module.exports = TempData; // export TempData model