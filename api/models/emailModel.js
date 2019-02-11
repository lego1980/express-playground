const mongoose = require('mongoose');

const emailSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    email: { type: String, default: '', required: true },
    primary : { type: Boolean, default: false },
    confirmed : { type: Boolean, default: false },
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: {  type: Date, default: Date.now } 
}, { collection: 'comments' });

module.exports = mongoose.model('Email', emailSchema);