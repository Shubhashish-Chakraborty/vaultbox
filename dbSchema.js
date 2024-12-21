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

const SocialAccountSchema = new Schema({
    accountName: String,
    description: String,
    password: String,
    userId: ObjectId
})

// CREATING MODEL

const UserModel = mongoose.model('users' , UserSchema);
const SocialAccountModel = mongoose.model('socialaccounts' , SocialAccountSchema);

module.exports = {
    UserModel: UserModel,
    SocialAccountModel: SocialAccountModel
}