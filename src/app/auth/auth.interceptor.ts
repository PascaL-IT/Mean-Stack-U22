
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();
    const authRequest = req.clone({ // TIP -> use clone to avoid side-effects
      headers: req.headers.set('Authorization', "Bearer " + authToken) // add the bearer token in http request headers
    });
    return next.handle(authRequest);
  }
}
