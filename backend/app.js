const path = require("path");

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const { exit } = require("process");
require('dotenv').config();

const dbName = process.env.MONGO_ATLAS_DB_NAME;
const clusterUri = process.env.MONGO_ATLAS_CLUSTER_URI;

mongoose.connect("mongodb+srv://" + process.env.MONGO_ATLAS_CREDENTIALS + "@" + clusterUri + "/" + dbName + "?retryWrites=true&w=majority")
  .then(() => { console.log("Connected to MongoDB (" + clusterUri + " , " + dbName + ")") })
  .catch(() => { console.log("Failed to connect to MongoDB (" + clusterUri + " , " + dbName + ")") })

// Create an 'images' directory if missing
const imagesDir = 'images';
app.use("/" + imagesDir, express.static(path.join(imagesDir)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors (Cross-Origin Resource Sharing)
  res.setHeader("Access-Control-Allow-Origin", process.env.ACA_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", process.env.ACA_HEADERS);
  res.setHeader("Access-Control-Allow-Methods", process.env.ACA_METHODS);
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
