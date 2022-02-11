import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule , FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';


// My Application modules
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { SanitizeHtmlPipe } from './posts/post-list/sanitizehtml-pipe';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
// import { PostsService } from './posts/post-list/posts.service'; // as @Injectable
import { AuthService } from './auth/auth.service'; // vs. with @Injectable



@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent,
    PostCreateComponent, PostListComponent,
    SanitizeHtmlPipe,
    LoginComponent, SignupComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ReactiveFormsModule , FormsModule,
    MatInputModule, MatCardModule, MatButtonModule,
    MatToolbarModule, MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatPaginatorModule
  ],

  // providers: [PostsService], // without @Injectable
  providers: [Title, AuthService] ,    // inject Title
  bootstrap: [AppComponent]
})

export class AppModule { }
