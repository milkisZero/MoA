const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, maxlength: 50 },
    email: { type: String, trim: true, unique: true },
    password: { type: String, minlength: 5 },
    clubs: { type: [{ type: Schema.Types.ObjectId, ref: 'Club' }] },
    waitingClubs: { type: [{ type: Schema.Types.ObjectId, ref: 'Club' }] },
    events: { type: [{ type: Schema.Types.ObjectId, ref: 'Event' }] },
    msgRooms: { type: [{ type: Schema.Types.ObjectId, ref: 'msgRoom' }] },
    createdAt: { type: Date, default: Date.now },

    token: { type: String },
    tokenExp: { type: Number },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
