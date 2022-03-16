import { Component, OnDestroy, OnInit } from "@angular/core";
import { Post } from "./post.model";
import { PostsService } from "./posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ["./post-list.component.css"]
})

export class PostListComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  userIsAuthenticated : boolean = false;
  userId : string = '';
  postList: Post[] = []; // array of Posts updated via our post service
  postListMax = 0; // total number of posts on MongoDB

  // Pagination params
  pageList: Post[] = []; // array of Posts used for memory pagination
  pageIndex = 0; // default
  pageSize = 5; // default
  pageSizeOptions = [1,2,3,4,5,10]; // 20,50,100

  // Constructor used to inject services (DI = dependency injection)
  constructor(public postService: PostsService, private authService: AuthService) { };

  // Observer to be updated on posts
  private postSub: Subscription = new Subscription();
  private userStateSub: Subscription = new Subscription();


  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.pageIndex); // trigger the HTTP request to retrieve JSON data from REST API (async call)
                                                              // two parameters used for pagination

    this.postSub = this.postService.getPostsUpdatedListener() // Listener gives an Observable
                                   .subscribe( // Observer subscription
                                      ( responseData ) => {
                                          this.postList = responseData.posts;
                                          this.postListMax = responseData.postsMax;
                                          console.log("PostListComponent - ngOnInit: size of posts=" + this.postList.length + " on a total of " + this.postListMax);
                                          // this.onPaginationChange(); // obsoleted by pagination on backend side
                                          // setTimeout(() => { this.isLoading = false; } , 5000); // Mock latency of 5 sec
                                          this.isLoading = false;
                                      });

    this.userIsAuthenticated = this.authService.getUserAuthStatus(); // TIP, required during initialization,
                                                                     //  since no new event raised from below listener (user is already authenticate!)
    this.userId = this.authService.getAuthUserId();

    this.userStateSub = this.authService.getAuthStatusListener()
                                        .subscribe( event => {  this.userIsAuthenticated = event.state; // assign updated state
                                                                this.userId = event.userid;  // assign updated userid
                                                                console.log("PostListComponent - ngOnInit: userId="+ this.userId +" , userIsAuthenticated="+this.userIsAuthenticated); });
  }; // ngOnInit

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.userStateSub.unsubscribe();
  } // ngOnDestroy

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
  } // onDelete

  onPageChange(event : PageEvent) {
    // console.log("PostListComponent - onPageChange (paginator)..."); // DEBUG
    this.isLoading = true;
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.pageIndex); // re-trigger the HTTP request
  } // onPageChange

  stringToHTML(text : string) : any {
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent;
  }

}

