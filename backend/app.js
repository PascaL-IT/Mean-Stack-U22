const express = require('express');

const app = express();

app.use( (req, res, next) => {
  console.log('First express app ...');
  next();
});

app.use( (req, res, next) => {
  console.log('Handle request and send a response ...');
  res.send("Hello from express.js");
});

module.exports = app;
