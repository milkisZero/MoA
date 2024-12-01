const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    senderName: { type: String },
    senderId:   { type: Schema.Types.ObjectId, ref: 'User' },
    msgRoomId:  { type: Schema.Types.ObjectId, ref: 'MsgRoom' },
    content:    { type: String, maxlength: 500 },
    timestamp:  { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', msgSchema);
module.exports = { Message };
