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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog'


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
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent,
    PostCreateComponent, PostListComponent,
    SanitizeHtmlPipe,
    LoginComponent, SignupComponent,
    ErrorComponent
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
    MatPaginatorModule, MatDialogModule
  ],

  // providers: [PostsService], // without @Injectable
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } , // inject Auth interceptor
               { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true } , // inject Error interceptor
               Title,          // inject Title
               AuthService ] , // inject AuthService
  bootstrap: [AppComponent] ,
  entryComponents: [ErrorComponent] // Entry component (deprecated)
})

export class AppModule { }
