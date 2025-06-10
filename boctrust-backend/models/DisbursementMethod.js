const mongoos = require('mongoose');

const DisbursementSchema = mongoos.Schema({
   methodName: {
        type: String,
        required: true,
    },
    logoImg: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Disbursement = mongoos.model('Disbursement', DisbursementSchema);
module.exports = Disbursement; // export disbursement model