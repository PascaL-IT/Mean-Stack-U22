import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { AuthService } from './auth/auth.service';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = environment.appTitle;

  constructor(private titleService: Title, private authService: AuthService) {
    if (environment.production) {
      console.log("Production environment (" + environment.production + ")"); // Logs false for default environment
    } else {
      console.log("None production environment (" + environment.production + ")"); // Logs false for default environment
    }
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.authService.autoUserLogin();
  }

}
