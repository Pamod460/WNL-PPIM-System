import {Component} from '@angular/core';
import {AuthorizationManager} from "./service/authorizationmanager";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'earth';

  constructor(private authService: AuthorizationManager) {
    this.authService.initializeMenuState();
    this.authService.getAuth(this.authService.getUsername())
  }

}
