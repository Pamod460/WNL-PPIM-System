import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList} from "@angular/material/list";
import {Userstatus} from "../../../entity/userstatus";
import {EmployeeService} from "../../../service/employee/employee.service";
import {UserstatusService} from "../../../service/user/userstatus.service";
import {RoleService} from "../../../service/user/role.service";
import {Role} from "../../../entity/role";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../service/user/user.service";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/Shared/regex.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {UserRole} from "../../../entity/userRole";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {Usrtype} from "../../../entity/usrtype";
import {UsrtypeService} from "../../../service/user/usrtype.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public form!: FormGroup;
  public ssearch!: FormGroup;

  employees: Employee[] = [];
  userstatues: Userstatus[] = [];
  usertypes: Usrtype[] = [];
  users: User[] = [];
  userroles: UserRole[] = [];

  @Input() roles: Role[] = [];
  oldroles: Role[] = [];
  @Input() selectedroles: Role[] = [];

  pwdhide = true;
  pwdconfhide = true;
  tempPass = false;

  user!: User;
  olduser!: User;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;
  defaultProfile = 'assets/default.png';

  columns: string[] = ['photo', 'employee', 'username', 'role', 'userStatus', 'userType'];
  headers: string[] = ['Profile', 'Employee', 'Username', 'Role', 'User Status', 'User Type'];
  binders: string[] = ['employee.photo', 'employee.callingname', 'username', 'getRole()', 'userStatus.name', 'userType.name'];
  imageurl = '';

  data !: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;


  uiassist: UiAssist;

  regexes: any;

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;


  isPwViewable = true
  isConfPwViewable = true

  disableModify = false;

  isUserNameReadOnly = false;

  today: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private userstatusService: UserstatusService,
    private usrtypeService: UsrtypeService,
    private roleService: RoleService,
    private userService: UserService,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private regexService: RegexService,
    public authService: AuthorizationManager,
    private toastrService: ToastrService
  ) {

    this.uiassist = new UiAssist(this);
    this.user = new User();

    this.form = this.formBuilder.group({
      "employee": new FormControl('', [Validators.required]),
      "username": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required]),
      "confirmpassword": new FormControl('', [Validators.required]),
      "docreated": new FormControl('', [Validators.required]),
      "tocreated": new FormControl(this.datePipe.transform(Date.now(), "hh:mm:ss"), [Validators.required]),
      "userStatus": new FormControl('', [Validators.required]),
      "userType": new FormControl('', [Validators.required]),
      "description": new FormControl(),
      "userRoles": new FormControl('', [Validators.required])
    });

    this.ssearch = this.formBuilder.group({
      "ssemployee": new FormControl(),
      "ssusername": new FormControl(),
      "ssrole": new FormControl(),
      "ssrusrstatus": new FormControl(),
    });

  }


  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.employeeService.getAllListNameId().subscribe({
      next: (emps: Employee[]) => {
        this.employees = emps;
      }, error: (error) => {
        console.error(error)
      }
    });

    this.userstatusService.getAllList().subscribe((usts: Userstatus[]) => {
      this.userstatues = usts;
    });

    this.usrtypeService.getAllList().subscribe((ust: Usrtype[]) => {
      this.usertypes = ust;
    });

    this.roleService.getAllList().subscribe((rlse: Role[]) => {
      this.roles = rlse;
      this.oldroles = Array.from(this.roles);
    });

    this.regexService.get("users").subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.form.controls["password"].valueChanges.subscribe({
      next: next => {
        // console.log(next, next.split("WaterBoard@25"))
        this.isPwViewable = !(next == "WaterBoard@25" || next.split("WaterBoard@25").length > 1);
      }
    })
    this.form.controls["confirmpassword"].valueChanges.subscribe({
      next: next => {
        this.isConfPwViewable = !(next == "WaterBoard@25" || next.split("WaterBoard@25").length > 1);
      }
    })

  }

  createView() {
    this.loadTable("");
  }

  loadTable(query: string): void {
    this.userService.getAll(query).subscribe((usrs: User[]) => {
      this.users = usrs;
      this.data = new MatTableDataSource(this.users);
      this.data.paginator = this.paginator;
    })
  }

  getDate(element: User) {
    return this.datePipe.transform(element.docreated, 'yyyy-MM-dd');
  }

  getRole(element: User): string {
    if (!element.userRoles || element.userRoles.length === 0) {
      return "";
    }

    return element.userRoles.map(e => e.role.name).join(", ");
  }


  createForm() {
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['username'].setValidators([Validators.required, Validators.pattern(this.regexes['username']['regex'])]);
    this.form.controls['password'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['confirmpassword'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['tocreated'].setValidators([Validators.required]);
    this.form.controls['userStatus'].setValidators([Validators.required]);
    this.form.controls['userType'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['userRoles'].setValidators([Validators.required]);
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (controlName == "docreated")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');
          if (this.olduser != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.user[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );

    }
    this.form.controls['docreated'].setValue(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'user' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'user' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'user' && authority.operation === 'delete');

  }

  rightSelected(): void {
    this.user.userRoles = this.availablelist.selectedOptions.selected.map(option => {
      const userRole = new UserRole(option.value);
      this.roles = this.roles.filter(role => role !== option.value); //Remove Selected
      this.userroles.push(userRole); // Add selected to Right Side
      return userRole;
    });

    this.form.controls["userRoles"].clearValidators();
    this.form.controls["userRoles"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extUserRoles = option.value;
      this.userroles = this.userroles.filter(role => role !== extUserRoles); // Remove the Selected one From Right Side
      this.roles.push(extUserRoles.role);
    }

  }


  rightAll(): void {
    this.user.userRoles = this.availablelist.selectAll().map(option => {
      const userRole = new UserRole(option.value);
      this.roles = this.roles.filter(role => role !== option.value);
      this.userroles.push(userRole);
      return userRole;
    });

    this.form.controls["userRoles"].clearValidators();
    this.form.controls["userRoles"].updateValueAndValidity();
  }

  leftAll(): void {
    for (const userrole of this.userroles) this.roles.push(userrole.role);
    this.userroles = [];
  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    const employee = sserchdata.ssemployee;
    const username = sserchdata.ssusername;
    const roleid = sserchdata.ssrole;
    const usrstatusid = sserchdata.ssrusrstatus;

    let query = "";

    if (employee != null && employee.trim() !== "") query = query + "&employee=" + employee;
    if (username != null && username.trim() !== "") query = query + "&username=" + username;
    if (roleid != null) query = query + "&roleid=" + roleid;
    if (usrstatusid != null) query = query + "&usrstatusid=" + usrstatusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);
  }

  btnSearchClearMc(): void {

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {heading: "Clear Search", message: "Are You Sure You Want To Perform this Operation?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }


  getErrors(optionalFields?: string []): string {

    let errors = "";

    for (const controlName in this.form.controls) {
      if (!optionalFields?.includes(controlName)) {
        const control = this.form.controls[controlName];
        if (control.errors) {

          if (this.regexes[controlName] != undefined) {
            errors = errors + "<br>" + this.regexes[controlName]['message'];
          } else {
            errors = errors + "<br>Invalid " + controlName;
          }
        }
      }
    }

    return errors;
  }

  add() {

    const errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      const user: User = this.form.getRawValue();


      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete user.confirmpassword;
      user.userRoles = this.user.userRoles;
      this.user = user;

      let usrdata = "";

      usrdata = usrdata + "<br>Employee is : " + this.user.employee.callingname;
      usrdata = usrdata + "<br>Username is : " + this.user.username;
      usrdata = usrdata + "<br>Password is : " + this.user.password;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to Add the folowing User? <br> <br>" + usrdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.userService.add(this.user).subscribe({
            next: (response) => {
              this.toastrService.success(response.message).onShown.subscribe(() => {
                this.loadTable("");
                this.resetForm()
              })
            }, error: (error) => {
              this.toastrService.error(error.error.data.message)
            }
          })
        }
      });
    }
  }


  fillForm(user: User) {

    if (localStorage.getItem('employee')){
      const loginEmployee = JSON.parse(localStorage.getItem('employee') || '');

      this.disableModify = loginEmployee.id === user.employee.id;
    }

    this.isPwViewable = false
    this.isConfPwViewable = false

    this.enableButtons(false, true, true);

    this.roles = Array.from(this.oldroles);

    this.selectedrow = user;

    this.user = JSON.parse(JSON.stringify(user));
    this.olduser = JSON.parse(JSON.stringify(user));

    //@ts-ignore
    this.user.employee = this.employees.find(e => e.id === this.user.employee.id);

    //@ts-ignore
    this.user.userStatus = this.userstatues.find(s => s.id === this.user.userStatus.id);

    //@ts-ignore
    this.user.userType = this.usertypes.find(s => s.id === this.user.userType.id);

    this.userroles = this.user.userRoles; // Load User Roles

    this.user.userRoles.forEach((ur) => this.roles = this.roles.filter((r) => r.id != ur.role.id)); // Load or remove roles by comparing with user.userroles

    const userData = {...this.user}; // Clone the user object
    //@ts-ignore
    delete userData.password; // Remove the password field

    this.form.patchValue(userData);// Patch only allowed fields
    this.isUserNameReadOnly = true;

    this.form.controls['employee'].disable();
    this.form.controls['username'].disable();

    const passwordControl = this.form.controls['password'];
    const confirmPasswordControl = this.form.controls['confirmpassword'];

    // Set password manually if it's empty
    if (!passwordControl?.value) {
      this.tempPass = true;
      passwordControl?.patchValue('WaterBoard@25', {emitEvent: false});
      confirmPasswordControl?.patchValue('WaterBoard@25', {emitEvent: false});
    }

    // this.form.controls["username"].disable();
    this.form.markAsPristine();

  }

  getUpdates(): string {

    let updates = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }
    return updates;
  }

  update() {

    const passwordControl = this.form.controls['password'];
    const confirmCasswordControl = this.form.controls['confirmpassword'];

    if (!passwordControl?.value) {
      passwordControl?.patchValue('WaterBoard@25', {emitEvent: false});
      confirmCasswordControl?.patchValue('WaterBoard@25', {emitEvent: false});
    }

    const errors = this.getErrors(['confirmpassword']);

    if (errors != "") {

      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Update ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      const updates: string = this.getUpdates();
      if (updates != "") {
        const confirm = this.matDialog.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - User Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.user = this.form.getRawValue();
            this.userService.update(this.user).subscribe({
              next: (response) => {
                this.toastrService.success(response.message).onShown.subscribe(() => {
                  this.isUserNameReadOnly = false;
                  this.tempPass = false;
                  this.loadTable("");
                  this.resetForm()
                })
              }, error: (error) => {
                this.toastrService.error(error.error.data.message)
              }
            });
          }
        });
      } else {

        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }
  }


  delete(): void {

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Confirmation - User Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.user.username
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.userService.delete(this.user.username).subscribe({
          next: (response) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.loadTable("");
              this.resetForm()
            })
          }, error: (error) => {
            this.toastrService.error(error.error.message)
          }
        })
      }
    });
  }


  clear(): void {
    this.isUserNameReadOnly = false;
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Employee Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm()
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.form.controls['employee'].enable();
    this.form.controls['username'].enable();
    this.selectedrow = null;
    this.createForm();
    this.leftAll();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    this.enableButtons(true, false, false);
  }

  checkEmpStatus(statusId: string) {
    switch (statusId) {
      case "Active":
        return "text-success-light";
      case "Inactive":
        return "text-warning-light";
      case "Blocked":
        return "text-danger-light";
      default:
        return "";
    }
  }

}
