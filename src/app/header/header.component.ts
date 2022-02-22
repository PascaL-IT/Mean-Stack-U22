import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  public userIsAuthenticated = false;

  constructor(private authService: AuthService) {}

  // Observer to be updated on user's status
  private statusSub: Subscription = new Subscription();

  // OnInit implementation
  ngOnInit(): void {
    this.statusSub = this.authService.getAuthStatusListener()
                                     .subscribe( event => { this.userIsAuthenticated = event.state; // assign updated state
                                                 console.log("HeaderComponent - ngOnInit: userIsAuthenticated=" + this.userIsAuthenticated);
                                      });
  }

  // OnDestroy implementation
  ngOnDestroy(): void {
    this.statusSub.unsubscribe();
    // console.log("ngOnDestroy: unsubscribe observer on user's status update"); // DEBUG
  }

  // Logout a user
  onLogout(): void {
    this.authService.logoutUser();
  }

};
