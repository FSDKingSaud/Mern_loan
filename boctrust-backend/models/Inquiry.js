const mongoos = require('mongoose');

const InquirySchema = mongoos.Schema({
    email: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Inquiry = mongoos.model('Inquiry', InquirySchema);
module.exports = Inquiry; // export inquiry model