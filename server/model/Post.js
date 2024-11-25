const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    clubId: { type: Schema.Types.ObjectId, ref: 'Club' },
    title: { type: String, maxlength: 50 },
    content: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // attachments: { type: [] },
});

const Post = mongoose.model('Post', postSchema);
module.exports = { Post };
