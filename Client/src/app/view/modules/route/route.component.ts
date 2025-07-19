import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Operation} from "../../../entity/operation";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";

import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Route} from "../../../entity/Route";
import {RouteService} from "../../../service/route/route.service";
import {RouteStatus} from "../../../entity/RouteStatus'";
import {RouteStatusService} from "../../../service/route/route-status.service";
import formatters from "chart.js/dist/core/core.ticks";



@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  form!: FormGroup;
  ssearch!: FormGroup;

  routeStatuses!: RouteStatus[];
  routes!: Route[];

  route!: Route;
  oldroute!: Route;

  columns: string[] = ['name', 'distance', 'estimatedTime','routeStatus','routeNumber;'];
  headers: string[] = ['Name', 'Distance', 'Estimated Time', 'Status','Route Number'];
  binders: string[] = ['name', 'distance', 'estimatedTime','routeStatus.name', 'routeNumber'];


  data!: MatTableDataSource<Route>
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist: UiAssist;

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;

  selectedrow: any;

  searechOperations?: Operation[];
   routeNumber: any;

  constructor(
    private formBuilder: FormBuilder,
    private routeStatusesService: RouteStatusService,
    private routeService: RouteService,
    private matDialog: MatDialog,
    public authService: AuthorizationManager,
    private toastrService: ToastrService
  ) {

    this.uiassist = new UiAssist(this);
    this.routes = new Array<Route>();

    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      // map: new FormControl(null), // base64 string or file
      distance: new FormControl(null, [Validators.required, Validators.min(0)]),
      estimatedTime: new FormControl(null, [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      assignedDate: new FormControl('', Validators.required), // ISO string
      routeNumber: new FormControl('', Validators.required), // ISO string
      routeStatus: new FormControl('', Validators.required), // should be a string or enum
      logger: new FormControl('')
    });
    this.form.get("logger")?.setValue(this.authService.getUsername());


    this.ssearch = this.formBuilder.group({
      "ssrole": new FormControl(),
      // "ssmodule": new FormControl(),
      // "ssoperation": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.routeStatusesService.getAllList().subscribe((routeStatuses:  RouteStatus[]) => {
      this.routeStatuses = routeStatuses;
    });


    this.createForm();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.form.get('name')?.valueChanges.subscribe(value=>{
      if (value != null && value.length > 0 && value.length >= 3) {
      if (value.length==3) {
      this.getNextCode(value)
      }}
      else {
        this.form.get('routeNumber')?.setValue("");
      }
    })
  }

  createForm() {


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldroute != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.route[controlName]) {
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


    this.enableButtons(true, false, false);

  }


  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'route' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'route' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'route' && authority.operation === 'delete');

  }
  getNextCode(name:string) {

    this.routeService.getNextCode(name).subscribe(ecode => {
      console.log(ecode.code)
      this.routeNumber = ecode.code
      this.form.controls["routeNumber"].setValue(this.routeNumber)
    });

  }

  createView() {
    this.loadTable("");
  }

  loadTable(query: string): void {
    this.routeService.getAll(query).subscribe((routes: Route[]) => {
      this.routes = routes;
      this.data = new MatTableDataSource(this.routes);
      this.data.paginator = this.paginator;
    });

  }


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    // const roleid = sserchdata.ssrole;
    // const moduleid = sserchdata.ssmodule;
    // const operationid = sserchdata.ssoperation;
    //
    let query = "";
    //
    // if (roleid != null) query = query + "&roleid=" + roleid;
    // if (moduleid != null) query = query + "&moduleid=" + moduleid;
    // if (operationid != null) query = query + "&operationid=" + operationid;

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
        this.searechOperations = []
        this.loadTable("");
      }
    });

  }

  add() {

    const errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Route Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.route = this.form.getRawValue();

      let prvdata = "";

      prvdata = prvdata + "<br>Role is : " + this.route.name
      // prvdata = prvdata + "<br>Module is : " + this.privilage.module.name;
      // prvdata = prvdata + "<br>Operation is : " + this.privilage.operation.name;
      // prvdata = prvdata + "<br>Authority is : " + this.privilage.authority;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Route Add",
          message: "Are you sure to Add the folowing Employee? <br> <br>" + prvdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.routeService.add(this.route).subscribe({
            next: (response) => {
              this.toastrService.success(response.message).onShown.subscribe(() => {
                this.form.reset();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                this.loadTable("");
              })
            }, error: (error) => {
              this.toastrService.error(error.error.data.message)
            }
          });
        }
      });
    }
  }

  getErrors(): string {

    let errors = "";
    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      if (control.errors)
        errors = errors + "<br>Invalid " + controlName;
    }
    return errors;

  }

  fillForm(route: Route) {

    this.enableButtons(false, true, true);

    this.selectedrow = route;

    this.route = JSON.parse(JSON.stringify(route));
    this.oldroute = JSON.parse(JSON.stringify(route));

    // @ts-ignore
    this.route.routeStatus = this.routeStatuses.find(r => r.id === this.route.routeStatus.id);




    this.form.patchValue(this.route);
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

    const errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Route Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Confirmation - Route Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.route = this.form.getRawValue();

            this.route.id = this.oldroute.id;
            this.routeService.update(this.route).subscribe({
              next: (response) => {
                this.toastrService.success(response.message).onShown.subscribe(() => {
                  this.form.reset();
                  Object.values(this.form.controls).forEach(control => {
                    control.markAsTouched();
                  });
                  this.loadTable("");
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
          data: {heading: "Confirmation - Route Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }

  }


  delete() {

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Confirmation - Route Delete",
        message: "Are you sure to Delete folowing Authority? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.routeService.delete(this.route.id).subscribe({
          next: (response) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.form.reset();
              Object.values(this.form.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            })
          }, error: (error) => {
            this.toastrService.error(error.error.message)
          }
        })
      }
    });
  }

  clear(): void {

    const confirm = this.matDialog.open(ConfirmComponent, {
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
      }
    });
  }

  //
  // onFileSelected(event: Event): void {
  //   const file = (event.target as HTMLInputElement).files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       const base64 = (reader.result as string).split(',')[1];
  //       this.form.patchValue({map: base64});
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

}
