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
  postListSize = 0;

  // Pagination params
  pageList: Post[] = []; // array of Posts used for memory pagination
  pageIndex = 0; // default
  pageSize = 10; // default
  pageSizeOptions = [1,2,3,4,5,10]; // 20,50,100

  // Constructor used to inject the service (DI = dependency injection)
  constructor(public postService: PostsService) { }; //

  // Observer
  private postSub: Subscription = new Subscription;

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(); // trigger the HTTP request to retrieve JSON data from REST API (async call)

    this.postSub = this.postService.getPostsUpdatedListener() // Listener on the Observable
                                   .subscribe( // Observer subscription
                                      (list_of_posts: Post[]) => {
                                        this.postList = list_of_posts;
                                        this.postListSize = this.postList.length;
                                        this.onPaginationChange();
                                        console.log("PostListComponent - ngOnInit: size of posts = " + this.postListSize);
                                        // setTimeout(() => { this.isLoading = false; } , 5000); // Mock latency of 5 sec
                                        this.isLoading = false;
                                      });
  };

  ngOnDestroy(): void {
    this.postSub.unsubscribe;
    // console.log("ngOnDestroy: unsubscribe observer on posts update"); // DEBUG
  }

  onDelete(postID : string) : void {
    this.postService.deletePost(postID);
  }

  stringToHTML(text : string) : any {
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent;
  }

  onPageChange(event : PageEvent) {
    console.log("PostListComponent - onPageChange ...");
    // console.log(event); // DEBUG
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postListSize = event.length;
    this.onPaginationChange();
  }

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

}

