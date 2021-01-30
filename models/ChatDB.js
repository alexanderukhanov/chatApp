const { Schema, model } = require('mongoose');

const schema = new Schema({
  login: {
    type: String,
    required: true,
  },
  pass: {
    type: Schema.Types.Mixed,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isMuted: {
    type: Boolean,
    default: false,
  },
  isBanned: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
  },
});

module.exports = model('ChatDB', schema);
