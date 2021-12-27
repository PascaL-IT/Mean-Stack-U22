import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post-list/post.model";
import { PostsService } from "../post-list/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit {

  public minLengthContent = 10;
  public minLengthTitle = 4;
  public pccPost: Post;

  private mode: string = 'create'; // edit | create

  // Section_5_66 : inject ActivatedRoute to determine the mode (edit|create) on init
  constructor(public postService: PostsService, public route: ActivatedRoute) {
    this.pccPost = { id: '' , content: '' , title: '' };
  }

  ngOnInit(): void {
    console.log("PostCreateComponent - DEBUG: route=" + this.route.toString());
    this.route.url.subscribe((url) => { this.mode = url[0].path }); // find the mode by analysing the route path
    this.route.paramMap.subscribe( (paramMap: ParamMap) =>
      {
        // Edit mode
        if (this.mode === 'edit' && paramMap.has('postId')) { // check if Id presents
          this.pccPost.id = paramMap.get('postId') || ''; // retrieve parameter value
          this.pccPost = this.postService.getPost(this.pccPost.id); // get existing post from cache memory

        // Creation mode
        } else if  (this.mode === 'create') {
          this.pccPost.id = '';

        // Unsupported mode
        } else {
          throw new Error("Unsupported mode (either 'edit/:id' or 'create' routes)");
        }
      }
    )
    console.log("PostCreateComponent - ngOnInit: mode=" + this.mode);
  }

  // Method called on Save button click
  onSavePostValue(form: NgForm) {
    // alert("Post saved on MongoDB !")
    if (form.invalid) {
      return; // avoid emitting on invalid inputs
    }

    if (this.mode === 'create') {
      // save a new post after create
      this.postService.addPost(form.value.postTitle, form.value.postContent);

    } else {
      // save an existing post after edit
      this.postService.updatePost(this.pccPost.id, form.value.postTitle, form.value.postContent);
    }

    form.resetForm();
  }

}
