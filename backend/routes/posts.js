const express = require('express');
const checkAuth = require('../middleware/check-auth');
const imageFile = require('../middleware/image-file');
const postsController = require('../controllers/posts_controller');
const xRouter = express.Router();


// REST PATH for POSTS is '/api/posts'

// REST API : GET (READ) '/api/posts' -> list of posts from database, with pagination params
xRouter.get('', postsController.listOfPaginatedPosts);

// REST API : POST (CREATE) '/api/posts' -> store a new post into MongoDB, and the 'image' on disk drive
xRouter.post('', checkAuth, imageFile, postsController.addNewPost);


// REST API : DELETE (ERASE) '/api/posts/:id' -> delete a post from database with his _id
xRouter.delete('/:id', checkAuth, postsController.deletePost);


// REST API : PUT (UPDATE) '/api/posts/:id' -> replace fields of a post onto the database
// Reminder on PATCH vs. PUT : https://blog.eq8.eu/article/put-vs-patch.html
xRouter.put('/:id', checkAuth, imageFile, postsController.updatePost);


// REST API : GET (READ) '/api/posts/:id' -> retrieve a post from the database, by his Id
xRouter.get('/:id', postsController.onePost);


// REST API : GET (READ) '/api/posts/user/:id' -> list of user posts from database, with pagination params
xRouter.get('/user/:id', postsController.listOfUserPaginatedPosts);

module.exports = xRouter;
