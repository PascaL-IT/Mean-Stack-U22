import { Component, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "../post-list/post.model";
import { PostsService } from "../post-list/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent {

  minLengthContent = 20;
  minLengthTitle = 4;

  // Solution 1
  newPostContent = '...'
  onAddPost(postInput: HTMLTextAreaElement) {
    alert("Post created via Solution 1 !")
    // console.log(postInput)
    // console.dir(postInput)
    this.newPostContent = postInput.value
  }

  // Solution 2
  enteredPostValue = ''
  onAddPostValue() {
    alert("Post created via Solution 2 !")
    this.newPostContent = this.enteredPostValue
  }

  // Solution 3
  onAddPostValue3() {
    alert("Post created via Solution 3 !")
    this.newPostContent = this.enteredPostValue
  }

  // Solution 4 (event with @Output)
  enteredPostTitle = '';
  enteredPostContent = '';
  // @Output() postCreated = new EventEmitter<Post>(); // Output binding (solution 4 & 5)

  onAddPostValue4() {
    alert("Post created via Solution 4 !")
    const post: Post = {
      title: this.enteredPostTitle,
      content: this.enteredPostContent
    };
    // this.postCreated.emit(post);
  }

  // Solution 5 (form and event with @Output)
  onAddPostValue5(form: NgForm) {
    // alert("Post created via Solution 5 !")
    if (form.invalid) {
      return; // avoid emitting on invalid inputs
    }
    const post: Post = {
      title: form.value.postTitle,
      content: form.value.postContent
    };
    // this.postCreated.emit(post);
  }

  // Solution 6 (form and service via DI)
  constructor(public postService: PostsService) { }; // dependency injection

  onAddPostValue6(form: NgForm) {
    // alert("Post created via Solution 6 !")
    if (form.invalid) {
      return; // avoid emitting on invalid inputs
    }
    this.postService.addPost(form.value.postTitle, form.value.postContent);
    form.resetForm();
  }

}
