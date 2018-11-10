// Imports dependencies and saves them in constants.
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// Schema for Users; saves email, username, password
const userSchema = new Schema({
    email: String,
    username: String,
    //email: String,
    password: String,
    /*dob: String,
    gender: String,
    address: String,
    branch: String,
    memberid: String,
    planid: String*/
}, {

//time stamp for saving user
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

// Save to constatnt named User
const User = mongoose.model('user', userSchema)
module.exports = User

//Hashing pw bcrypt
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    } catch(error) {
        throw new Error('Hashing failed', error)
    }
}