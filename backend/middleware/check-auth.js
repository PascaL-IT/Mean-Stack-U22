const jwt = require('jsonwebtoken');

module.exports=(req, res, next) => {

  try {
    // console.log(JSON.stringify(req.headers)); // DEBUG
    const jwtoken = req.headers.authorization.split(" ")[1]; // extract token from header
                                                           //  Authorization: Bearer <token>
    const JWT_SECRET_KEY = '5F26F7B6E23236E725F51E8775F3A'; // TODO -> improve by using a .env file
    let result = jwt.verify(jwtoken, JWT_SECRET_KEY); // see https://github.com/auth0/node-jsonwebtoken
    console.log("Check-auth -> jwt verify output: " + result); // DEBUG
    next();

  } catch(error) {
    console.log("Check-auth -> error: " + error); // DEBUG
    res.status(401).json({ error: "Authentication failed ! - invalid token" });
  }

}
