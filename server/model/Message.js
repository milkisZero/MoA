const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, maxlength: 500 },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', msgSchema);
module.exports = { Message };
