const express = require('express');
const bodyParser = require('body-parser');
const PostModel = require('./models/post');
const mongoose = require('mongoose');
const app = express();

const dbName = 'database1';
mongoose.connect("mongodb+srv://Pascal:MongoDB@cluster1.m3eok.mongodb.net/"+dbName+"?retryWrites=true&w=majority")
    .then(() => { console.log("Connected to MongoDB (cluster1, "+dbName+")") })
    .catch(() => { console.log("Failed to connect to MongoDB (cluster1, "+dbName+")") })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

// REST API : GET -> list of posts from database
app.get('/api/posts', (req, res, next) => {
  console.log('Server handles GET request and posting data ...');
  PostModel.find().then((documents) => { // to find all Mongoose's PostModel
    return res.status(200).json( {
      message: 'List of posts successfully fetched for posting ...' ,
      posts: documents } );
  });
  // app.get
});

// REST API : POST -> store a new post into database
app.post('/api/posts', (req, res, next) => {
  console.log('Server handles POST request and store new post data ...');
  // const post = req.body;
  const newPost = new PostModel({
      title: req.body.title,
      content: req.body.content
  });
  console.log('New post to persist: ' + newPost);
  newPost.save() // to store into MongoDB
       .then( result => {
         console.log('Result: ' + result); // new created post
         console.log('Post successfully saved into MongoDB -> '+ dbName);
         return res.status(201)
                   .json({ message: 'New post saved successfully to MongoDB -> '+dbName+ ' (backend)' ,
                           postID: result._id }) // return the postID of the newly created post
        } );


  // app.post
});

// REST API : DELETE -> delete a post from database with his _id
app.delete('/api/posts/:id', (req, res, next) => {
              const ID = req.params.id;
              console.log('Server handles DELETE request for post id='+ ID);
              PostModel.deleteOne({ _id: ID }   // to delete one post from MongoDB
           ).then( result => {
             console.log(result);
             console.log('Post with _id=' + ID + ' successfully deleted on MongoDB -> '+ dbName);
             return res.status(201).json({ message: 'Post with id=' + ID + ' deleted on MongoDB -> '+ dbName + ' (backend)' });
    } );
  // app.post
});


/*
app.use("/", (req, res, next) => {
  console.log('Handle request and send a basic response ...');
  res.send("<h1>Default page from express.js</h1>");
  // app.use
});
*/

module.exports = app;
