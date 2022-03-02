
const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title : { type: String , required: true } ,
    content : { type: String , required: true } ,
    imagePath : { type: String , required: false } ,
    creatorId : { type: Schema.Types.ObjectId , ref: 'User', required: true }
});

const dbPostModel = mongoose.model('Post', postSchema);

module.exports = dbPostModel;
