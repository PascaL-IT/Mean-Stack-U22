const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');


const dbName = process.env.MONGO_ATLAS_DB_NAME;
const clusterUri = process.env.MONGO_ATLAS_CLUSTER_URI;

mongoose.connect("mongodb+srv://" + process.env.MONGO_ATLAS_CREDENTIALS + "@" + clusterUri + "/" + dbName +"?retryWrites=true&w=majority")
    .then(() => { console.log("Connected to MongoDB ("+clusterUri+" , "+dbName+")") })
    .catch(() => { console.log("Failed to connect to MongoDB ("+clusterUri+" , "+dbName+")") })


app.use("/images", express.static(path.join('backend/images')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors (Cross-Origin Resource Sharing)
  res.setHeader("Access-Control-Allow-Origin", process.env.ACA_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", process.env.ACA_HEADERS);
  res.setHeader("Access-Control-Allow-Methods", process.env.ACA_METHODS);
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

/*
app.use("/", (req, res, next) => {
  console.log('Handle request and send a basic response ...');
  res.send("<h1>Default page from express.js</h1>");
  // app.use
});
*/

module.exports = app;
