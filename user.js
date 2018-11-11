// Imports dependencies and saves them in constants.
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema for Users; saves email, username, password
const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  dob: String,
  gender: String,
  address: String,
  specialty: String,
  branch: String,
  memberid: String,
  planid: String
})
// Save to constant named User
const User = mongoose.model('user', userSchema)
module.exports = User
