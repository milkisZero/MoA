const mongoose = require('mongoose');
const { Schema } = mongoose.Schema;

const eventSchema = new Schema({
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
    title: { type: String, maxlength: 50 },
    description: { type: String, maxlength: 500 },
    date: { type: Date, default: Date.now },
    location: { type: String },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
