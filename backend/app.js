const express = require('express');
const bodyParser = require('body-parser');
const PostModel = require('./models/post');
const mongoose = require('mongoose');
const app = express();

const dbName = 'database1';
const clusterUri = 'cluster1.m3eok.mongodb.net';
const credentials = 'Pascal:MongoDB';
mongoose.connect("mongodb+srv://" + credentials + "@" + clusterUri + "/" + dbName +"?retryWrites=true&w=majority")
    .then(() => { console.log("Connected to MongoDB ("+clusterUri+" , "+dbName+")") })
    .catch(() => { console.log("Failed to connect to MongoDB ("+clusterUri+" , "+dbName+")") })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  next();
});


// REST API : GET (READ) -> list of posts from database
app.get('/api/posts', (req, res, next) => {
  console.log('Server handles GET request and posting data ...');
  PostModel.find() // to find all Mongoose's PostModel
           .then((documents) => {
           return res.status(200)
                     .json( { message: 'List of posts successfully fetched for posting ...' ,
                              posts: documents } );
   });
  // app.get
});


// REST API : POST (CREATE) -> store a new post into database
app.post('/api/posts', (req, res, next) => {

  console.log('Server handles POST request and store new post data ...');

  const newPost = new PostModel({
      id: null,
      title: req.body.title,
      content: req.body.content
  });

  console.log('New post to persist: ' + newPost);

  newPost.save() // to store into MongoDB
       .then( result => {
         console.log('DEBUG: result=' + result);
         console.log('Post with new _id=' + result._id +' successfully saved into MongoDB -> '+ dbName);
         return res.status(201)
                   .json({ message: 'New post saved successfully to MongoDB -> '+dbName+ ' (backend)' ,
                           postID: result._id }) // return the postID of the newly created post
        } );


  // app.post
});


// REST API : DELETE (ERASE) -> delete a post from database with his _id
app.delete('/api/posts/:id', (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles DELETE request for post id='+ postID);

  PostModel.deleteOne({ _id: postID })   // to delete one post from MongoDB
           .then( result => {
             // console.log('DEBUG: result=' + result);
             console.log('Post with _id=' + postID + ' successfully deleted on MongoDB -> '+ dbName);
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' deleted on MongoDB -> '+ dbName + ' (backend)' });
             });
  // app.post
});


// REST API : PUT (UPDATE) -> replace fields of a post onto the database
// Reminder on PATCH vs. PUT : https://blog.eq8.eu/article/put-vs-patch.html
app.put('/api/posts/:id', (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles PUT request to update post with id='+ postID);
  // console.log('DEBUG: req.body.id='+ req.body.id + ' <= vs. => req.params.id=' + req.params.id);

  const updatedPost = new PostModel({
    _id: postID ,
    title: req.body.title ,
    content: req.body.content
  });

  console.log('Post to update: ' + updatedPost);

  PostModel.updateOne({ _id: postID }, updatedPost) // to update one post into MongoDB
           .then( (result) => {
             // console.log('DEBUG: result=' + result);
             console.log('Post with _id=' + postID + ' successfully updated on MongoDB -> '+ dbName);
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' updated on MongoDB -> '+ dbName + ' (backend)' });
           });

  // app.put (or app.patch)
});


/*
app.use("/", (req, res, next) => {
  console.log('Handle request and send a basic response ...');
  res.send("<h1>Default page from express.js</h1>");
  // app.use
});
*/

module.exports = app;
