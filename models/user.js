const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//create user Schema
const userSchema = new Schema({
    _id: {
        type: Schema.ObjectId,
        auto:true
    },
    name: String
});

const User = mongoose.model('user', userSchema);

module.exports = User;

