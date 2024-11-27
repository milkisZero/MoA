const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    clubId:         { type: Schema.Types.ObjectId, required: true, ref: 'Club' },
    title:          { type: String, required: true, maxlength: 50 },
    description:    { type: String, required: true, maxlength: 500 },
    date:           { type: Date },
    location:       { type: String },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
