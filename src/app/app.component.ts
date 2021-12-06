import { Component } from '@angular/core';
import { Post } from "./posts/post-list/post.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'udemy-mean-course';

  /*
  // Solution 4 and 5 with various bindings
  appPosts: Post[] = [];

  onNewCreatedPost(post: Post) {
    this.appPosts.push(post);
  };
  */

}
