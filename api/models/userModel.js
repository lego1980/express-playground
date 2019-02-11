const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    commentsArray : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}], 
    username: { type: String, required: true, createIndexes: { unique: true }},
    userpassword: { type: String, required: true },
    email: { type: String, required: true, createIndexes: { unique: true } }
    //emailArray:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Email'}]   
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);