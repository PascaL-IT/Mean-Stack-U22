import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

    signupLabel : string = 'Please fill in this form to create an account :';
    isLoading : boolean = false;

    minLengthPassword : number = 8;

    constructor(public authService: AuthService) {}

    ngOnInit(): void {
      console.log("SignupComponent: ngOnInit...");
    }

    onSignup(form: NgForm) {
      console.log("SignupComponent: onSignup...");
      if (form.invalid) {
        console.log("Invalid form on signup : " + form.value);
        return;
      }
      // Call to create a new user on signup
      this.authService.createUser(form.value.email, form.value.password);
    }

  }

