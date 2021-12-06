import { Post } from "./post.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>(); // Subject (Active observable)

  getPosts() {
    return [...this.posts]; // return a new copy (not just the reference)
  }

  addPost(title:string, content:string) {
    const post: Post = { title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]); // Subject .next()
  }

  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }
}
