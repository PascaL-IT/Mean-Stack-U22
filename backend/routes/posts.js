const express = require('express');
const router = express.Router();
const PostModel = require('../models/post');

// REST PATH for POSTS is '/api/posts'

// REST API : GET (READ) -> list of posts from database
router.get('', (req, res, next) => {
  console.log('Server handles GET request to fetch all posts data ...');
  PostModel.find() // to find all Mongoose's PostModel
           .then((documents) => {
             if (documents) {
              console.log('Size of posts = ' + documents.length);
              return res.status(200)
              .json( { message: 'List of ' + documents.length + ' posts successfully fetched for posting ...' ,
                       posts: documents } );
             } else {
              console.log('Size of posts = 0');
              return res.status(404)
              .json( { message: 'List of posts is empty, no post found yet for posting ...' ,
                       posts: null } );
             }
   });
  // router.get
});


// REST API : POST (CREATE) -> store a new post into database
router.post('', (req, res, next) => {

  console.log('Server handles POST request to store a new post data ...');

  const newPost = new PostModel({
      id: null,
      title: req.body.title,
      content: req.body.content
  });

  console.log('New post to persist: ' + newPost);

  newPost.save() // to store into MongoDB
       .then( result => {
         console.log('DEBUG: result=' + result);
         console.log('Post with new _id=' + result._id +' successfully saved into MongoDB');
         return res.status(201)
                   .json({ message: 'New post saved successfully to MongoDB (backend)' ,
                           postID: result._id }) // return the postID of the newly created post
        } );

  // router.post
});


// REST API : DELETE (ERASE) -> delete a post from database with his _id
router.delete('/:id', (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles DELETE request for post id='+ postID);

  PostModel.deleteOne({ _id: postID })   // to delete one post from MongoDB
           .then( result => {
             // console.log('DEBUG: result=' + result);
             console.log('Post with _id=' + postID + ' successfully deleted on MongoDB');
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' deleted on MongoDB (backend)' });
             });
  // router.post
});


// REST API : PUT (UPDATE) -> replace fields of a post onto the database
// Reminder on PATCH vs. PUT : https://blog.eq8.eu/article/put-vs-patch.html
router.put('/:id', (req, res, next) => {

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
             console.log('Post with _id=' + postID + ' successfully updated on MongoDB');
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' updated on MongoDB (backend)' });
           });

  // router.put (or router.patch)
});


// REST API : GET (READ) -> retrieve a post from the database, by his Id
router.get('/:id', (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles GET request to retrieve a post with id='+ postID);

  PostModel.findById({ _id: postID }) // to get one post from MongoDB
           .then( (post) => {
             if (post) {
                console.log('Post with _id=' + postID + ' found on MongoDB : ' + post);
                return res.status(200)
                          .json( { message: 'Post with id=' + postID + ' found on MongoDB (backend)' ,
                                   post: post } );
             } else {
                return res.status(404)
                          .json({ message: 'No post found with id=' + postID + ' on MongoDB (backend)' ,
                                  post: null });
             }
           });

  // router.get
});

module.exports = router;
