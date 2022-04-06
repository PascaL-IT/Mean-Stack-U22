import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { removeFilterItems } from '../posts/post-list/post-list.filter.functions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  public userIsAuthenticated : boolean = false;
  public appMainTitle : string = environment.appMainTitle;

  public currentPageIndex = 0;
  public currentPageSize = 5;

  constructor(private authService: AuthService, public route: ActivatedRoute) {}

  // Observer to be updated on user's status
  private statusSub: Subscription = new Subscription();

  // OnInit implementation
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: ParamMap) => { // to save pagination parameters
      console.log("HeaderComponent - ngOnInit: queryParamMap... ");
      if (params.has('pageindex') && params.has('pageindex') ) {
        this.currentPageSize = parseInt(params.get('pageindex') || '5');
        this.currentPageIndex = parseInt(params.get('pagesize') || '0');
        // console.log(params); // DEBUG
      }
    });

    this.userIsAuthenticated = this.authService.getUserAuthStatus(); // TIP, required during initialization,
                                                                     //  since no new event raised from below listener (user is already authenticate!)
    this.statusSub = this.authService.getAuthStatusListener()
                                     .subscribe( event => { this.userIsAuthenticated = event.state; // assign updated state
                                                            console.log("HeaderComponent - ngOnInit: userIsAuthenticated=" + this.userIsAuthenticated);
                                                          });
  } // ngOnInit

  // OnDestroy implementation
  ngOnDestroy(): void {
    this.statusSub.unsubscribe();
    // console.log("ngOnDestroy: unsubscribe observer on user's status update"); // DEBUG
  }

  // Logout a user
  onLogout(): void {
    this.authService.logoutUser();
    // clearFilters();
  }

  // onAppMainTitle
  doRefresh(): void {
    this.currentPageSize = 5;
    this.currentPageIndex = 0;
    removeFilterItems();
    window.location.reload(); // F5
  }

};
