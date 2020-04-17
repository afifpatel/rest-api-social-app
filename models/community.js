const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Post = require('./post');
const User = require('./user');

const ObjectId = Schema.ObjectId;

// create community Schema and model
const communitySchema = new Schema({
    _id: {
        type: ObjectId,
        auto: true
    },
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    description: {
        type: String,
        require: [true, 'Description is required']
    },
    address: {
        type: String,
        required: [true, 'Address field is required']
    },
    categories:[{
        type: String, 
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User 
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: Post
        }
    ]
    // add more properties based on requirement
}, {timestamps: true});

const Community = mongoose.model('community', communitySchema);

module.exports = Community;