const express = require('express');
const PostModel = require('../models/post');
const multer = require('multer');
const router = express.Router();
const CheckAuth = require('../middleware/check-auth');

// Supported MimeTypes for images
const MIME_TYPE_MAP = {
    'image/png'  : 'png'  ,
    'image/jpeg' : 'jpeg' ,
    'image/jpg'  : 'jpg'
}

// Disk storage for images by Multer
const imageStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        const isValidExt = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if (! isValidExt) {
          error = new Error("Unsupported File (invalid MimeType)");
        }
        cb(error, "backend/images");
    },
      filename: (req, file, cb) => {
        // replace spaces by _ and remove the file extension if any
        const filename = file.originalname.toLowerCase().split(' ').join('_').replace(/\.[^.$]+$/, '');
        const fileext = MIME_TYPE_MAP[file.mimetype]; // select the extension
        const uniqueFilename = filename + '_' + Date.now() + '.' + fileext;
        cb(null, uniqueFilename);
        // console.log("imageStorage: uniqueFilename="+uniqueFilename); // DBEUG
    }
});


// REST PATH for POSTS is '/api/posts'

// REST API : GET (READ) -> list of posts from database, with pagination params
router.get('', (req, res, next) => {
  console.log('Server handles GET request to fetch all posts data ...');
  const postModel = PostModel.find(); // to find all Mongoose's PostModel documents
  const pageSize = +req.query.pagesize; // pagesize=1,2,3,4,5,10,20...
  const pageIndex = +req.query.pageindex; // pageindex=0,1,2...
  let postDocuments;

  // On pagination, we skip and limit
  if (pageSize >= 1 && pageIndex >= 0) {
    postModel.skip(pageSize * pageIndex).limit(pageSize);
    // console.log('Pagination occured...'); // DEBUG
  }
  // Then count the documents
  postModel.then(
    (documents) => {
      postDocuments = documents; // keep a reference of posts
      return PostModel.count(); // counting nbr. of documents
  })
  // Then return the reponse
  .then((postsCounter) => {
             if (postDocuments && postsCounter > 0) {
              console.log('Backend - size of posts=' + postDocuments.length + ' on a total of ' + postsCounter + ' (as Page size=' + pageSize + ' and index=' + pageIndex + ')');
              return res.status(200)
              .json( { message: 'List of ' + postDocuments.length + ' posts successfully fetched for posting with pagination' ,
                       posts: postDocuments,
                       maxPosts: postsCounter
                       } );
             } else {
              console.log('Backend - size of posts=0 => no document found.');
              return res.status(404)
              .json( { message: 'List of posts is empty, no post found yet for posting ...' ,
                       posts: null } );
             }
   });

  // router.get
});


// REST API : POST (CREATE) -> store a new post into MongoDB, and the 'image' on disk drive
router.post('', CheckAuth, multer({storage: imageStorage}).single("image"), (req, res, next) => {
  console.log('Server handles POST request to create and store a new post data ...');

  let imagePath;
  if (req.file) {
    imagePath = req.protocol + '://' + req.get("host") + "/images/" + req.file.filename // build url from image file
  } else {
    imagePath = req.body.imagePath; // string
  }

  const newPost = new PostModel({
      id: null,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
  });

  console.log('New post to persist: ' + newPost);

  newPost.save() // to store post into MongoDB
         .then( savePostResult => {
                  console.log('Post with new _id=' + savePostResult._id +' successfully saved into MongoDB');
                  return res.status(201)
                            .json({ message: 'New post saved successfully to MongoDB (backend)' ,
                                    post: {
                                            ...savePostResult, // shortcut to copy all fields
                                            id: savePostResult._id // add the id field for client
                                    }
                         }) // return the postID of the newly created post
        } );

  // router.post
});


// REST API : DELETE (ERASE) -> delete a post from database with his _id
router.delete('/:id', CheckAuth, (req, res, next) => {
  const postID = req.params.id;
  console.log('Server handles DELETE request for post id='+ postID);
  PostModel.deleteOne({ _id: postID })   // to delete one post from MongoDB
           .then( result => {
             console.log(result); // DEBUG
             console.log('Post with _id=' + postID + ' successfully deleted on MongoDB');
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' deleted on MongoDB (backend)' });
             });
  // router.post
});


// REST API : PUT (UPDATE) -> replace fields of a post onto the database
// Reminder on PATCH vs. PUT : https://blog.eq8.eu/article/put-vs-patch.html
router.put('/:id', CheckAuth, multer({storage: imageStorage}).single("image"), (req, res, next) => {
  const postID = req.params.id;
  console.log('Server handles PUT request to update post with id='+ postID);
  console.log(req.file); // DEBUG

  let imagePath;
  if (req.file) {
    imagePath = req.protocol + '://' + req.get("host") + "/images/" + req.file.filename // build url from image file
  } else {
    imagePath = req.body.imagePath; // string
  }

  const updatedPost = new PostModel({
    _id: postID ,
    title: req.body.title ,
    content: req.body.content,
    imagePath: imagePath
  });

  console.log('Post to update: ' + updatedPost);

  PostModel.updateOne({ _id: postID }, updatedPost) // to update one post into MongoDB
           .then( (updateOneResult) => {
             // console.log("DEBUG updateOneResult ...");
             // console.log(updateOneResult); // DEBUG
             console.log('Post with _id=' + postID + ' successfully updated on MongoDB');
             return res.status(200)
                       .json({ message: 'Post with id=' + postID + ' updated on MongoDB (backend)' });
           });

  // router.put (or router.patch)
});


// REST API : GET (READ) -> retrieve a post from the database, by his Id
router.get('/:id', (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles GET request to retrieve a post with id='+ postID);

  PostModel.findById({ _id: postID }) // to get one post from MongoDB
           .then( (post) => {
             if (post) {
                console.log('Post with _id=' + postID + ' found on MongoDB : ' + post);
                return res.status(200)
                          .json( { message: 'Post with id=' + postID + ' found on MongoDB (backend)' ,
                                   post: post } );
             } else {
                return res.status(404)
                          .json({ message: 'No post found with id=' + postID + ' on MongoDB (backend)' ,
                                  post: null });
             }
           });

  // router.get
});

module.exports = router;
