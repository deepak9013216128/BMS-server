const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tabSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: [{
    type: Schema.Types.ObjectId,
    ref='Category'
  }],
});

module.exports = mongoose.model('Tab', tabSchema);
