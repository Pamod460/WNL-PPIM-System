import {Component, ViewChild} from '@angular/core';
import {Employee} from "../../../entity/employee";
import {EmployeeService} from "../../../service/employeeservice";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Gender} from "../../../entity/gender";
import {Designation} from "../../../entity/designation";
import {GenderService} from "../../../service/genderservice";
import {DesignationService} from "../../../service/designationservice";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Empstatusservice} from "../../../service/empstatusservice";
import {Empstatus} from "../../../entity/empstatus";
import {RegexService} from "../../../service/regexservice";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Emptype} from "../../../entity/emptype";
import {Emptypeservice} from "../../../service/emptypeservice";


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})

export class EmployeeComponent {


  columns: string[] = ['photo', 'number', 'fullname', 'nic','dobirth', 'designation','empstatus'];
  headers: string[] = ['Profile', 'Code', 'Full Name','NIC','Date of Birth', 'Designation','Status'];
  binders: string[] = ['photo', 'number', 'fullname','nic','dobirth', 'designation.name','empstatus.name'];

  defaultProfile: string = 'assets/default.png';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify: boolean = false;
  disableGenerateNo = false;

  employee!: Employee;
  oldemployee!: Employee;

  selectedrow: any;

  employees: Array<Employee> = [];
  data!: MatTableDataSource<Employee>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png';

  enaadd: boolean = false;
  enaupd: boolean = false;
  enadel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;

  genders: Array<Gender> = [];
  designations: Array<Designation> = [];
  employeestatuses: Array<Empstatus> = [];
  employeetypes: Array<Emptype> = [];

  regexes: any;

  uiassist: UiAssist;

  minDate : Date;
  maxDate : Date;

  lastEmpCode: any = "";

  today:Date = new Date();

  constructor(

    private es: EmployeeService,
    private gs: GenderService,
    private ds: DesignationService,
    private ss: Empstatusservice,
    private et: Emptypeservice,
    private rs: RegexService,
    private fb: FormBuilder,
    private dg: MatDialog,
    private dp: DatePipe,
    public authService:AuthorizationManager) {


    this.uiassist = new UiAssist(this);

    this.csearch = this.fb.group({
      "csnumber": new FormControl(),
      "cscallingname": new FormControl(),
      "csgender": new FormControl(),
      "csdesignation": new FormControl(),
      "csname": new FormControl(),
      "csmodi": new FormControl(),
    });

    this.ssearch = this.fb.group({
      "ssnumber": new FormControl(),
      "ssfullname": new FormControl('',Validators.pattern("^([A-Z][a-z]*[.]?[\s]?)*([A-Z][a-z]*)$")),
      "ssgender": new FormControl(),
      "ssdesignation": new FormControl(),
      "ssnic": new FormControl()
    });


    this.form = this.fb.group({
      "number": new FormControl('', [Validators.required]),
      "fullname": new FormControl('', [Validators.required]),
      "callingname": new FormControl('', [Validators.required]),
      "gender": new FormControl('', [Validators.required]),
      "nic": new FormControl('', [Validators.required]),
      "dobirth": new FormControl('', [Validators.required]),
      "photo": new FormControl(),
      "address": new FormControl('', [Validators.required]),
      "mobile": new FormControl('', [Validators.required]),
      "land": new FormControl(),
      "email": new FormControl('', [Validators.required]),
      "designation": new FormControl('', [Validators.required]),
      "doassignment": new FormControl('', [Validators.required]),
      "description": new FormControl(),
      "emptype": new FormControl('', [Validators.required]),
      "empstatus": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.gs.getAllList().then((gens: Gender[]) => {
      this.genders = gens;
    });

    this.ds.getAllList().then((dess: Designation[]) => {
      this.designations = dess;
    });

    this.ss.getAllList().then((stes: Empstatus[]) => {
      this.employeestatuses = stes;
    });

    this.et.getAllList().then((typs: Emptype[]) => {
      this.employeetypes = typs;
    });

    this.rs.get('employee').then((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }


  createForm() {
    this.form.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.form.controls['fullname'].setValidators([Validators.required, Validators.pattern(this.regexes['fullname']['regex'])]);
    this.form.controls['callingname'].setValidators([Validators.required, Validators.pattern(this.regexes['callingname']['regex'])]);
    this.form.controls['gender'].setValidators([Validators.required]);
    this.form.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['dobirth'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators(Validators.required);
    this.form.controls['address'].setValidators([Validators.required, Validators.pattern(this.regexes['address']['regex'])]);
    this.form.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required,Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['designation'].setValidators([Validators.required]);
    this.form.controls['doassignment'].setValidators([Validators.required]);
    this.form.controls['description'].setValidators([Validators.pattern(this.regexes['description']['regex'])]);
    this.form.controls['emptype'].setValidators([Validators.required]);
    this.form.controls['empstatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if(controlName == "nic"){
            if(this.form.controls[controlName].valid){
              this.form.controls['dobirth'].setValue(this.getBirthdayFromNIC(value).birthDate);
            }else{
              this.form.controls['dobirth'].setValue("");
            }

          }
          // @ts-ignore
          if (controlName == "dobirth" || controlName == "doassignment")
            value = this.dp.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldemployee != undefined && control.valid) {
            // @ts-ignore
            if (value === this.employee[controlName]) {
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
    this.form.controls['doassignment'].setValue( new Date(this.today.getFullYear() , this.today.getMonth(), this.today.getDate()));
    this.disableGenerateNo =false;

    this.enableButtons(true,false,false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'employee' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'employee' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'employee' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.es.getAll(query)
      .then((emps: Employee[]) => {
        this.employees = emps;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.employees);
        this.data.paginator = this.paginator;
      });

  }

  getModi(element: Employee) {
    return element.number + '(' + element.callingname + ')';
  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    let number = sserchdata.ssnumber;
    let fullname = sserchdata.ssfullname;
    let nic = sserchdata.ssnic;
    let genderid = sserchdata.ssgender;
    let designationid = sserchdata.ssdesignation;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&number=" + number;
    if (fullname != null && fullname.trim() != "") query = query + "&fullname=" + fullname;
    if (nic != null && nic.trim() != "") query = query + "&nic=" + nic;
    if (genderid != null) query = query + "&genderid=" + genderid;
    if (designationid != null) query = query + "&designationid=" + designationid;

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

  selectImage(e: any): void {
    console.log(e.target.files[0]);
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.form.controls['photo'].markAsDirty();
  }


  add() {

    let errors = this.getErrors(['photo','land','description']);

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Employee Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.employee = this.form.getRawValue();
      this.employee.photo = btoa(this.imageempurl);

      let empdata: string = "";

      empdata = empdata + "<br>Number is : " + this.employee.number;
      empdata = empdata + "<br>Fullname is : " + this.employee.fullname;
      empdata = empdata + "<br>Callingname is : " + this.employee.callingname;

      const confirm = this.dg.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Employee Add",
          message: "Are you sure to Add the following Employee? <br> <br>" + empdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.es.add(this.employee).then((responce: [] | undefined) => {
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
              this.form.controls['doassignment'].setValue( new Date(this.today.getFullYear() , this.today.getMonth(), this.today.getDate()));
              this.form.controls['description'].setErrors({invalid : true});

              this.clearImage();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dg.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Employee Add", message: addmessage}
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

  fillForm(employee: Employee) {

    this.enableButtons(false,true,true);
    this.disableGenerateNo = true;

    this.selectedrow=employee;
    const loginEmployee = JSON.parse(localStorage.getItem('employee') || '');
    console.log(loginEmployee.id,employee.id)

    if (loginEmployee.id === employee.id) {
      this.disableModify = true;
    }else {
      this.disableModify = false;
    }

    this.employee = JSON.parse(JSON.stringify(employee));
    this.oldemployee = JSON.parse(JSON.stringify(employee));

    if (this.employee.photo != null) {
      this.imageempurl = atob(this.employee.photo);
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }

    this.employee.photo = "";

    //@ts-ignore
    this.employee.gender = this.genders.find(g => g.id === this.employee.gender.id);
    //@ts-ignore
    this.employee.designation = this.designations.find(d => d.id === this.employee.designation.id);
    //@ts-ignore
    this.employee.empstatus = this.employeestatuses.find(s => s.id === this.employee.empstatus.id);
    //@ts-ignore
    this.employee.emptype = this.employeetypes.find(s => s.id === this.employee.emptype.id);

    this.form.patchValue(this.employee);
    this.form.markAsPristine();
  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  update() {

    let errors = this.getErrors(['photo','land','description']);

    if (errors != "") {
      const errmsg = this.dg.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Employee Update ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dg.open(ConfirmComponent, {
          width: '450px',
          data: {
            heading: "Updates - Employee Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.employee = this.form.getRawValue();
            if (this.employee.land !== undefined || this.employee.land === ""){
              this.employee.land = null;
            }

            if (this.form.controls['photo'].dirty)
              this.employee.photo = btoa(this.imageempurl);

            else this.employee.photo = this.oldemployee.photo

            console.log(this.employee.photo.length);
            this.employee.id = this.oldemployee.id;

            this.es.update(this.employee).then((responce: [] | undefined) => {
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
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.form.reset();
                this.disableGenerateNo = false;
                this.clearImage();
                Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dg.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Employee Add", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {
        const updmsg = this.dg.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }

  delete() {
    const confirm = this.dg.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Confirmation",
        message: "Are you sure to Delete following Employee? <br> <br>" + this.employee.fullname
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.es.delete(this.employee.id).then((responce: [] | undefined) => {
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
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.form.reset();
            this.disableGenerateNo = false;
            this.clearImage();
            Object.values(this.form.controls).forEach(control => { control.markAsTouched(); });
            this.loadTable("");
          }

          const stsmsg = this.dg.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Employee Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }

  clear():void{

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
        this.selectedrow = null;
        this.createForm();
        this.clearImage();
        this.form.controls['description'].markAsPristine();
        this.form.controls['doassignment'].markAsPristine();
      }
    });
  }

  protected readonly document = document;

  checkEmpStatus(statusId: string) {
    switch (statusId) {
      case "Available":
        return "text-success-light";
      case "Unavailable":
        return "text-info-light";
      case "Suspended":
        return "text-danger-light";
      default:
        return "";
    }
  }

  getLastEmpCode() {
    this.es.getLastEmpCode().subscribe(ecode=>{
      console.log(ecode.code)
      this.lastEmpCode =ecode.code
      this.form.controls["number"].setValue(this.lastEmpCode)
    });

  }

  getBirthdayFromNIC(nic: string) {
    let year: number, dayOfYear: number;

    if (nic.length === 10 && /^[0-9]{9}[Vv]$/.test(nic)) {
      // Old NIC format (79XXXXXXXV)
      year = 1900 + parseInt(nic.substring(0, 2));
      dayOfYear = parseInt(nic.substring(2, 5));
    } else if (nic.length === 12 && /^[0-9]{12}$/.test(nic)) {
      // New NIC format (200012345678)
      year = parseInt(nic.substring(0, 4));
      dayOfYear = parseInt(nic.substring(4, 7));
    } else {
      throw new Error("Invalid NIC format");
    }

    // Determine gender and adjust day of year for females
    const gender = dayOfYear > 500 ? 'Female' : 'Male';
    if (dayOfYear > 500) dayOfYear -= 500;

    // Leap year check
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Convert day of year to month and date
    let month = 0;
    while (dayOfYear > daysInMonth[month]) {
      dayOfYear -= daysInMonth[month];
      month++;
    }

    // Format date correctly
    const birthDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayOfYear).padStart(2, '0')}`;
    return { birthDate, gender };
  }
}










