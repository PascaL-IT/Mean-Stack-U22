import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  postList: Post[] = []; // array of Posts updated via our post service
  postListMax = 0; // total number of posts on MongoDB

  // Pagination params
  pageList: Post[] = []; // array of Posts used for memory pagination
  pageIndex = 0; // default
  pageSize = 5; // default
  pageSizeOptions = [1,2,3,4,5,10]; // 20,50,100

  // Constructor used to inject the service (DI = dependency injection)
  constructor(public postService: PostsService) { }; //

  // Observer
  private postSub: Subscription = new Subscription;


  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.pageIndex); // trigger the HTTP request to retrieve JSON data from REST API (async call)
                                                              // two parameters used for pagination

    this.postSub = this.postService.getPostsUpdatedListener() // Listener on the Observable
                                   .subscribe( // Observer subscription
                                      ( responseData ) => {
                                          this.postList = responseData.posts;
                                          this.postListMax = responseData.postsMax;
                                          console.log("PostListComponent - ngOnInit: size of posts=" + this.postList.length + " on a total of " + this.postListMax);
                                          // this.onPaginationChange(); // obsoleted by pagination on backend side
                                          // setTimeout(() => { this.isLoading = false; } , 5000); // Mock latency of 5 sec
                                          this.isLoading = false;
                                      });


  };

  ngOnDestroy(): void {
    this.postSub.unsubscribe;
    // console.log("ngOnDestroy: unsubscribe observer on posts update"); // DEBUG
  }

  onDelete(postID : string) : void {
    this.isLoading = true;
    this.postService.deletePost(postID)
    .subscribe( (responseData) => { // observer
          this.isLoading = true;
          console.log("PostsService: deletePost >> " + responseData.message);
          if (this.postList.length <= 1 && this.pageIndex >= 1) {
            this.pageIndex -= 1;
          }
          this.postService.getPosts(this.pageSize, this.pageIndex); // get posts
     });
  }

  onPageChange(event : PageEvent) {
    // console.log("PostListComponent - onPageChange ..."); // DEBUG
    this.isLoading = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.pageIndex); // re-trigger the HTTP request
  }

  stringToHTML(text : string) : any {
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent;
  }


  /* Obsoleted by pagination on backend (no more in memory)
  onPaginationChange() {
    let x = this.pageIndex * this.pageSize; // Start at 0
    let y = this.pageSize * (this.pageIndex + 1); // step * (index + 1)

    if (this.postListSize < this.pageSize || y > this.postListSize) {
      y = this.postListSize; // limit to the max.
    }

    this.pageList = [];
    for (let i=x; i<y; i++) {
      this.pageList.push(this.postList[i]); // rebuild a list that matches the pagination params
    }
  }
  */

}

