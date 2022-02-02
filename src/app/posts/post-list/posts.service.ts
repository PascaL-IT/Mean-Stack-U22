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
  private postsUpdated = new Subject<{ posts: Post[], postsMax: number, pageSize: number, pageIndex: number }>(); // Subject (Active observable)

  // private responseMessage : string = '';
  // private responseMaxPosts : number = 0;

  // Constructor
  private httpClient;
  constructor(hClient: HttpClient, private router: Router) {
    this.httpClient = hClient;
  }

  // This function retrieves the posts from the backend database as per the pagination params
  getPosts(pageSize: number, pageIndex: number) {
    const pageQueryParams : string = "?pagesize=" + pageSize + '&pageindex=' + pageIndex;

    this.httpClient
              .get<{ message: string, posts: any, maxPosts: number }>(this.baseUrl + pageQueryParams)
              .pipe( map( (jsonData) => { // transform by mapping _id to id
                      return {
                               message: jsonData.message ,
                               maxPosts: jsonData.maxPosts ,
                               posts: jsonData.posts.map( (post: any) => {
                                  return { id: post._id , title: post.title, content: post.content, imagePath: post.imagePath };
                               }
                      ) } }  ) )
              .subscribe( (jsonData) => { // observer
                  // this.responseMessage = jsonData.message;
                  // this.responseMaxPosts = jsonData.maxPosts;
                  this.posts = jsonData.posts; // subset of list of posts
                  this.postsUpdated.next({ posts: [...this.posts], postsMax: jsonData.maxPosts, pageSize: pageSize, pageIndex: pageIndex }); // Subject .next()
                  console.log("PostsService: getPosts >> message: " + jsonData.message + " (total/max. of posts="+jsonData.maxPosts+")");
                });
    // getPosts
  }

  // This function add a new post to the backend database, and store a file if any
  addPost(postTitle: string, postContent: string, postImage: File | string) {

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
        // this.responseMessage = response.message;
        /* Obsoleted by pagination
        const post: Post = { id: response.post.id , // update post with the auto-generated ID from response (MongoDB)
                             title: response.post.title,
                             content: response.post.content,
                             imagePath: response.post.imagePath
                           };
        this.posts.push(post);
        this.postsUpdated.next(posts: [...this.posts]); // Subject .next()
        */
        console.log("PostsService: addPost >> " +  response.message);
        this.router.navigate(["/"]);
     });
    // addPost
  }


  // This function delete an existing post on the backend database, by his ID
  deletePost(postId: string) {
    return this.httpClient.delete<{message: string}>(this.baseUrl + postId); // TIP : return an Observable
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
  updatePost(postId: string, postTitle: string, postContent: string, postImage: File | string) {
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
    return this.postsUpdated.asObservable(); // observable
    // getPostsUpdatedListener
  }

}
