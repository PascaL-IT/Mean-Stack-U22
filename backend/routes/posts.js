const express = require('express');
const checkAuth = require('../middleware/check-auth');
const imageFile = require('../middleware/image-file');
const postsController = require('../controllers/posts_controller');
const xRouter = express.Router();


// REST PATH for POSTS is '/api/posts'

// REST API : GET (READ) -> list of posts from database, with pagination params
xRouter.get('', postsController.listOfPaginatedPosts);

// REST API : POST (CREATE) -> store a new post into MongoDB, and the 'image' on disk drive
xRouter.post('', checkAuth, imageFile, postsController.addNewPost);


// REST API : DELETE (ERASE) -> delete a post from database with his _id
xRouter.delete('/:id', checkAuth, postsController.deletePost);


// REST API : PUT (UPDATE) -> replace fields of a post onto the database
// Reminder on PATCH vs. PUT : https://blog.eq8.eu/article/put-vs-patch.html
xRouter.put('/:id', checkAuth, imageFile, postsController.updatePost);


// REST API : GET (READ) -> retrieve a post from the database, by his Id
xRouter.get('/:id', postsController.onePost);


module.exports = xRouter;
