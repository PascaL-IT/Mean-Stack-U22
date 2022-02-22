import { AuthData } from "./authdata.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {

  private baseUrl: string = 'http://localhost:3000/api/user/';
  private authToken: string = '';
  private authTokenExpIn: number = 0;
  private authTokenTimer: any;
  private authStatus = new Subject<{ state : boolean }>(); // Subject (Active observable)
  private isUserAuthenticated: boolean = false;

  // Constructor
  constructor(private httpClient: HttpClient, private router: Router) {};


  // Create a new user with his credentials
  createUser(email:string, password:string) {
    const authData : AuthData = { email: email, password: password };

    this.httpClient.post(this.baseUrl + 'signup', authData)
     .subscribe( (response) => {
        console.log("AuthService: createUser...");
        // console.log(response); // DEBUG
        this.router.navigate(["/"]);
     });

  } // createUser


  // Login an existing user with his credentials to authenticate
  loginUser(email:string, password:string) {
    const authData : AuthData = { email: email, password: password };

    this.httpClient.post<{ token: string, expiresIn: number }>(this.baseUrl + 'login', authData) // see login API
      .subscribe( (response) => {
        this.authToken = response.token;
        this.authTokenExpIn = response.expiresIn;

        if (this.authToken.length > 0) {
          this.authStatus.next({ state : true }); // notify
          this.isUserAuthenticated = true;
          this.saveTokenAuthData();
          this.setAuthTimer();
          console.log('AuthService - token: ' + this.authToken);
          console.log('AuthService - expiresIn: ' + this.authTokenExpIn);
        }
        console.log("AuthService - loginUser: isUserAuthenticated="+this.isUserAuthenticated);
        this.router.navigate(["/"]);
      });

  } // loginUser


  // Get the current authentication token (JWT)
  getAuthToken() {
    return this.authToken; // even if empty (control done at check-auth.js level)
  }


  // Get the observable on updated status
  getAuthStatusListener() {
    return this.authStatus.asObservable(); // observable
  }


  // Get user's authentication state  (a tricky TIP)
  getUserAuthStatus() {
      console.log("AuthService - getUserAuthStatus: isUserAuthenticated="+this.isUserAuthenticated);
      return this.isUserAuthenticated;
  }


  // Logout a user, disable his authentication and clear the timer
  logoutUser() {
    this.authToken = '';
    this.isUserAuthenticated = false;
    this.authTokenExpIn = 0;
    this.authStatus.next({ state : false }); // notify observers
    clearTimeout(this.authTokenTimer);
    this.clearTokenAuthData();
    console.log("AuthService - logoutUser: user is logged out");
    this.router.navigate(["/"]);
  } // logoutUser


  // Store the authentication token data into the localStore
  private saveTokenAuthData() {
    localStorage.setItem('token', this.authToken);
    localStorage.setItem('tokenIatDate', this.buildIsoDate(0));
    localStorage.setItem('tokenExpDate', this.buildIsoDate(this.authTokenExpIn));
  } // saveTokenAuthData


  // Retrieve the authentication data from the localStore
  private getTokenAuthData() {
    const tokenString = localStorage.getItem('token');
    const tokenExpDateString = localStorage.getItem('tokenExpDate');
    if (!tokenString || !tokenExpDateString) {
      // nok, reset the authentication token data
      return { token: '',
               tokenExpDate: new Date() }
    }
    // ok, return the stored authentication token data
    return { token: tokenString,
             tokenExpDate: new Date(tokenExpDateString) }
  } // getTokenAuthData


  // Clear data from local storage
  private clearTokenAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenIatDate');
    localStorage.removeItem('tokenExpDate');
  } // clearTokenAuthData()


  // Build a date in ISO format
  private buildIsoDate(duration: number) : string {
    const datetime = new Date(Date.now() + duration * 1000);
    return datetime.toISOString(); // e.g. 2022-02-22T15:36:33.492Z
  } // buildIsoDate


  // Automatic user's authentication based on local storage data
  public autoUserLogin() {
      const authData = this.getTokenAuthData();
      const now = new Date();
      const isInFuture = authData.tokenExpDate > now;
      if (isInFuture && authData.token.length > 0) {
        this.authToken = authData.token;
        this.isUserAuthenticated = true;
        this.authTokenExpIn = (authData.tokenExpDate.getTime() - now.getTime()) / 1000; // re-computed
        this.setAuthTimer();
        this.authStatus.next({ state : true }); // notify observers
        console.log("AuthService - autoUserLogin: user is logged in (authToken expiresIn=" + this.authTokenExpIn + ")");
      }
  } // autoUserLogin


  // Set timer based on token's ExpiresIn value, logout user on timeout
  private setAuthTimer() {
    this.authTokenTimer = setTimeout(
      () => { this.logoutUser(); // on timeout, call logoutUser
              console.log("Token has expired. User is logged out !"); },
              this.authTokenExpIn * 1000); // x 1000 as in milliseconds
  } // setAuthTimer


}
