import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularMaterialModule } from './app-material.module';
import { PostModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';

// My Application components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';

// My Application services and interceptors
import { AuthService } from './auth/auth.service'; // vs. with @Injectable
import { AuthInterceptor } from './auth/auth.interceptor';
import { ErrorInterceptor } from './error.interceptor';


@NgModule({
  declarations: [
    AppComponent ,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
    AuthModule
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
