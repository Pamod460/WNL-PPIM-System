import {Component, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Role} from "../../../entity/role";
import {Module} from "../../../entity/module";
import {Operation} from "../../../entity/operation";
import {RoleService} from "../../../service/privilage/role.service";
import {ModuleService} from "../../../service/privilage/module.service";
import {OperationService} from "../../../service/privilage/operation.service";
import {MatTableDataSource} from "@angular/material/table";
import {Privilege} from "../../../entity/privilege";
import {UiAssist} from "../../../util/ui/ui.assist";
import {PrivilageService} from "../../../service/privilage/privilage.service";
import {MatPaginator} from "@angular/material/paginator";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-privileg',
  templateUrl: './privilage.component.html',
  styleUrls: ['./privilage.component.css']
})
export class PrivilageComponent implements OnInit {

  form!: FormGroup;
  ssearch!: FormGroup;

  roles!: Role[];
  modules!: Module[];
  operations!: Operation[];
  privilages!: Privilege[];

  privilage!: Privilege;
  oldprivilage!: Privilege;

  columns: string[] = ['role', 'authority', 'module', 'operation'];
  headers: string[] = ['Role', 'Authority', 'Model', 'Operation'];
  binders: string[] = ['role.name', 'authority', 'module.name', 'operation.name'];

  data!: MatTableDataSource<Privilege>
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

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private moduleService: ModuleService,
    private operationService: OperationService,
    private privilageService: PrivilageService,
    private matDialog: MatDialog,
    public authService: AuthorizationManager,
    private toastrService: ToastrService
  ) {

    this.uiassist = new UiAssist(this);
    this.privilages = new Array<Privilege>();

    this.form = this.formBuilder.group({
      "role": new FormControl('', Validators.required),
      "module": new FormControl('', Validators.required),
      "operation": new FormControl('', Validators.required),
      "authority": new FormControl(),
    }, {updateOn: 'change'});

    this.ssearch = this.formBuilder.group({
      "ssrole": new FormControl(),
      "ssmodule": new FormControl(),
      "ssoperation": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.roleService.getAllList().subscribe((rls: Role[]) => {
      this.roles = rls;
    });

    this.moduleService.getAllList().subscribe((mds: Module[]) => {
      this.modules = mds;
    });

    this.createForm();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createForm() {

    this.form.controls['role'].setValidators([Validators.required]);
    this.form.controls['module'].setValidators([Validators.required]);
    this.form.controls['operation'].setValidators([Validators.required]);
    this.form.controls['authority'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldprivilage != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.privilage[controlName]) {
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


    this.loadForm();

    this.enableButtons(true, false, false);

  }

  onOperationSelectionChange() {
    this.clearAuthority();
    this.generateAuthority();

  }

  clearAuthority(): void {
    const module = this.getRawValueOrDefault(this.form.controls['module']);
    const operation = this.getRawValueOrDefault(this.form.controls['operation']);
    console.log(module + " -  module");
    console.log(operation + " -  operation");

    if (!module && !operation) {
      this.form.controls['authority'].setValue("");
    }
  }

  generateAuthority(): void {
    const module = this.getRawValueOrDefault(this.form.controls['module']);
    const operation = this.getRawValueOrDefault(this.form.controls['operation']);

    if (module && operation) {
      this.form.controls['authority'].setValue(`${module}-${operation}`);
    }
  }

  private getRawValueOrDefault(control: AbstractControl): string {
    return control.getRawValue()?.name?.toLowerCase() || "";
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'privilege' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'privilege' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'privilege' && authority.operation === 'delete');

  }

  loadForm() {
    this.operationService.getAll('').subscribe((ops: Operation[]) => {
      this.operations = ops;
    });
  }


  createView() {
    this.loadTable("");
  }

  loadTable(query: string): void {
    this.privilageService.getAll(query).subscribe((prvgs: Privilege[]) => {
      this.privilages = prvgs;
      this.data = new MatTableDataSource(this.privilages);
      this.data.paginator = this.paginator;
    });

  }


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    const roleid = sserchdata.ssrole;
    const moduleid = sserchdata.ssmodule;
    const operationid = sserchdata.ssoperation;

    let query = "";

    if (roleid != null) query = query + "&roleid=" + roleid;
    if (moduleid != null) query = query + "&moduleid=" + moduleid;
    if (operationid != null) query = query + "&operationid=" + operationid;

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
        data: {heading: "Errors - Privilege Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.privilage = this.form.getRawValue();

      let prvdata = "";

      prvdata = prvdata + "<br>Role is : " + this.privilage.role.name
      prvdata = prvdata + "<br>Module is : " + this.privilage.module.name;
      prvdata = prvdata + "<br>Operation is : " + this.privilage.operation.name;
      prvdata = prvdata + "<br>Authority is : " + this.privilage.authority;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Privilege Add",
          message: "Are you sure to Add the folowing Employee? <br> <br>" + prvdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.privilageService.add(this.privilage).subscribe({
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

  fillForm(privilege: Privilege) {

    this.enableButtons(false, true, true);

    this.selectedrow = privilege;

    this.privilage = JSON.parse(JSON.stringify(privilege));
    this.oldprivilage = JSON.parse(JSON.stringify(privilege));

    // Find and set role
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    this.privilage.role = this.roles.find(r => r.id === this.privilage.role.id);

    // Find and set module
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    this.privilage.module = this.modules.find(m => m.id === this.privilage.module.id);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    this.privilage.operation = this.operations.find(o => o.id === this.privilage.operation.id)

    console.log(this.privilage.operation.name);

    this.form.patchValue(this.privilage);
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
        data: {heading: "Errors - Privilege Update ", message: "You have following Errors <br> " + errors}
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
            heading: "Confirmation - Privilege Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.privilage = this.form.getRawValue();

            this.privilage.id = this.oldprivilage.id;
            this.privilageService.update(this.privilage).subscribe({
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
          data: {heading: "Confirmation - Privilege Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Privilege Delete",
        message: "Are you sure to Delete folowing Authority? <br> <br>" + this.privilage.authority
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.privilageService.delete(this.privilage.id).subscribe({
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

  loadSearchOperations() {
    this.operationService.getAll('').subscribe((ops: Operation[]) => {
      this.searechOperations = ops;
    });
  }

}
