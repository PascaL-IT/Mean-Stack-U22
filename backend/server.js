const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const fs = require("fs");
const path = require("path");

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
  console.log("Server is listening on PORT=" + addr.port);
};

const port = normalizePort(process.env.PORT || "8626"); // PORT=8626 node server.js
app.set("port", port); // set the TCP port to the APP

const server = http.createServer(app); // create a server from the APP
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);

// Create an 'images' directory if missing
const imagesDir = 'images';
const pathDir = path.join(__dirname, imagesDir);
console.log("Server app directory is '" + __dirname + "'");
if (!fs.existsSync(pathDir)) {
  fs.mkdirSync(pathDir);
  if (fs.existsSync(pathDir)) {
    console.log("Create the '" + pathDir + "' directory at " + new Date(Date.now()));
  } else {
    console.error("Directory '" + pathDir + "' can NOT be created at " + new Date(Date.now()));
    exit(1);
  }
} else {
  console.error("Directory '" + imagesDir + "' exists at " + new Date(Date.now()));
}
