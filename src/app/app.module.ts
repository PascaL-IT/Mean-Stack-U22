import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';


// My Application modules
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { SanitizeHtmlPipe } from './posts/post-list/sanitizehtml-pipe';
// import { PostsService } from './posts/post-list/posts.service'; // vs. @Injectable


@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent,
    PostCreateComponent, PostListComponent,
    SanitizeHtmlPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule ,
    MatInputModule, MatCardModule, MatButtonModule,
    MatToolbarModule, MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],

  // providers: [PostsService], // without @Injectable
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
