import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

  loginLabel : string = 'Please enter your credentials to login :';
  isLoading : boolean = false;
  minLengthPassword : number = 8;

  // Observer to be updated on user's status
  private statusSub: Subscription = new Subscription();

  constructor(private authService: AuthService) {};

  ngOnInit(): void {
    console.log("LoginComponent: ngOnInit...");
    this.authService.getAuthStatusListener().subscribe(
      event => { this.isLoading = event.state;
                 console.log("LoginComponent - ngOnInit: isLoading=" + this.isLoading);
                 console.log(event);  });
  } // ngOnInit

  ngOnDestroy(): void {
    console.log("LoginComponent: ngOnDestroy...");
    this.statusSub.unsubscribe();
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
