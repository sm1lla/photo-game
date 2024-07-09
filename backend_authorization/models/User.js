// Assuming you have already connected to your MongoDB using Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema for your user
const UserSchema = new Schema({
  name: String,
  accessToken: String,
  refreshToken: String,
});

// Create a model based on the schema
const User = mongoose.model('User', UserSchema);

module.exports = User;
