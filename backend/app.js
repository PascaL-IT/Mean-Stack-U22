const express = require('express');
const bodyParser = require('body-parser');
const PostModel = require('./models/post');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
  // Set headers to avoid CORS errors
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  next();
});

// app.use vs. app.get
app.get('/api/posts', (req, res, next) => {
  console.log('Server handles GET request and posting data ...');
  // Dummy hardcoded posts for testing
  const posts = [
    {
      id: '1faegh',
      title: 'Title1 - post1',
      content: 'Content1 - post1'
    }, {
      id: '2faegh',
      title: 'Title2 - post2',
      content: 'Content2 - post2'
    }]
    return res.status(200).json( { message: 'List of posts successfully posted...' , posts: posts } );
  // app.get
});

/*
app.use("/", (req, res, next) => {
  console.log('Handle request and send a basic response ...');
  res.send("<h1>Default page from express.js</h1>");
  // app.use
});
*/

app.post('/api/posts', (req, res, next) => {
  console.log('Server handles POST request and store post data ...');
  // const post = req.body;
  const post = new PostModel({
      title: req.body.title,
      content: req.body.content
  });
  console.log('new post: ' + post.title + " - "+ post.content + " : post=" + post);
  return res.status(201).json({ message: 'New post added successfully to backend...' })
  // app.post
});

module.exports = app;
