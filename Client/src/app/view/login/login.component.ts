import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {AuthenticateService} from "../../service/Authenticate.Service";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // encapsulation: ViewEncapsulation.None
  // animations: [
  //   trigger('circleAnimation', [
  //     state('void', style({
  //       transform: 'translateY(0)',
  //       opacity: 0
  //     })),
  //     state('*', style({
  //       transform: 'translateY(-20px)',
  //       opacity: 1
  //     })),
  //     transition(':enter', [
  //       animate('2s ease-in-out')
  //     ]),
  //     transition(':leave', [
  //       animate('2s ease-in-out')
  //     ])
  //   ])
  // ]
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginform: FormGroup;
  isHandset = false;
  // Responsive grid properties
  gridColumns = 12;
  tile1Cols = 6;
  tile1Rows = 6;
  tile2Cols = 6;
  tile2Rows = 6;
  tile3Cols = 6;
  tile3Rows = 8;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private as: AuthenticateService,
    protected breakpointObserver: BreakpointObserver,
    private ut: AuthorizationManager
  ) {
    this.loginform = this.fb.group({
      "username": new FormControl("", [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(10)
      ]),
      "password": new FormControl("", Validators.required)
    });
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isHandset = result.matches;
      });
  }

  ngAfterViewInit() {
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
      const randomSize = Math.random() * 100 + 50; // Random size between 50px and 150px
      const randomDelay = Math.random() * 5; // Random delay up to 5s
      const randomDuration = Math.random() * 10 + 5; // Random duration between 5s and 15s

      (circle as HTMLElement).style.width = `${randomSize}px`;
      (circle as HTMLElement).style.height = `${randomSize}px`;
      (circle as HTMLElement).style.animationDelay = `${randomDelay}s`;

      // Apply random animation duration for both animations
      (circle as HTMLElement).style.animationDuration = `${randomDuration}s, ${randomDuration * 2}s`;
    });
  }

  ngOnInit(): void {

    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle) => {
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      (circle as HTMLElement).style.top = `${randomY}%`;
      (circle as HTMLElement).style.left = `${randomX}%`;
    });
    this.setupResponsiveLayout();
  }

  setupResponsiveLayout() {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        // Mobile view
        this.gridColumns = 12;
        this.tile1Cols = 12;
        this.tile1Rows = 6;
        this.tile2Cols = 12;
        this.tile2Rows = 6;
        this.tile3Cols = 12;
        this.tile3Rows = 4;
      } else if (result.breakpoints[Breakpoints.Small]) {
        // Tablet view
        this.gridColumns = 12;
        this.tile1Cols = 12;
        this.tile1Rows = 6;
        this.tile2Cols = 12;
        this.tile2Rows = 6;
        this.tile3Cols = 12;
        this.tile3Rows = 5;
      } else if (result.breakpoints[Breakpoints.Medium]) {
        // Desktop medium view
        this.gridColumns = 12;
        this.tile1Cols = 6;
        this.tile1Rows = 6;
        this.tile2Cols = 6;
        this.tile2Rows = 6;
        this.tile3Cols = 6;
        this.tile3Rows = 6;
      } else if (result.breakpoints[Breakpoints.Large])
      {
        // Large desktop view
        this.gridColumns = 12;
        this.tile1Cols = 6;
        this.tile1Rows = 6;
        this.tile2Cols = 6;
        this.tile2Rows = 6;
        this.tile3Cols = 6;
        this.tile3Rows = 8;
      }
        else
      if (

        result.breakpoints[Breakpoints.XLarge]) {
        // Large desktop view
        this.gridColumns = 12;
        this.tile1Cols = 6;
        this.tile1Rows = 7;
        this.tile2Cols = 6;
        this.tile2Rows = 7;
        this.tile3Cols = 6;
        this.tile3Rows = 8;
      }
    });
  }

  authenticate(): void {
    if (this.loginform.invalid) {
      this.showErrorDialog("Invalid Login", "Please check your username and password.");
      return;
    }

    const username = this.loginform.get('username')?.value;
    const password = this.loginform.get('password')?.value;

    this.as.post(username, password)
      .then((response: any) => {
        const token = response.headers.get('Authorization');
        localStorage.setItem('Authorization', token);
        this.router.navigateByUrl("main/home");
        this.ut.getAuth(username);
      })
      .catch((error) => {
        this.showErrorDialog("Invalid Login Details", "Username/Password Empty or Invalid. Check for Username Length");
        this.router.navigateByUrl("login");
      });
  }

  signup(): void {
    this.showErrorDialog("Sign Up Not Available", "Public Registration Not Allowed. Please Contact System Admin");
  }

  private showErrorDialog(heading: string, message: string): void {
    const dialogRef = this.dialog.open(MessageComponent, {
      width: '500px',
      data: {heading, message}
    });

    dialogRef.afterClosed().subscribe(result => {
      // Optional: Add any post-dialog closure logic
    });
  }

  protected readonly Breakpoints = Breakpoints;
}
