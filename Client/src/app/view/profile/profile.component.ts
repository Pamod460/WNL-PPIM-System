import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../entity/employee";
import {MessageComponent} from "../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../util/dialog/confirm/confirm.component";
import {UserService} from "../../service/user/user.service";
import {AuthorizationManager} from "../../service/auth/authorizationmanager";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../service/Shared/regex.service";
import {PasswdChangeRequest} from "../../entity/PasswdChangeRequest";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public updatePasswdForm!: FormGroup;

  fullName = '';
  email = '';
  description = '';
  regexes: any;
  showNewPassword = false;
  showConfirmPassword = false;

  newPassword = '';
  confirmPassword = '';
  imageURL: any = 'assets/default.png';
  passwdChangeRequest!: PasswdChangeRequest;

  constructor(private userService: UserService, public authorizationManager: AuthorizationManager, private formBuilder: FormBuilder, private matDialog: MatDialog, private regexService: RegexService,) {
    this.updatePasswdForm = this.formBuilder.group({
      "newpasswd": new FormControl(),
      "confirmpasswd": new FormControl()
    });
    this.regexService.get("userpasswdrequest").subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

  }

  updatePassword() {
    let errors = this.getErrors()

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Update Password ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {


      this.newPassword = this.updatePasswdForm.controls["newpasswd"].value;
      this.confirmPassword = this.updatePasswdForm.controls["confirmpasswd"].value;

      if (this.newPassword !== this.confirmPassword) {
        this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {
            heading: "Password Mismatch",
            message: "The passwords you entered do not match. Please try again."
          }
        });
        return;
      }


      const confirmDialog = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirm Password Change",
          message: "Are you sure you want to change your password?"
        }
      });

      confirmDialog.afterClosed().subscribe(result => {
        if (result) { // If user confirms, proceed with password update
          this.passwdChangeRequest = {
            newPasswd: this.newPassword,
            userName: this.authorizationManager.getUsername()
          };

          this.userService.updatePassword(this.passwdChangeRequest).subscribe(value => {
            console.log(value);


            const successMsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {
                heading: "Password Updated",
                message: "Your password has been successfully updated. Please log in again using your new credentials."
              }
            });

            successMsg.afterClosed().subscribe(() => {
              this.authorizationManager.performLogout(); // Logs the user out after password update
            });
          });
        }
      });
    }
  }


  getErrors(): string {

    let errors: string = ""

    for (const controlName in this.updatePasswdForm.controls) {
      const control = this.updatePasswdForm.controls[controlName];

      if (control.errors) {

        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid New Password";
        }
      }
    }
    return errors;
  }

  setProfileInformation() {
    this.userService.getEmployeeByUserName(this.authorizationManager.getUsername().split(' ')[0]).subscribe({
      next: (emp: Employee) => {
        this.fullName = emp.fullname;
        this.email = emp.email;
        this.description = emp.description;
        if (typeof emp.photo === "string") {
          this.imageURL = atob(emp.photo);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });

  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  ngOnInit(): void {
    this.setProfileInformation();

  }

  private createForm() {
    this.updatePasswdForm.controls['newpasswd'].setValidators([Validators.required, Validators.pattern(this.regexes['newPasswd']['regex'])]);
    Object.values(this.updatePasswdForm.controls).forEach(control => { // @ts-ignore
      control.markAsTouched();
    });

    for (const controlName in this.updatePasswdForm.controls) {
      const control = this.updatePasswdForm.controls[controlName];
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      control.valueChanges.subscribe(value => {
        }
      );

    }
  }
}
