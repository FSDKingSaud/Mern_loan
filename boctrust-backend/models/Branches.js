const mongoos = require('mongoose');

const BranchSchema = mongoos.Schema({
    branchId: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
        required: true,
    },
    contactEmail: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Branch = mongoos.model('Branch', BranchSchema);
module.exports = Branch; // export branch model