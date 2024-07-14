const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: String,
  role: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
