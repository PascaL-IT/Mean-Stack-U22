const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/posts');


const dbName = 'database1';
const clusterUri = 'cluster1.m3eok.mongodb.net';
const credentials = 'Pascal:MongoDB';
mongoose.connect("mongodb+srv://" + credentials + "@" + clusterUri + "/" + dbName +"?retryWrites=true&w=majority")
    .then(() => { console.log("Connected to MongoDB ("+clusterUri+" , "+dbName+")") })
    .catch(() => { console.log("Failed to connect to MongoDB ("+clusterUri+" , "+dbName+")") })


app.use("/images", express.static(path.join('backend/images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  next();
});

app.use('/api/posts', postRoutes);

/*
app.use("/", (req, res, next) => {
  console.log('Handle request and send a basic response ...');
  res.send("<h1>Default page from express.js</h1>");
  // app.use
});
*/

module.exports = app;
