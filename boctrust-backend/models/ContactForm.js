const mongoos = require('mongoose');

const ContactSchema = mongoos.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
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

const Contact = mongoos.model('Contact', ContactSchema);
module.exports = Contact; // export contact model