const UserModel = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Controller function for user creation
exports.userCreate = (req, res, next) => {
  console.log('Server handles POST request to create and store a new user ...');
  bcrypt.hash(req.body.password, 10)
        .then( hashPwd => {

            const newUser = new UserModel({
              id: null,
              email: req.body.email,
              password: hashPwd
            });
            // console.log('Going to persist user: ' + newUser); // DEBUG

            newUser.save() // to store user MongoDB
            .then( saveUserResult => {
                     console.log('User with new _id=' + saveUserResult._id +' successfully saved into MongoDB');
                     return res.status(201)
                               .json({ message: 'New user successfully created' ,
                                       result: { ...saveUserResult, // shortcut to copy all fields
                                                 id: saveUserResult._id // add the id field for client
                                               }
                            }) // return the userID of the newly created user
                  })
            .catch(
                saveUserError => {
                  console.log('Failed to create user with ' + req.body.email +' into MongoDB (server error)');
                  // console.log(saveUserError.errors); // DEBUG on signup
                  return res.status(500)
                            .json({ message: 'Email address already in use !',
                                    result: saveUserError.errors
                          });
            });

        }).catch( error => { console.log("Bcrypt.hash failed with error=" + error + " and email=" + req.body.email + ' (server error)');
                             return res.status(500)
                                       .json({ message: 'Failed to create user', result: error })
                 })
}

// Controller function for user login
exports.userLogin = (req, res, next) => {

  const jwtExpDuration = process.env.JWT_EXP_DURATION_SEC; // Expiration duration in seconds
  const jwtExpDurationSec = jwtExpDuration + "s"; // Expiration duration, string in seconds)

  UserModel.findOne({ email: req.body.email })
           .then( user => {
              if (! user) {
                return res.status(401) // Unauthorized
                          .json({ message: "Authentication failed !" , result: 'no user' })
              }
              bcrypt.compare(req.body.password, user.password)
                    .then( result => {
                      if (! result) { // if false
                        return res.status(401) // Unauthorized
                                  .json({ message: "Authentication failed !" , result: 'compare is ' + result });
                      }
                      // As user's credentials are OK, we generate a token
                      const JWT_SECRET_KEY = process.env.JWT_HS256_KEY;
                      const jwtoken = jwt.sign( { email: user.email , id: user._id } ,
                                                  JWT_SECRET_KEY ,
                                                { expiresIn: jwtExpDurationSec, algorithm: process.env.JWT_ALGO } ); // s for 'in seconds' , hash & secret
                      return res.status(200) // OK and provide a token
                                .json({ token: jwtoken , expiresIn: jwtExpDuration, userId: user._id }); // return the JWT
                                                                                                         // along with the expiresIn value (seconds)
                                                                                                         // and the userId
                    })
                    .catch( error => {
                      console.error("Backend - bcrypt.compare failed !");
                        console.error(error);
                        return res.status(500) // Internal Server Error
                                  .json({ message: "Authentication error !" , error: error });
                    })
           })
}
