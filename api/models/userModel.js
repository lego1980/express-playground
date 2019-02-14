const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },     
    username: { type: String, required: true, createIndexes: { unique: true }},
    userpassword: { type: String, required: true },
    userimage : { type: String },
    email: { 
        type: String, 
        required: true,
        createIndexes: { unique: true },
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },    
    //emailArray:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Email'}]
    commentsArray : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],   
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);