const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REST PATH for USERS is '/api/user'

// REST API : POST (CREATE) '/api/user/signup' -> store a new user into MongoDB
router.post('/signup', (req, res, next) => {
  console.log('Server handles POST request to create and store a new user ...');
  bcrypt.hash(req.body.password, 10)
        .then( hashPwd => {

            const newUser = new UserModel({
              id: null,
              email: req.body.email,
              password: hashPwd
            });

            console.log('New user to persist: ' + newUser);

            newUser.save() // to store user MongoDB
            .then( saveUserResult => {
                     console.log('User with new _id=' + saveUserResult._id +' successfully saved into MongoDB');
                     return res.status(201)
                               .json({ message: 'New user saved successfully to MongoDB (backend)' ,
                                       result: { ...saveUserResult, // shortcut to copy all fields
                                                 id: saveUserResult._id // add the id field for client
                                               }
                            }) // return the userID of the newly created user
                  })
            .catch(
                saveUserError => {
                  console.log('Failed to create user with email: ' + req.body.email +' - not saved into MongoDB');
                  return res.status(500)
                            .json({ message: 'Failed to create user with email=' + req.body.email + ' onto MongoDB (backend)' ,
                                    result: saveUserError
                          });
            });

        }).catch( error => { console.log("bcrypt.hash failed with error=" + error)});
});
// router.post


// REST API : POST (CREATE) '/api/user/login' -> login an existing user
router.post('/login', (req, res, next) => {
  UserModel.findOne({ email: req.body.email })
           .then( user => {
              if (! user) {
                return res.status(401) // 
                          .json({ message: "Authentication failed!"})
              }
              bcrypt.compare(req.body.password, user.password)
                    .then( result => {
                      if (! result) { // if false
                        return res.status(401) // Unauthorized
                                  .json({ message: "Authentication failed!" , result: result });
                      }
                      // As user's credentials are OK, we generate a token
                      const JWT_SECRET_KEY = '5F26F7B6E23236E725F51E8775F3A';  // https://randomkeygen.com/
                      const jwtoken = jwt.sign( { email: UserModel.email , id: UserModel._id } ,
                                                  JWT_SECRET_KEY ,
                                                { expiresIn: "60s" , algorithm: 'HS256' } );
                      return res.status(200) // OK and provide a token
                                .json({ token: jwtoken });
                    })
                    .catch( error => {
                        return res.status(500) // Internal Server Error
                                  .json({ message: "Authentication error!" , error: error });
                    })
           })
});
// router.post

module.exports = router;
