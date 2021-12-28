import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";
import { SelectMultipleControlValueAccessor } from "@angular/forms";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;

  postList: Post[] = []; // array of Posts updated via our post service

  constructor(public postService: PostsService) { }; // dependency injection

  private postSub: Subscription = new Subscription; // Observer

  ngOnInit(): void {
    this.postService.getPosts(); // trigger the HTTP request to retrieve JSON data from REST API (async call)
    this.isLoading = true;
    this.postSub = this.postService.getPostsUpdatedListener() // Listener on the Observable
                                   .subscribe( // Observer subscription
                                      (list_of_posts: Post[]) => {
                                        this.postList = list_of_posts;
                                        console.log("PostListComponent - ngOnInit: size of posts = " + this.postList.length);
                                        // setTimeout(() => { this.isLoading = false; } , 5000); // Mock latency of 5 sec
                                        this.isLoading = false;
                                      });
  };

  ngOnDestroy(): void {
    this.postSub.unsubscribe;
    console.log("ngOnDestroy: unsubscribe observer on posts update");
  }

  onDelete(postID : string) : void {
    this.postService.deletePost(postID);
  }

}

