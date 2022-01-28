import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostsService {

  private baseUrl: string = 'http://localhost:3000/api/posts/';

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Subject (Active observable)

  private responseMessage : string = '';

  // Constructor
  private httpClient;
  constructor(hClient: HttpClient, private router: Router) {
    this.httpClient = hClient;
  }

  // This function retrieves all the posts available from the backend database
  getPosts() {
    this.httpClient
              .get<{ message: string, posts: any }>(this.baseUrl)
              .pipe( map( (jsonData) => { // transform by mapping _id to id
                      return { message: jsonData.message ,
                               posts: jsonData.posts.map( (post: any) => {
                                  return { id: post._id , title: post.title, content: post.content, imagePath: post.imagePath };
                      }) } }  ) )
              .subscribe( (jsonData) => { // observer
                  this.responseMessage = jsonData.message;
                  this.posts = jsonData.posts;
                  this.postsUpdated.next([...this.posts]); // Subject .next()
                  console.log("PostsService: getPosts >> message: " + this.responseMessage);
                });
    // getPosts
  }

  // This function add a new post to the backend database, and store a file if any
  addPost(postTitle:string, postContent:string, postImage: File | string) {

    let postData: Post | FormData;
    if (typeof postImage === 'string') {
      console.log("(String) postImage: " + postImage); // DEBUG
      postData = { id: '', title: postTitle, content: postContent, imagePath: postImage };
    } else { // === 'object'
      console.log("(Object) postImage: " + postImage); // DEBUG
      console.log(postImage); // DEBUG
      postData = new FormData();
      postData.append("id", '');
      postData.append("title", postTitle);
      postData.append("content", postContent);
      postData.append("image", postImage, postImage.name); // as multer({storage: imageStorage}).single("image")
    }

    this.httpClient.post<{message: string, post: Post}>(this.baseUrl, postData)
     .subscribe( (response) => { // observer
        this.responseMessage = response.message;
        const post: Post = { id: response.post.id , // update post with the auto-generated ID from response (MongoDB)
                             title: response.post.title,
                             content: response.post.content,
                             imagePath: response.post.imagePath
                           };
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // Subject .next()
        console.log("PostsService: addPost >> " + this.responseMessage);
        this.router.navigate(["/"]);
     });
    // addPost
  }


  // This function delete an existing post on the backend database, by his ID
  deletePost(postId : string) {
    this.httpClient.delete<{message: string}>(this.baseUrl + postId)
                   .subscribe( (responseData) => { // observer
                       this.responseMessage = responseData.message;
                       this.posts = this.posts.filter(p => p.id !== postId); // TIP to remove the post having this postId
                       this.postsUpdated.next([...this.posts]); // Subject .next() -> save a new copy of list of posts
                       console.log("PostsService: deletePost >> " + this.responseMessage);
                   });
    // deletePost
  }


  // This function retrieves a post available in memory, by his Id
  getMemoryPost(postId: string) {
     const post: Post = this.posts.find(p => p.id === postId) || { id: postId, title: '', content: '', imagePath: '' };
     console.log("PostsService: getMemoryPost >> post id=" + post.id + ' , title='
                   + post.title + ' , content=' + post.content + ' , imagePath=' + post.imagePath);
     return post;
  }


  // This function retrieves a post available in database, by his Id (return an Observable)
  getPost(postId: string) {
    console.log("PostsService: getPost >> post id=" + postId);
    return this.httpClient.get<{ message: string , post: any }>(this.baseUrl + postId);
  }


  // This function update an existing post on the backend database, by his ID
  updatePost(postId : string, postTitle: string, postContent: string, postImage: File | string) {
      let postData: Post | FormData;
      if (typeof postImage === 'string') {
        postData = { id: postId, title: postTitle, content: postContent, imagePath: postImage };
      } else { // === 'object'
        postData = new FormData();
        postData.append("id", postId);
        postData.append("title", postTitle);
        postData.append("content", postContent);
        postData.append("image", postImage, postImage.name); // as multer({storage: imageStorage}).single("image")
      }

      this.httpClient.put<{message: string}>(this.baseUrl + postId, postData)
                     .subscribe( (response) => { // observer
                        console.log("PostsService: updatePost >> responseData=" + response.message);
                        this.router.navigate(["/"]);
                     });
      // updatePost
  }


  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable(); // creates an Observable with this Subject as the source
    // getPostsUpdatedListener
  }

}
