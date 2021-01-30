const { Schema, model } = require('mongoose');

const schema = new Schema({
  login: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  color: {
    type: String,
  },
  createdDate: {
    type: Number,
  },
});

module.exports = model('MessagesDB', schema);
