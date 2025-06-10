const mongoos = require('mongoose');

const SelectedLoanOfficersSchema = mongoos.Schema({
    SelectedLoanOfficers:[String]
}, { timestamps: true });

const SelectedLoanOfficers = mongoos.model('SelectedLoanOfficers', SelectedLoanOfficersSchema);
module.exports = SelectedLoanOfficers; // export account model