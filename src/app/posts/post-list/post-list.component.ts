import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent { // implements OnInit { // }, OnDestroy {

  // @Input() postList: Post[] = []; // array of Post model, Input binding (solution 4 & 5)

  /*
  postList = [
      { title: "first post" , content: "first message" } ,
      { title: "second post" , content: "second message" } ,
      { title: "third post" , content: "third message" }
    ];
  */

  postList: Post[] = []; // array of Posts consumed via our post service (solution 6)

  constructor(public postService: PostsService) { }; // dependency injection

  private postSub: Subscription = new Subscription; // Observer

  ngOnInit(): void {
    // this.postList = this.postService.getPosts();
    // console.log("ngOnInit: " + this.postList);
    this.postService.getPosts(); // trigger the HTTP request to retrieve JSON data from REST API
    this.postSub = this.postService.getPostsUpdatedListener() // Listener on the Observable
                                   .subscribe( // Observer subscription
                                      (list_of_posts: Post[]) => { this.postList = list_of_posts; }
                                   );
  };

  ngOnDestroy(): void {
    this.postSub.unsubscribe;
    console.log("ngOnDestroy");
  }

}

