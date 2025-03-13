import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(private dialog: MatDialogRef<LogoutComponent>) {}


  logout() {
    this.dialog.close(true);
  }

  cancel() {
    this.dialog.close(false);
  }
}
