import { Injectable, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {};

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean|UrlTree> | Promise<boolean|UrlTree> {

      const isUserAuthenticated = this.authService.getUserAuthStatus();

      if (! isUserAuthenticated) {
        console.log("AuthGuard: user is not authenticated => redirection to the login page");
        this.router.navigate(["/auth/login"]);
      }

      return isUserAuthenticated;
  }; // canActivate

}
