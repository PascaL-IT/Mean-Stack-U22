import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Subject (Active observable)

  private responseMessage : string = '';

  private httpClient;
  constructor(hClient: HttpClient) {
    this.httpClient = hClient;
  }

  getPosts() {
    this.httpClient.get<{message:string, posts:Post[]}>('http://localhost:3000/api/posts')
    .subscribe( (jsonData) => { // observer
        this.responseMessage = jsonData.message;
        this.posts = jsonData.posts;
        this.postsUpdated.next([...this.posts]); // Subject .next()
        console.log("PostsService: getPosts >> " + this.responseMessage);
      });
    // getPosts
  }

  addPost(title:string, content:string) {
    const post: Post = { id: '' , title: title, content: content };
    this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post)
    .subscribe( (responseData) => { // observer
        this.responseMessage = responseData.message;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]); // Subject .next()
        console.log("PostsService: addPost >> " + this.responseMessage);
     });
    // addPost
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable(); // creates an Observable with this Subject as the source
    // getPostsUpdatedListener
  }

}
