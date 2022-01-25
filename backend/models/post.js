
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : { type: String , required: true } ,
    content : { type: String , required: true } ,
    imagePath : { type: String , required: false }
});

const dbPostModel = mongoose.model('Post', postSchema);

module.exports = dbPostModel;
