const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    username: {type:String , unique:true},
    password: String
})

// CREATING MODEL

const UserModel = mongoose.model('users' , UserSchema);

module.exports = {
    UserModel: UserModel
}