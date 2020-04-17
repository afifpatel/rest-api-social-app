const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');
const Comment = require('./comment');

// create post Schema
const postSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto: true
    },
    text: {
        type: String,
        required: [true, 'Post text is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Comment
        }
    ]
    // add more properties based on requirements
}, {timestamps: true});

const Post = mongoose.model('post', postSchema);

module.exports = Post;