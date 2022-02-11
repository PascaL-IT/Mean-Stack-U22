const mongoose = require('mongoose');
const mongooseUV = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    email : { type: String , required: true , unique: true } , // here, unique is for DB optimization
    password : { type: String , required: true }
});

userSchema.plugin(mongooseUV); // enable the validator on user schema to guarantee email unicity

const dbUserModel = mongoose.model('User', userSchema);

module.exports = dbUserModel;
