const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:           { type: String, required: true, maxlength: 50 },
    email:          { type: String, required: true, trim: true, unique: true },
    password:       { type: String, required: true, minlength: 5 },
    createdAt:      { type: Date, default: Date.now },
    profileImg:     { type: String },
    
    clubs:          { type: [{ type: Schema.Types.ObjectId, ref: 'Club' }] },
    waitingClubs:   { type: [{ type: Schema.Types.ObjectId, ref: 'Club' }] },
    msgRooms:       { type: [{ type: Schema.Types.ObjectId, ref: 'MsgRoom' }] },
});

const User = mongoose.model('User', userSchema);
module.exports = { User };
