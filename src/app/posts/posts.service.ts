import { Post } from "./post.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { PostFilters } from "./post-list/post-list.filter.model";


@Injectable({providedIn: 'root'})
export class PostsService {

  private API_POSTS_URL: string = environment.baseApiURL + '/posts/';

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postsMax: number, pageSize: number, pageIndex: number }>(); // Subject (Active observable)
  private currentPageSize = 5;
  private currentPageIndex = 0;
  private currentPostsMax = 0;

  // Constructor
  private httpClient;
  constructor(hClient: HttpClient, private router: Router) {
    this.httpClient = hClient;
  }

  // This function retrieves the posts from the backend database as per the pagination params
  getPosts(pageSize: number, pageIndex: number, filters: PostFilters) {

    const QUERY_PARAMS = "?pagesize=" + pageSize + '&pageindex=' + pageIndex + '&textsearch=' + filters.text;
    const QUERY_PATH = filters.userid ? ("/user/" + filters.userid) : "";

    this.httpClient
              .get<{ message: string, posts: any, maxPosts: number }>(this.API_POSTS_URL + QUERY_PATH + QUERY_PARAMS)
              .pipe( map( (jsonData) => { // transform by mapping _id to id
                      return {
                               message: jsonData.message ,
                               maxPosts: jsonData.maxPosts ,
                               posts: jsonData.posts.map( (post: any) => {
                                  return { id: post._id ,
                                           title: post.title,
                                           content: post.content,
                                           imagePath: post.imagePath,
                                           creatorId: post.creatorId  };
                               } ) } } ) )
              .subscribe(
                    (jsonData) => { // observer
                  this.posts = jsonData.posts; // subset of list of posts
                  this.currentPageSize = pageSize;
                  this.currentPageIndex = pageIndex;
                  this.currentPostsMax = jsonData.maxPosts;
                  this.postsUpdated.next({ posts: [...this.posts], postsMax: jsonData.maxPosts, pageSize: pageSize, pageIndex: pageIndex }); // Subject .next() => notify
                  console.log("PostsService: getPosts >> message: " + jsonData.message + " (total/max. of posts="+jsonData.maxPosts+")");
                } , (errorMessage) => {
                  console.log("PostsService: getPosts >> status: " + errorMessage.status + " , error: " + errorMessage.statusText);
                  if (errorMessage.status === undefined) {
                    this.postsUpdated.next({ posts: [  { id: '', title: 'No result found ...', content: '', imagePath: '', creatorId: '' } ], postsMax: 1, pageSize: 0, pageIndex: 0 }); // Subject .next() => notify
                  } else {
                    this.postsUpdated.next({ posts: [  { id: '', title: 'Failed to get posts - technical error !', content: errorMessage.status, imagePath: '', creatorId: '' } ], postsMax: 1, pageSize: 0, pageIndex: 0 }); // Subject .next() => notify
                  }
                });
  } // getPosts


  // This function add a new post to the backend database, and store a file if any
  addPost(postTitle: string, postContent: string, postImage: File | string) {

    let postData: Post | FormData;
    if (typeof postImage === 'string') {
      console.log("addPost: (String) postImage: " + postImage);
      postData = { id: '', title: postTitle, content: postContent, imagePath: postImage, creatorId: '' };

    } else { // === 'object'
      console.log("addPost: (Object) postImage: " + postImage);
      // console.log(postImage); // DEBUG
      postData = new FormData();
      postData.append("id", '');
      postData.append("title", postTitle);
      postData.append("content", postContent);
      postData.append("image", postImage, postImage.name); // "image" as multer({storage: imageStorage}).single("image")
    }

    this.httpClient.post<{message: string, post: Post}>(this.API_POSTS_URL, postData)
                   .subscribe( (response) => { // observer
                      console.log("PostsService: addPost >> " + response.message);
                      let computedPageIndex = Math.trunc((this.currentPostsMax + 1) / this.currentPageSize);
                      if ( ((this.currentPostsMax + 1) % this.currentPageSize) == 0 ) {
                        computedPageIndex -= 1;
                      }
                      this.router.navigate(["/"], { queryParams: { pagesize: this.currentPageSize ,
                                                                   pageindex: computedPageIndex } }); // go to end of list
                    } , (error) => {
                      console.log("PostsService: addPost >> error=" + error.message);
                      this.router.navigate(["/"]);
                    });
  } // addPost


  // This function delete an existing post on the backend database, by his ID
  deletePost(postId: string) {
    return this.httpClient.delete<{message: string}>(this.API_POSTS_URL + postId); // TIP : return an Observable
  } // deletePost


  // This function retrieves a post available in memory, by his Id
  getMemoryPost(postId: string) {
     const post: Post = this.posts.find(p => p.id === postId) || { id: postId, title: '', content: '', imagePath: '', creatorId: '' };
     console.log("PostsService: getMemoryPost >> post id=" + post.id + ' , title='
                   + post.title + ' , content=' + post.content + ' , imagePath=' + post.imagePath
                   + ' , creatorId=' + post.creatorId );
     return post;
  } // getMemoryPost


  // This function retrieves a post available in database, by his Id (return an Observable)
  getPost(postId: string) {
    console.log("PostsService: getPost >> post id=" + postId);
    return this.httpClient.get<{ message: string ,
                                 post: { _id: string, title: string, content: string, imagePath: string, creatorId: string }
                               }>(this.API_POSTS_URL + postId);
  } // getPost


  // This function update an existing post on the backend database, by his ID
  updatePost(postId: string, postTitle: string, postContent: string, postImage: File | string) {
      let postData: Post | FormData;
      if (typeof postImage === 'string') {
        postData = { id: postId, title: postTitle, content: postContent, imagePath: postImage, creatorId: '' };

      } else { // === 'object'
        postData = new FormData();
        postData.append("id", postId);
        postData.append("title", postTitle);
        postData.append("content", postContent);
        postData.append("image", postImage, postImage.name); // "image" as multer({storage: imageStorage}).single("image")
      }

      this.httpClient.put<{ message: string }>(this.API_POSTS_URL + postId, postData)
                     .subscribe( (response) => { // observer
                          console.log("PostsService: updatePost >> response=" + response.message);
                          this.router.navigate(["/"], { queryParams: { pagesize: this.currentPageSize ,
                                                                       pageindex: this.currentPageIndex } });
                          } , (error: any) => { // observer
                          console.log("PostsService: updatePost >> error=" + error.message);
                          this.router.navigate(["/"]);
                     });
  } // updatePost


  // Get the observable on updated posts
  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable(); // observable
  } // getPostsUpdatedListener

}
