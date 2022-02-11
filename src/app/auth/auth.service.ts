import { AuthData } from "./authdata.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {

  private baseUrl: string = 'http://localhost:3000/api/user/';

  // Constructor
  constructor(private httpClient: HttpClient, private router: Router) {};

  // Create a new user with his credentials 
  createUser(email:string, password:string) {
    const authData : AuthData = {
      email: email, password: password
    };

    this.httpClient.post(this.baseUrl + 'signup', authData)
     .subscribe( (response) => {
        console.log("AuthService: createUser >> response ..."); // DEBUG
        console.log(response); // DEBUG
        this.router.navigate(["/"]);
     });
    // createUser
  }

  // Login an existing user with his credentials to authenticate
  loginUser(email:string, password:string) {
    const authData : AuthData = {
      email: email, password: password
    };

    this.httpClient.post(this.baseUrl + 'login', authData)
      .subscribe( (response) => {
        console.log("AuthService: loginUser >> response ..."); // DEBUG
        console.log(response); // DEBUG
        this.router.navigate(["/"]);
      });
    // loginUser
  }

}

