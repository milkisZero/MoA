const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name:           { type: String, required: true, maxlength: 50 },
    description:    { type: String, required: true, maxlength: 500 },
    members:        { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    admin:          { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },

    proposers:      { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    postIds:        { type: [{ type: Schema.Types.ObjectId, ref: 'Post' }] },
    events:         { type: [{ type: Schema.Types.ObjectId, ref: 'Event' }] },

    createdAt:      { type: Date, default: Date.now },
    clubImg:        { type: String },
    location:       { type: String },
    phone:          { type: String },
    sns:            { type: String },
});

const Club = mongoose.model('Club', clubSchema);
module.exports = { Club };
