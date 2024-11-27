const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    clubId:     { type: Schema.Types.ObjectId, required: true, ref: 'Club' },
    title:      { type: String, required: true, maxlength: 50 },
    content:    { type: String, required: true, maxlength: 3000 },
    createdAt:  { type: Date, default: Date.now },
    updatedAt:  { type: Date, default: Date.now },
    postImgs:   { type: [{ type: String }] },

});

const Post = mongoose.model('Post', postSchema);
module.exports = { Post };
