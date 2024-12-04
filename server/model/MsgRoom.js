const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgRoomSchema = new Schema({
    name:       { type: String, maxlength: 50 },
    members:    { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    messages:   { type: [{ type: Schema.Types.ObjectId, ref: 'Message' }] },
    qnaRoomId:  { type: Schema.Types.ObjectId },
});

const MsgRoom = mongoose.model('MsgRoom', msgRoomSchema);
module.exports = { MsgRoom };
