const mongoose = require('mongoose');

const WikiSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Wiki = mongoose.model('Wiki', WikiSchema);
module.exports = Wiki; // export wiki model