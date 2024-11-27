const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    clubId:         { type: Schema.Types.ObjectId, require: true, ref: 'Club' },
    title:          { type: String, require: true, maxlength: 50 },
    description:    { type: String, require: true, maxlength: 500 },
    date:           { type: Date },
    location:       { type: String },
});

const Event = mongoose.model('Event', eventSchema);
module.exports = { Event };
