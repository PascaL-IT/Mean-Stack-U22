import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";


@Injectable({providedIn: 'root'})
export class PostsService {

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
    .get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    .pipe( map( (jsonData) => { // transform by mapping _id to id
            return { message: jsonData.message ,
                     posts: jsonData.posts.map( (p: any) => {
                        return { id: p._id , title: p.title, content: p.content };
            }) } }  ) )
    .subscribe( (jsonData) => { // observer
        this.responseMessage = jsonData.message;
        this.posts = jsonData.posts;
        this.postsUpdated.next([...this.posts]); // Subject .next()
        console.log("PostsService: getPosts >> message: " + this.responseMessage);
      });
    // getPosts
  }

  // This function add a new post to the backend database
  addPost(title:string, content:string) {
    const post: Post = { id: '' , title: title, content: content };
    this.httpClient.post<{message: string, postID: string}>('http://localhost:3000/api/posts', post)
    .subscribe( (responseData) => { // observer
        this.responseMessage = responseData.message;
        post.id = responseData.postID; // update post with his auto-generated ID
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // Subject .next()
        console.log("PostsService: addPost >> " + this.responseMessage);
        this.router.navigate(["/"]);
     });
    // addPost
  }

  // This function delete an existing post on the backend database, by his ID
  deletePost(postID : string) {
    this.httpClient.delete<{message: string}>('http://localhost:3000/api/posts/' + postID)
                   .subscribe( (responseData) => { // observer
                       this.responseMessage = responseData.message;
                       this.posts = this.posts.filter(p => p.id !== postID); // TIP to remove the post with this postID
                       this.postsUpdated.next([...this.posts]); // Subject .next() -> save a new copy of list of posts
                       console.log("PostsService: deletePost >> " + this.responseMessage);
                   });
    // deletePost
  }

  // This function retrieves a post available in memory, by his Id
  getMemoryPost(id: string) {
     const post: Post = this.posts.find(p => p.id === id) || { id: id, title: '', content: '' };
     console.log("PostsService: getMemoryPost >> post id=" + post.id + ' , title=' + post.title + ' , content=' + post.content);
     return post;
  }

  // This function retrieves a post available in database, by his Id (return an Observable)
  getPost(id: string) {
    console.log("PostsService: getPost >> post id=" + id);
    return this.httpClient.get<{ message: string , post: any }>('http://localhost:3000/api/posts/' + id);
  }


  // This function update an existing post on the backend database, by his ID
  updatePost(postID : string, title: string, content: string) {
      const post: Post = { id: postID, title: title, content: content };
      this.httpClient.put<{message: string}>('http://localhost:3000/api/posts/' + postID, post)
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
