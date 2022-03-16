import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from "rxjs";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit, OnDestroy {

    signupLabel : string = 'Please fill in this form to create an account :';
    isLoading : boolean = false;
    minLengthPassword : number = 8;

    // Observer to be updated on user's status
    private statusSub: Subscription = new Subscription();

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
      console.log("SignupComponent: ngOnInit...");
      this.statusSub = this.authService.getAuthStatusListener()
                           .subscribe(
                             event => { this.isLoading = event.state;
                                        console.log("SignupComponent - ngOnInit: isLoading=" + this.isLoading);
                                        console.log(event);
                                      });
    } // ngOnInit

    ngOnDestroy(): void {
      this.statusSub.unsubscribe();
    }

    onSignup(form: NgForm) {
      console.log("SignupComponent: onSignup...");
      if (form.invalid) {
        console.log("Invalid form on signup: ");
        console.log(form.value);
        return;
      }
      // Call to create a new user on signup
      this.authService.createUser(form.value.email, form.value.password);
    } // onSignup

  }

