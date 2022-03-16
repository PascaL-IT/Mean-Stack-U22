const jwt = require('jsonwebtoken');

module.exports=(req, res, next) => {

  const JWT_SECRET_KEY = '5F26F7B6E23236E725F51E8775F3A'; // duplicated code -> TODO : improving  by using a .env file

  try {
    // console.log(JSON.stringify(req.headers)); // DEBUG
    const jwtoken = req.headers.authorization.split(" ")[1]; // extract token from header, i.e. Authorization: Bearer <token>
    const result = jwt.verify(jwtoken, JWT_SECRET_KEY, { algorithms: [ 'HS256' ] , complete: true } ); // see https://github.com/auth0/node-jsonwebtoken
    // console.log(result); // DEBUG - https://datatracker.ietf.org/doc/html/rfc7519#page-9
    req.userData = { email: result.payload.email ,
                     userid: result.payload.id         }; // add user's email and id to the request for next treatments (TIP)
    next();

  } catch(error) {
    console.log("Check-auth -> error: " + error);
    res.status(401).json({ message: "Authentication failed (invalid token) !" });
  }

}
