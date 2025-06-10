// create post model
const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    postSummary: {
        type: String,
        required: true,
        trim: true,
    },
    body: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    image: {
        type: String,
        required: true,
    }, 
    isFeatured: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
module.exports = Post; // export post model


