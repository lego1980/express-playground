const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    text: { type: String, default: ''},
    user : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: {  type: Date, default: Date.now } 
}, { collection: 'comments' });

module.exports = mongoose.model('Comment', commentSchema);