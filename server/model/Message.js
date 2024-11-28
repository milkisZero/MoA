const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    msgRoomId:     { type: Schema.Types.ObjectId, ref: 'MsgRoom' },
    senderId:   { type: Schema.Types.ObjectId, ref: 'User' },
    content:    { type: String, maxlength: 500 },
    timestamp:  { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', msgSchema);
module.exports = { Message };
