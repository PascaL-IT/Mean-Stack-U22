import { AuthData } from "./authdata.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";

@Injectable()
export class AuthService {

  private baseUrl: string = 'http://localhost:3000/api/user/';
  private authToken: string = '';
  private authTokenExpiresIn: number = 0;
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
        console.log("AuthService: loginUser...");
        this.authToken = response.token;
        console.log('token: ' + this.authToken); // DEBUG
        this.authTokenExpiresIn = response.expiresIn;
        console.log('expiresIn: ' + this.authTokenExpiresIn); // DEBUG

        if (this.authToken.length > 0) {
          this.authStatus.next({ state : true }); // notify
          this.isUserAuthenticated = true;
          /*
          this.authTokenTimer = setTimeout( () => { console.log("Token expired!");
                                                    this.logoutUser(); },
                                            this.authTokenExpiresIn * 1000); // x 1000 as in milliseconds
          */
          this.setTimer();
        }

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
    this.authStatus.next({ state : false }); // notify observers
    clearTimeout(this.authTokenTimer);
    this.authTokenExpiresIn = 0;
    console.log("AuthService - logoutUser: done... BYE");
    this.router.navigate(["/"]);
  } // logoutUser


  // Store the authentication token data into the localStore
  private saveTokenAuthData() {
    localStorage.setItem('token', this.authToken);
    localStorage.setItem('tokenDate', this.buildExpirationDate(this.authTokenExpiresIn));
  } // saveTokenAuthData


  // Retrieve the authentication data from the localStore
  private getTokenAuthData() {
    const tokenString = localStorage.getItem('token');
    const tokenDateString = localStorage.getItem('tokenDate');
    if (!tokenString || !tokenDateString) {
      // nok, reset the authentication token data
      return { token: '', tokenExpirationDate: new Date() }
    }
    // ok, return the stored authentication token data
    return { token: tokenString, tokenExpirationDate: new Date(tokenDateString) }
  } // getTokenAuthData


  // Clear data from local storage
  private clearTokenAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenDate');
  } // clearTokenAuthData()


  // Build an expiration date
  private buildExpirationDate(duration: number) : string {
    const datetime = new Date(Date.now() + duration * 1000);
    console.log(datetime);
    console.log(datetime.toLocaleString());
    console.log(datetime.toString());
    return datetime.getDate().toLocaleString();
  } // buildExpirationDate


  // Automatic user's authentication based on local storage data
  public autoUserLogin() {
      const authData = this.getTokenAuthData();
      const now = new Date();
      const isInFuture = authData.tokenExpirationDate > now;
      if (isInFuture && authData.token.length > 0) {
        this.authToken = authData.token;
        this.isUserAuthenticated = true;
        this.authStatus.next({ state : true }); // notify observers
        this.authTokenExpiresIn = (authData.tokenExpirationDate.getTime() - now.getTime()) / 1000;
        this.setAuthTimer();
        console.log("AuthService - autoUserLogin: authTokenExpiresIn=" + this.authTokenExpiresIn);
      }
  } // autoUserLogin


  // Set timer
  private setAuthTimer() {
    this.authTokenTimer = setTimeout(
      () => {
              console.log("Token has expired! => user logged out");
              this.logoutUser();
            }, this.authTokenExpiresIn * 1000); // x 1000 as in milliseconds
  } // setTimer


}
