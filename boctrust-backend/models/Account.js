const mongoos = require('mongoose');

const AccountSchema = mongoos.Schema({
    accountName: {
        type: String,
        required: true,
    },
    interestRate: {
        type: Number,
        required: true,
    },
    interestMethod: {
        type: String,
        required: true,
    },
    interestPeriod: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Active',
    },

}, { timestamps: true });

const Account = mongoos.model('Account', AccountSchema);
module.exports = Account; // export account model