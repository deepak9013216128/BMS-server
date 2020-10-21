const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Bookmark'
  }],
});

module.exports = mongoose.model('Category', categorySchema);
