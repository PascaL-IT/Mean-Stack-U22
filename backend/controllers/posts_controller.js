const PostModel = require('../models/post');


// Controller function used to retrieve a list of posts based pagination filters
exports.listOfPaginatedPosts = (req, res, next) => {
  console.log('Server handles GET request to fetch all posts data ...');
  const postModel = PostModel.find(); // to find all Mongoose's PostModel documents
  const pageSize = +req.query.pagesize; // pagesize=1,2,3,4,5,10,20...
  const pageIndex = +req.query.pageindex; // pageindex=0,1,2...

  let postDocuments;
  console.log('Pagination: pageSize=' + pageSize + ' , pageIndex=' + pageIndex); // DEBUG

  // On pagination, we skip and limit
  if (pageSize >= 1 && pageIndex >= 0) {
    postModel.skip(pageSize * pageIndex).limit(pageSize);
    console.log('Pagination: skip=' + (pageSize * pageIndex) + ' , limit=' + pageSize); // DEBUG
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
                                 maxPosts: postsCounter } );

             } else {
              console.log('Backend - size of posts=0 => no document found.');
              return res.status(404).json( { message: 'Empty list (no post found)' ,
                                             posts: null } );
             }
   }).catch( (error) => {
    console.log('List of posts not retrieved from MongoDB (server error)');
    return res.status(500).json({ message: 'Failed to retrieve list of posts', posts: null });
  });
} // router.get


// Controller function used to store a new post
exports.addNewPost = (req, res, next) => {
  console.log('Server handles POST request to create and store a new post data ...');

  let imagePath;
  if (req.file) {
    imagePath = req.protocol + '://' + req.get("host") + "/images/" + req.file.filename // build url from image file
  } else {
    imagePath = req.body.imagePath; // string
  }

  const userID = req.userData.userid;
  const newPost = new PostModel({
      id: null,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creatorId: userID
  });

  console.log('New post to persist: ' + newPost + ', by ' + userID);

  newPost.save() // to store post into MongoDB
         .then( (savePostResult) => {
                  console.log('Post ' + savePostResult._id +' successfully saved into MongoDB, by ' + userID);
                  return res.status(201)
                            .json({ message: 'New post successfully saved' ,
                                    post: {
                                            ...savePostResult, // shortcut to copy all fields
                                            id: savePostResult._id // add the id field for client
                                    }
                         }) // return the postID of the newly created post
                }, (error) => {
                  console.log('Post ' + savePostResult._id +' not saved into MongoDB, by ' + userID + ' (server error)');
                  return res.status(500).json({ message: 'Failed to save new post !', post: null });
                });
} // router.post


// Controller function used to delete an existing post
exports.deletePost = (req, res, next) => {
  const postID = req.params.id;
  const userID = req.userData.userid;
  console.log('Server handles DELETE request for post id='+ postID + ', by user id=' + userID);
  PostModel.deleteOne({ _id: postID , creatorId: userID })   // to delete one post from MongoDB
           .then( result => {
                // console.log("DEBUG: PostModel.deleteOne"); // DEBUG
                // console.log(result); // DEBUG
                if (result.deletedCount > 0) {
                  console.log('Post ' + postID + ' successfully deleted on MongoDB, by ' + userID);
                  return res.status(200).json({ message: 'Post with id=' + postID + ' successfully deleted' });
                } else {
                  console.log('Post ' + postID + ' not deleted on MongoDB, by ' + userID);
                  return res.status(401).json({ message: 'User not authorized to delete this post !' });
                }
             }).catch( (error) => {
               console.log('Post ' + postID + ' not deleted on MongoDB, by ' + userID + ' (server error)');
               return res.status(500).json({ message: 'Failed to delete post ' + postID + ' !'});
             });
} // router.post


// Controller function to update an existing post
exports.updatePost = (req, res, next) => {
  const postID = req.params.id;
  const userID = req.userData.userid;
  console.log('Server handles PUT request to update post id='+ postID + ', by ' + userID);
  // console.log(req.file); // DEBUG

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
    imagePath: imagePath,
    creatorId: userID
  });
  // console.log('Post to be updated: ' + updatedPost + ' by ' + userID ); // DEBUG

  // Check if the user is the post's owner
  PostModel.findOne({ _id: postID , creatorId: userID })
           .then( (document) => {
              // No update on no document found
              if (! document) {
                console.log('User ' + userID + ' is not the creator of post ' + postID);
                return res.status(401).json({ message: 'User not authorized to update this post !' });
              }
              // Update the document
              console.log('User ' + userID + ' is allowed to update post ' + postID  + ' as owner'); // creator
              PostModel.updateOne({ _id: postID , creatorId: userID }, updatedPost) // to update one post into MongoDB
                       .then( (result) => {  // console.log(result); // DEBUG

                          if (result.modifiedCount > 0) {
                            console.log('Post ' + postID + ' successfully updated on MongoDB, by ' + userID);
                            return res.status(200).json({ message: 'Post with id=' + postID + ' successfully updated'});
                          } else {
                            console.log('Post ' + postID + ' not updated on MongoDB (no modification detected)');
                            return res.status(200).json({ message: 'Post ' + postID + ' has no field to update' });
                          }
                       }).catch(
                         (error) => {
                            console.log('Post ' + postID + ' not updated on MongoDB, by ' + userID + ' (server error)');
                            return res.status(500).json({ message: 'Failed to update post with id=' + postID + ' !'});
                         }
                       );
          });
} // router.put


// Controller function to get an existing post
exports.onePost = (req, res, next) => {

  const postID = req.params.id;
  console.log('Server handles GET request to retrieve a post with id='+ postID);

  PostModel.findById({ _id: postID }) // to get one post from MongoDB
           .then( (post) => {
             if (post) {
                console.log('Post ' + postID + ' found on MongoDB');
                console.log(post);
                return res.status(200)
                          .json( { message: 'Found a post with id=' + postID,
                                   post: post } );
             } else {
                return res.status(404)
                          .json({ message: 'No post found with id=' + postID,
                                  post: null });
             } }).catch( (error) => {
               console.log('Post ' + postID + ' is not found on MongoDB (server error)');
               return res.status(500).json({ message: 'No post found with id=' + postID, post: null });
             });
} // router.get

