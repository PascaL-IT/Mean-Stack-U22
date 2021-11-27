import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";

@Component( {
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: [ "./post-list.component.css" ]
})

export class PostListComponent { // implements OnInit { // }, OnDestroy {

@Input() postList: Post[] = []; // array of Post model, Input binding (solution 4 & 5)

/*
postList = [
    { title: "first post" , content: "first message" } ,
    { title: "second post" , content: "second message" } ,
    { title: "third post" , content: "third message" }
  ];
*/

//  postList: Post[] = []; // array of Post model used via service (solution 6)

/*
  private postSub: Subscription = new Subscription;

  constructor(public postService: PostsService) {}

  ngOnInit(): void {
    this.postList = this.postService.getPosts();
    console.log("ngOnInit: " + this.postList);
    this.postSub = this.postService.getPostsUpdatedListener().subscribe(
      (list_of_posts: Post[]) => { this.postList = list_of_posts; }
    );
    // throw new Error("Method not implemented.");
  };

  ngOnDestroy(): void {
    this.postSub.unsubscribe;
    console.log("ngOnDestroy");
  }
*/

}

