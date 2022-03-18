const express = require('express');
const userController = require('../controllers/user_controller');
const xRouter = express.Router();

// REST PATH for USER is '/api/user'

// REST API : POST (CREATE) '/api/user/signup' -> store a new user into MongoDB
xRouter.post('/signup', userController.userCreate);

// REST API : POST (CREATE) '/api/user/login' -> login an existing user
xRouter.post('/login', userController.userLogin);

module.exports = xRouter;
