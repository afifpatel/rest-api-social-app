const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Post = require('./post');

// create comment Schema
const commentSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    text: {
        type: String,
        required: [true, 'Comment text is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
    //add more properities based on requirements
}, {timestamps: true});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;

