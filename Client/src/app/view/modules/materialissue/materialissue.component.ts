import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialIssue} from "../../../entity/MaterialIssue";
import {Material} from "../../../entity/Material";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";
import {IssuedMaterial} from "../../../entity/IssuedMaterial";
import {MaterialPorder} from "../../../entity/MaterialPorder";
import {Productionorder} from "../../../entity/productionorder";
import {MaterialissueService} from "../../../service/materialissue/materialissue.service";

import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MaterialService} from "../../../service/material/material.service";
import {ProductionorderService} from "../../../service/productionorder/productionorder.service";
import {Productionorderstatus} from "../../../entity/productionorderstatus";

@Component({
  selector: 'app-materialissue',
  templateUrl: './materialissue.component.html',
  styleUrls: ['./materialissue.component.css']
})
export class MaterialissueComponent implements OnInit {

  columns: string[] = ['code', 'date', 'productionOrder'];
  headers: string[] = ['ISSUE Number', 'Date', 'Production Order'];
  binders: string[] = ['code', 'date', 'productionOrder.orderNo'];
  defaultProfile = 'assets/default.png';

  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  materialIssue!: MaterialIssue;
  oldMaterialIssue!: MaterialIssue;

  filteredMaterialList: Material[] = [];
  selectedrow: any;
  MaterialIssues: MaterialIssue[] = [];
  data!: MatTableDataSource<MaterialIssue>;
  imageurl = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl = 'assets/default.png';
  enaadd = false;
  enaupd = false;
  enadel = false;
  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;
  regexes: any;
  uiassist: UiAssist;
  minDate: Date;
  maxDate: Date;
  doaMaxDate: Date = new Date();
  lastEmpCode: any = "";
  today: Date = new Date();
  districts: District[] = [];

  materialList!: Material[];

  matchedNavItem = 'Material Issue';
  materialForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: IssuedMaterial;
  innerdata: IssuedMaterial[] = [];
  id: number = 0;
  protected readonly document = document;
  materialPorders: MaterialPorder[] = [];
  productionOrders: Productionorder[] = [];
   filterdProductionOrders: Productionorder[]=[];

  constructor(
    private materialIssueService: MaterialissueService,
    private materialService: MaterialService,
    private productionOrderService: ProductionorderService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    public authService: AuthorizationManager,
    private toastrService: ToastrService,
    private tableUtils: TableUtilsService
  ) {
    this.uiassist = new UiAssist(this);
    this.ssearch = this.formBuilder.group({
      "ssponumber": new FormControl(),
      "ssstatus": new FormControl(),
      "ssdate": new FormControl(),
    });
    this.form = this.formBuilder.group({
      code: new FormControl('', [Validators.maxLength(20)]),
      date: new FormControl('', [Validators.required]),
      issuedDate: new FormControl('', [Validators.required]),
      issuedTime: new FormControl(''), // Optional
      description: new FormControl(''),
      productionOrder: new FormControl(null),
      logger: new FormControl(),
      materialIssueMaterials: this.formBuilder.array([]),
    }, {updateOn: 'change'});

    this.materialForm = this.formBuilder.group({
      material: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    this.materialForm.get("quentity")?.valueChanges.subscribe(values => {

      this.updatePrices(values)
    })


  }

  updatePrices(values: number) {

    const unitPrice = this.materialForm.get("material")?.value.unitprice
    const lineTotal = unitPrice * values
    this.materialForm.get("expectedLineCost")?.setValue(lineTotal)

  }

  addToTable() {
    this.inndata = this.materialForm.getRawValue();
    if (!this.inndata.material || this.inndata.quantity == 0) {
      this.showMessageDialog("Errors - Material Issue Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;

    const newEntry = new IssuedMaterial(
      this.id,
      quantity,
      this.inndata.material
    );

    // Clone and repopulate innerdata
    const updatedData: IssuedMaterial[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.material?.id === newEntry.material?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Material Issue Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedMaterialId = newEntry.material?.id;
      const removeIndex = this.filteredMaterialList.findIndex(e => e.id === addedMaterialId);
      if (removeIndex > -1) {
        this.filteredMaterialList.splice(removeIndex, 1);
      }
      this.innerdata = updatedData;
      this.id++;
      this.isInnerDataUpdated = true;
      this.resetMaterialForm();
    }
  }

  private showMessageDialog(heading: string, message: string): void {
    const dialogRef = this.matDialog.open(MessageComponent, {
      width: '400px',
      data: {heading, message}
    });

    dialogRef.afterClosed().subscribe(); // Just to keep the observable chain alive
  }

  private resetMaterialForm(): void {
    this.materialForm.reset();
    for (const controlName in this.materialForm.controls) {
      const control = this.materialForm.controls[controlName];
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  deleteRow(x: { id: number }): void {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Material Issue",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const material = this.innerdata[indexToDelete]?.material;

        // Re-add the material to the filtered list if not already present
        if (material?.id) {
          if (!this.filteredMaterialList.some(e => e.id === material.id)) {
            this.filteredMaterialList = [material, ...this.filteredMaterialList];
          }
        }

        // Remove the entry from innerdata
        this.innerdata.splice(indexToDelete, 1);
        this.isInnerDataUpdated = true;
      }
    });
  }


  trackByInnerData(index: number, item: any): any {
    return item?.id || index;
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.createForm();
    // this.regexService.get('materialissue').subscribe((regs: []) => {
    //   console.log(regs)
    //   this.regexes = regs;
    //
    // });
    this.materialService.getAllList().subscribe({
      next: (materials: Material[]) => {
        this.materialList = materials;
        // @ts-ignore
        this.filteredMaterialList = this.materialList.filter(mat=>Number.parseInt( mat.rop)< Number.parseInt( mat.quantity))

        console.log(this.filteredMaterialList,this.materialList)
      }, error: (err: any) => {
        console.log(err);
      }
    })

    this.productionOrderService.getAll("").subscribe(response => {
      this.productionOrders = response;
      this.filterdProductionOrders=this.productionOrders.filter(x=>x.productionOrderStatus.id==1)
    })
    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.form.get("logger")?.setValue(this.authService.getUsername());
    this.getNextCode()
  }


  createView() {
    this.loadTable("");
  }


  createForm() {


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {


          if (controlName == "doRegisterd")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldMaterialIssue != undefined && control.valid) {
            // @ts-ignore
            if (value === this.MaterialIssue[controlName]) {
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
    this.disableGenerateNo = false;

    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'material issue' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'material issue' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'material issue' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.materialIssueService.getAll(query).subscribe({
      next: (emps: MaterialIssue[]) => {
        this.MaterialIssues = emps;
        this.data = new MatTableDataSource(this.MaterialIssues);
        this.data.paginator = this.paginator;
      }, error: (error: any) => {
        console.log(error);
      }
    });

  }


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    const number = sserchdata.ssponumber;
    const date = sserchdata.ssdate;
    const mpstatusid = sserchdata.ssgender;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&ponumber=" + number;
    if (date != null && date.trim() != "") query = query + "&date=" + date;
    if (mpstatusid != null) query = query + "&mpstatusid=" + mpstatusid;

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


  add() {

    const errors = this.getErrors(['photo', 'land', 'description']);

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {
          heading: "Errors - Material Purchase Order Add ",
          message: "You have the following Errors <br> " + errors
        }
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.materialIssue = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.materialIssue.issuedMaterials = this.innerdata
      this.materialIssue.date= this.datePipe.transform(this.materialIssue.date, 'yyyy-MM-dd');
      this.materialIssue.issuedDate = this.datePipe.transform(this.materialIssue.issuedDate, 'yyyy-MM-dd');


      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.materialIssue.code;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Material Purchase Order Add",
          message: "Are you sure to Add the following Material Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.materialIssueService.add(this.materialIssue).subscribe({
            next: (response) => {
              this.toastrService.success(response.message).onShown.subscribe(() => {
                this.disableGenerateNo = false;
                this.loadTable("");
                this.resetForm()
              })
            }, error: (error) => {

              this.toastrService.error(error.error.data.message)
            }
          });
        }
      });
    }
  }


  getErrors(optionalFields?: string[]): string {
    let errors = "";

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];

      // Allow optional fields only if they are empty, but still validate if they contain a value
      if (!optionalFields?.includes(controlName) || (control.value && control.errors)) {
        if (control.errors) {
          if (this.regexes[controlName] !== undefined) {
            errors += "<br>" + this.regexes[controlName]['message'];
          } else {
            errors += "<br>Invalid " + controlName;
          }
        }
      }
    }
    return errors;
  }


  fillForm(MaterialIssue: MaterialIssue) {


    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = MaterialIssue;

    this.materialIssue = JSON.parse(JSON.stringify(MaterialIssue));
    this.oldMaterialIssue = JSON.parse(JSON.stringify(MaterialIssue));
    this.innerdata = this.materialIssue.issuedMaterials ? this.materialIssue.issuedMaterials : []

    this.materialIssue.productionOrder = this.productionOrders.find(s => s.id === this.materialIssue.productionOrder?.id);
    this.form.patchValue(this.materialIssue);
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
    if (this.isInnerDataUpdated) {
      updates += "<br> Material Quantity Changed"
    }
    return updates;
  }

  update() {

    const errors = this.getErrors(['photo', 'land', 'description']);

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Issue Update ", message: "You have the following Errors <br> " + errors}
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
          width: '450px',
          data: {
            heading: "Updates - Material Issue Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("MaterialIssueService.update()");
            this.materialIssue = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.materialIssue.issuedMaterials = this.innerdata
            this.materialIssue.date= this.datePipe.transform(this.materialIssue.date, 'yyyy-MM-dd');
            this.materialIssue.issuedDate = this.datePipe.transform(this.materialIssue.issuedDate, 'yyyy-MM-dd');


            this.materialIssue.id = this.oldMaterialIssue.id;
            this.materialIssueService.update(this.materialIssue).subscribe({
              next: (response) => {
                this.toastrService.success(response.message).onShown.subscribe(() => {
                  this.disableGenerateNo = false;
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
          data: {heading: "Confirmation - Material Issue Update", message: "Nothing Changed"}
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
        heading: "Delete Confirmation",
        message: "Are you sure to Delete following Material Purchase Order? <br> <br>" + this.materialIssue.code
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.materialIssueService.delete(this.materialIssue.id).subscribe({
          next: (response) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.disableGenerateNo = false;
              this.loadTable("");
              this.resetForm()
            })
          }, error: (error) => {
            this.toastrService.error(error.error.message)
          }
        });
      }
    });
  }

  clearInnerTable() {
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true, false, false);

  }

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - MaterialIssue Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    })
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm()
        this.clearInnerTable()
        this.initialize()

      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.clearInnerTable()
    this.form.controls['description'].markAsPristine();

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    this.enableButtons(true, false, false);
  }

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

  getNextCode() {

    this.materialIssueService.getNextCode().subscribe(code => {
      this.form.controls["code"].setValue(code.code);
    });
  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

  get toscheduledControl() {
    return this.form.get('toscheduled');
  }
}
