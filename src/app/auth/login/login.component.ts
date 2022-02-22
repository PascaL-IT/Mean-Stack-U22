import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginLabel : string = 'Please enter your credentials to login :';
  isLoading : boolean = false;

  minLengthPassword : number = 8;

  constructor(public authService: AuthService) {};

  ngOnInit(): void {
    console.log("LoginComponent: ngOnInit...");
  }

  onLogin(form: NgForm) {
    console.log("LoginComponent: onLogin...");
    if (form.invalid) {
      console.log("Invalid form on login");
      console.log(form.value);
      return;
    }
    // Call to login an existing user
    this.authService.loginUser(form.value.email, form.value.password);
  }

}
