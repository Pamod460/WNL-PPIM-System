import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatSelectionList, MatSelectionListChange} from "@angular/material/list";
import {Userstatus} from "../../../entity/userstatus";
import {EmployeeService} from "../../../service/employee.service";
import {UserstatusService} from "../../../service/userstatus.service";
import {RoleService} from "../../../service/role.service";
import {Role} from "../../../entity/role";
import {MatTableDataSource} from "@angular/material/table";
import {UserService} from "../../../service/user.service";
import {User} from "../../../entity/user";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {DatePipe} from "@angular/common";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/regex.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Userrole} from "../../../entity/userrole";
import {AuthoritySevice} from "../../../service/authority.sevice";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Usrtype} from "../../../entity/usrtype";
import {UsrtypeService} from "../../../service/usrtype.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{
  public form!: FormGroup;
  public ssearch!: FormGroup;
  public csearch!: FormGroup;

  employees: Array<Employee> = [];
  userstatues: Array<Userstatus> = [];
  usertypes: Array<Usrtype> = [];
  users: Array<User> = [];
  userroles: Array<Userrole> = [];

  @Input() roles: Array<Role> = [];
  oldroles: Array<Role> = [];
  @Input() selectedroles: Array<Role> = [];

  pwdhide = true;
  pwdconfhide = true;
  tempPass: boolean = false;

  user!: User;
  olduser!: User;

  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;
  defaultProfile: string = 'assets/default.png';

  columns: string[] = ['photo', 'employee', 'username', 'role', 'userstatus', 'usertype'];
  headers: string[] = ['Profile', 'Employee', 'Username', 'Role', 'User Status', 'User Type'];
  binders: string[] = ['employee.photo', 'employee.callingname', 'username', 'getRole()', 'usestatus.name', 'usetype.name'];
  imageurl: string = '';

  data !: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;

  authorities: string[] = [];

  uiassist: UiAssist;

  regexes: any;

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;


  isPwViewable =true
  isConfPwViewable =true

  disableModify = false;

  isUserNameReadOnly = false;

  today:Date = new Date();
  constructor(
    private fb: FormBuilder,
    private es: EmployeeService,
    private ut: UserstatusService,
    private ust: UsrtypeService,
    private rs: RoleService,
    private us: UserService,
    private dp: DatePipe,
    private dg: MatDialog,
    private rx: RegexService,
    public authService: AuthorizationManager
  ) {

    this.uiassist = new UiAssist(this);
    this.user = new User();

    this.csearch = this.fb.group({
      "csemployee": new FormControl(),
      "csusername": new FormControl(),
      "csdocreated": new FormControl(),
      "csuserstatus": new FormControl(),
      "csrole": new FormControl(),
      "csdescription": new FormControl(),
      "cstocreated": new FormControl(),

    });

    this.form = this.fb.group({
      "employee": new FormControl('', [Validators.required]),
      "username": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required]),
      "confirmpassword": new FormControl('', [Validators.required]),
      "docreated": new FormControl('', [Validators.required]),
      "tocreated": new FormControl(this.dp.transform(Date.now(), "hh:mm:ss"), [Validators.required]),
      "usestatus": new FormControl('', [Validators.required]),
      "usetype": new FormControl('', [Validators.required]),
      "description": new FormControl(),
      "userroles": new FormControl('', [Validators.required])
    });

    this.ssearch = this.fb.group({
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

    this.es.getAllListNameId().then((emps: Employee[]) => {
      this.employees = emps;
    });

    this.ut.getAllList().then((usts: Userstatus[]) => {
      this.userstatues = usts;
    });

    this.ust.getAllList().then((ust: Usrtype[]) => {
      this.usertypes = ust;
    });

    this.rs.getAllList().then((rlse: Role[]) => {
      this.roles = rlse;
      this.oldroles = Array.from(this.roles);
    });

    this.rx.get("users").then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.form.controls["password"].valueChanges.subscribe({
      next:next=>{
        // console.log(next, next.split("WaterBoard@25"))
        if (next=="WaterBoard@25" || next.split("WaterBoard@25").length >1){
          this.isPwViewable=false
        }else {
          this.isPwViewable=true

        }
      }
    })

    this.form.controls["confirmpassword"].valueChanges.subscribe({
      next:next=>{
        if (next=="WaterBoard@25" || next.split("WaterBoard@25").length >1){
          this.isConfPwViewable=false
        }else {
          this.isConfPwViewable=true

        }
      }
    })

  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  loadTable(query: string): void {

    this.us.getAll(query)
      .then((usrs: User[]) => {
        this.users = usrs;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        console.log(error);
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.users);
        this.data.paginator = this.paginator;
      });

  }

  getDate(element: User) {
    return this.dp.transform(element.docreated, 'yyyy-MM-dd');
  }

  getRole(element: User) {
    let roles = "";
    element.userroles.forEach((e) => {
      roles = roles + e.role.name + "," + "\n";
    });
    return roles;
  }

  createForm() {
    this.form.controls['employee'].setValidators([Validators.required]);
    this.form.controls['username'].setValidators([Validators.required, Validators.pattern(this.regexes['username']['regex'])]);
    this.form.controls['password'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['confirmpassword'].setValidators([Validators.required, Validators.pattern(this.regexes['password']['regex'])]);
    this.form.controls['docreated'].setValidators([Validators.required]);
    this.form.controls['tocreated'].setValidators([Validators.required]);
    this.form.controls['usestatus'].setValidators([Validators.required]);
    this.form.controls['usetype'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['userroles'].setValidators([Validators.required]);
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "docreated")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');
          if (this.olduser != undefined && control.valid) {
            // @ts-ignore
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
    this.form.controls['docreated'].setValue( new Date(this.today.getFullYear() , this.today.getMonth(), this.today.getDate()));
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
    this.user.userroles = this.availablelist.selectedOptions.selected.map(option => {
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value); //Remove Selected
      this.userroles.push(userRole); // Add selected to Right Side
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity(); // Update status
  }

  leftSelected(): void {
    const selectedOptions = this.selectedlist.selectedOptions.selected; // Right Side
    for (const option of selectedOptions) {
      const extUserRoles = option.value;
      this.userroles = this.userroles.filter(role => {
        role !== extUserRoles
      }); // Remove the Selected one From Right Side
      this.roles.push(extUserRoles.role);
    }

  }


  rightAll(): void {
    this.user.userroles = this.availablelist.selectAll().map(option => {
      const userRole = new Userrole(option.value);
      this.roles = this.roles.filter(role => role !== option.value);
      this.userroles.push(userRole);
      return userRole;
    });

    this.form.controls["userroles"].clearValidators();
    this.form.controls["userroles"].updateValueAndValidity();
  }

  leftAll(): void {
    for (let userrole of this.userroles) this.roles.push(userrole.role);
    this.userroles = [];
  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    let employee = sserchdata.ssemployee;
    let username = sserchdata.ssusername;
    let roleid = sserchdata.ssrole;
    let usrstatusid = sserchdata.ssrusrstatus;

    let query = "";

    if (employee != null && employee.trim() !== "") query = query + "&employee=" + employee;
    if (username != null && username.trim() !== "") query = query + "&username=" + username;
    if (roleid != null) query = query + "&roleid=" + roleid;
    if (usrstatusid != null) query = query + "&usrstatusid=" + usrstatusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);
  }

  btnSearchClearMc(): void {

    const confirm = this.dg.open(ConfirmComponent, {
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

    let errors: string = "";

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

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let user: User = this.form.getRawValue();


      // @ts-ignore
      delete user.confirmpassword;
      // console.log(user);
      user.userroles = this.user.userroles;
      this.user = user;

      let usrdata: string = "";

      usrdata = usrdata + "<br>Employee is : " + this.user.employee.callingname;
      usrdata = usrdata + "<br>Username is : " + this.user.username;
      usrdata = usrdata + "<br>Password is : " + this.user.password;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to Add the folowing User? <br> <br>" + usrdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          console.log(JSON.stringify(this.user));
          this.us.add(this.user).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.form.reset();
              this.userroles = [];
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -User Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }


  fillForm(user: User) {

    const loginEmployee = JSON.parse(localStorage.getItem('employee') || '');
    console.log(loginEmployee.id,user.employee.id)

    if (loginEmployee.id === user.employee.id) {
      this.disableModify = true;
    }else {
      this.disableModify = false;
    }
    this.isPwViewable=false
    this.isConfPwViewable=false

    this.enableButtons(false, true, true);

    this.roles = Array.from(this.oldroles);

    this.selectedrow = user;

    this.user = JSON.parse(JSON.stringify(user));
    this.olduser = JSON.parse(JSON.stringify(user));

    //@ts-ignore
    this.user.employee = this.employees.find(e => e.id === this.user.employee.id);

    //@ts-ignore
    this.user.usestatus = this.userstatues.find(s => s.id === this.user.usestatus.id);

    //@ts-ignore
    this.user.usetype = this.usertypes.find(s => s.id === this.user.usetype.id);

    this.userroles = this.user.userroles; // Load User Roles

    this.user.userroles.forEach((ur) => this.roles = this.roles.filter((r) => r.id != ur.role.id)); // Load or remove roles by comparing with user.userroles

    const userData = { ...this.user }; // Clone the user object
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
      passwordControl?.patchValue('WaterBoard@25', { emitEvent: false });
      confirmPasswordControl?.patchValue('WaterBoard@25', { emitEvent: false });
    }

    // this.form.controls["username"].disable();
    this.form.markAsPristine();

  }

  getUpdates(): string {

    let updates: string = "";
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

    if (!passwordControl?.value){
      passwordControl?.patchValue('WaterBoard@25', {emitEvent:false});
      confirmCasswordControl?.patchValue('WaterBoard@25', {emitEvent:false});
    }

    let errors = this.getErrors(['confirmpassword']);

    if (errors != "") {

      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - User Update ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Employee Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.user = this.form.getRawValue();

            this.us.update(this.user).then((responce: [] | undefined) => {
              if (responce != undefined) {
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.isUserNameReadOnly = false;
                this.tempPass = false;
                this.leftAll();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Employee Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dg.open(MessageComponent, {
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

    const confirm = this.dg.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Confirmation - User Delete",
        message: "Are you sure to Delete following User? <br> <br>" + this.user.username
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.us.delete(this.user.username).then((responce: [] | undefined) => {
          console.log(responce);
          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.leftAll();
            Object.values(this.form.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - User Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => {
            if (!result) {
              return;
            }
          });

        });
      }
    });
  }


  clear(): void {
    this.isUserNameReadOnly = false;

    const confirm = this.dg.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Employee Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.form.controls['username'].enable();
        this.selectedrow = null;
        this.createForm();
      }
    });
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
