import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post-list/post.model";
import { PostsService } from "../post-list/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ["./post-create.component.css"]
})

export class PostCreateComponent implements OnInit {

  private mode: string = 'create'; // edit | create

  minLengthContent = 10; // public per default
  minLengthTitle = 4;
  pccPost: Post;
  postLabel = 'Enter your post:';
  isLoading : boolean = false;
  imagePreview : string = '';

  postForm: FormGroup = new FormGroup({
    'postTitle' : new FormControl(null, { validators: [Validators.required, Validators.minLength(this.minLengthTitle)]} ),
    'postContent' : new FormControl(null, { validators: [Validators.required, Validators.minLength(this.minLengthContent)]} ),
    'postImage' : new FormControl(null) //, { validators: [Validators.required]} )
  })

  constructor(public postService: PostsService,
              public route: ActivatedRoute       ) {
    this.pccPost = { id: '' , content: '' , title: '' };
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => { this.mode = url[0].path }); // find the mode by analysing the route path
    this.route.paramMap.subscribe( (paramMap: ParamMap) =>
      {
        // Edit mode
        if (this.mode === 'edit' && paramMap.has('postId')) { // check if Id presents
          this.postLabel = 'Edit your post:';
          this.pccPost.id = paramMap.get('postId') || ''; // retrieve value of postId param
          this.pccPost = this.postService.getMemoryPost(this.pccPost.id); // get existing post from cache memory
          if (this.pccPost.title === '' || this.pccPost.content === '') {
            this.isLoading = true;
            this.postService.getPost(this.pccPost.id) // get a post from MongoDB on reload
                            .subscribe( (postData) => { // map the post data
                               this.pccPost.id = postData.post._id ,
                               this.pccPost.title = postData.post.title ,
                               this.pccPost.content = postData.post.content
                               this.postForm.setValue({ 'postTitle': this.pccPost.title, 'postContent': this.pccPost.content , 'postImage' : '' });
                               this.isLoading = false;
                            });
          } else {
            this.postForm.setValue({ 'postTitle': this.pccPost.title, 'postContent': this.pccPost.content , 'postImage' : '' });
          }
        // Creation mode
        } else if (this.mode === 'create') {
          this.pccPost.id = '';
          this.postLabel = 'Create your post:';
        // Unsupported mode
        } else {
          throw new Error("Unsupported mode (either 'edit/:id' or 'create' routes)");
        }
      }
    )
    console.log("PostCreateComponent - ngOnInit: mode=" + this.mode);
  }

  // Method called on Save button click
  onSavePostValue() {
    // alert("Post saved on MongoDB !")
    if (this.postForm.invalid) {
      return; // avoid emitting on invalid inputs
    }
    this.isLoading = true;

    if (this.mode === 'create') {
      // save a new post after create, and redirect
      this.postService.addPost(this.postForm.value.postTitle,
                               this.postForm.value.postContent);

    } else {
      // save an existing post after edit, and redirect
      this.postService.updatePost(this.pccPost.id,
                                  this.postForm.value.postTitle,
                                  this.postForm.value.postContent);
    }

    this.postForm.reset();
  }


  // Method called on Pick Image button click
  onPickImage(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target.files?.length) {
      throw new Error("onPickImage: Invalid image file !");
    }
    const file : File = target.files[0];
    this.postForm.patchValue({postImage: file});
    this.postForm.get('postImage')?.updateValueAndValidity();
    // console.log(file); // DEBUG
    // console.log(this.postForm); // DEBUG
    const reader = new FileReader();
    reader.onload = () => {
        this.imagePreview = reader.result as string; // assign it once read
        console.log(this.imagePreview);  // DEBUG
    };
    reader.readAsDataURL(file); // read the file
  }

}
