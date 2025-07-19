import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Material} from "../../../entity/Material";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";
import {MaterialGrnStatus} from "../../../entity/MaterialGrnStatus";
import {MaterialService} from "../../../service/material/material.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MaterialGrnMaterial} from "../../../entity/MaterialGrnMaterial";
import {MaterialPorder} from "../../../entity/MaterialPorder";
import {MaterialGrnService} from "../../../service/materialgrn/material-grn.service";
import {MaterialGrnStatusService} from "../../../service/materialgrn/material-grn-status.service";
import {MaterialGrn} from "../../../entity/MaterialGrn";
import {MaterialPorderService} from "../../../service/materialporder/material-porder.service";
import {MaterialPorderMaterial} from "../../../entity/MaterialPorderMaterial";


@Component({
  selector: 'app-materialgrn',
  templateUrl: './materialgrn.component.html',
  styleUrls: ['./materialgrn.component.css']
})
export class MaterialgrnComponent implements OnInit {
  columns: string[] = ['code', 'date', 'grandTotal', 'materialGrnStatus'];
  headers: string[] = ['GRN Number', 'Date', 'Grand Total', 'Status'];
  binders: string[] = ['code', 'date', 'grandTotal', 'materialGrnStatus.name'];
  defaultProfile = 'assets/default.png';

  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  materialGrn!: MaterialGrn;
  oldMaterialGrn!: MaterialGrn;

  filteredMaterialList: Material[] = [];
  selectedrow: any;
  MaterialGrns: MaterialGrn[] = [];
  data!: MatTableDataSource<MaterialGrn>;
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
  materialGrnStatuses: MaterialGrnStatus[] = [];
  materialList!: Material[];
  matchedNavItem = 'Material GRN';
  materialForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: MaterialGrnMaterial;
  innerdata: MaterialGrnMaterial[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  materialPorders: MaterialPorder[] = [];
  isModify = false
  filteredmaterialPorders: MaterialPorder[] = [];

  constructor(
    private materialGrnService: MaterialGrnService,
    private materialGrnStatusService: MaterialGrnStatusService,
    private materialService: MaterialService,
    private materialPorderService: MaterialPorderService,
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
      code: new FormControl('', [Validators.maxLength(17)]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl(''), // Optional
      grandTotal: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      materialGrnStatus: new FormControl(null, [Validators.required]),
      materialPorder: new FormControl(null),
      logger: new FormControl(),
      materialGrnMaterials: this.formBuilder.array([]),
    }, {updateOn: 'change'});

    this.materialForm = this.formBuilder.group({
      material: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineCost: [0],
      unitPrice: [0]
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    this.materialForm.get("quantity")?.valueChanges.subscribe(values => {

      this.updatePrices(values)
    })


  }

  updatePrices(values: number) {

    const unitPrice = this.materialForm.get("material")?.value?.unitPrice || 0;
    const lineTotal = unitPrice * values
    this.materialForm.get("lineCost")?.setValue(lineTotal)

  }

  addToTable() {
    this.inndata = this.materialForm.getRawValue();
    console.log(this.inndata)
    if (!this.inndata.material || this.inndata.quantity == 0) {
      this.showMessageDialog("Errors - Material Grn Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;
    const unitPrice = this.inndata.material.unitPrice || 0;
    const linecost = quantity * unitPrice;
    this.grandTotal += linecost
    this.form.get("grandTotal")?.setValue(this.grandTotal);
    const newEntry = new MaterialGrnMaterial(
      this.id,
      this.inndata.material,
      quantity,
      linecost,
      unitPrice
    );

    // Clone and repopulate innerdata
    const updatedData: MaterialGrnMaterial[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.material?.id === newEntry.material?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Material Grn Add", "Duplicate record.<br>This record already exists in the table.");
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
        heading: "Delete Material Grn",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const material = this.innerdata[indexToDelete]?.material;
        if (material?.id) {
          if (!this.filteredMaterialList.some(e => e.id === material.id)) {
            this.filteredMaterialList = [material, ...this.filteredMaterialList];
          }
        }
        // Remove the entry from innerdata
        this.innerdata.splice(indexToDelete, 1);
        this.calculateGrandTotal();
        this.isInnerDataUpdated = true;
      }
    });
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.innerdata.reduce((total, item) => {
      return total + (item.lineCost || 0);
    }, 0);
    this.form.get("grandTotal")?.setValue(this.grandTotal);
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
    this.materialService.getAllList().subscribe({
      next: (materials: Material[]) => {
        this.materialList = materials;
        this.filteredMaterialList = this.materialList;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.materialPorderService.getAllList().subscribe(response => {
      this.materialPorders = response;
      this.filteredmaterialPorders = this.materialPorders.filter(poder => poder.smApproved && poder.accountentApproved);
    })
    this.materialGrnStatusService.getAllList().subscribe(
      {
        next:
          (statuses: MaterialGrnStatus[]) => {
            this.materialGrnStatuses = statuses;
          }, error: (error: any) => {
          console.error('Error fetching Material Grn  statuses:', error);
        }
      }
    )


    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.form.get("logger")?.setValue(this.authService.getUsername());
    this.getNextCode();
  }

  get materials(): FormArray {
    return this.form.get('materialGrnMaterials') as FormArray;
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

          if (this.oldMaterialGrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.materialGrn[controlName]) {
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

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'material grn' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'material grn' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'material grn' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.materialGrnService.getAll(query).subscribe({
      next: (emps: MaterialGrn[]) => {
        this.MaterialGrns = emps;
        this.data = new MatTableDataSource(this.MaterialGrns);
        this.data.paginator = this.paginator;
      }, error: (error) => {
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

      this.materialGrn = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.materialGrn.materialGrnMaterials = this.innerdata
      // @ts-ignore
      this.materialGrn.date=this.datePipe.transform(new Date(this.materialGrn.date), 'yyyy-MM-dd');
      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.materialGrn.code;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Material Purchase Order Add",
          message: "Are you sure to Add the following Material Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.materialGrnService.add(this.materialGrn).subscribe({
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


  fillForm(materialGrn: MaterialGrn) {
    this.isModify = true

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = materialGrn;

    this.materialGrn = JSON.parse(JSON.stringify(materialGrn));
    this.oldMaterialGrn = JSON.parse(JSON.stringify(materialGrn));
    this.innerdata = this.materialGrn.materialGrnMaterials ? this.materialGrn.materialGrnMaterials : []

    this.materialGrn.materialGrnStatus = this.materialGrnStatuses.find(s => s.id === this.materialGrn.materialGrnStatus?.id);
    this.materialGrn.materialPorder = this.materialPorders.find(s => s.id === this.materialGrn.materialPorder?.id);
    this.innerdata = this.materialGrn.materialGrnMaterials

    this.form.patchValue(this.materialGrn);
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
        data: {heading: "Errors - Material Grn Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Material Grn Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("MaterialGrnService.update()");
            this.materialGrn = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.materialGrn.materialGrnMaterials = this.innerdata
            // @ts-ignore
            this.materialGrn.date=this.datePipe.transform(new Date(this.materialGrn.date), 'yyyy-MM-dd');

            this.materialGrn.id = this.oldMaterialGrn.id;
            this.materialGrnService.update(this.materialGrn).subscribe({
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
          data: {heading: "Confirmation - Material Grn Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Material Purchase Order? <br> <br>" + this.materialGrn.code
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.materialGrnService.delete(this.materialGrn.id).subscribe({
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

  clearInnerTable() {
    this.innerdata = [];
    this.isInnerDataUpdated = false;

    this.enableButtons(true, false, false);

  }

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - MaterialGrn Clear",
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
    this.form.get("logger")?.setValue(this.authService.getUsername());
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

    this.materialGrnService.getNextCode("MGRN-").subscribe(code => {
      this.form.controls["code"].setValue(code.code);
    });
  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

  get timeControl() {
    return this.form.get('time');
  }

  loadMaterialList(event: any) {
    this.innerdata = [];
    const selectedPorder = event.value;
    selectedPorder.materialPorderMaterials?.forEach((materialPorderMaterial:MaterialPorderMaterial) => {

      this.materialForm.get("material")?.setValue(materialPorderMaterial.material);
      this.materialForm.get("quantity")?.setValue(materialPorderMaterial.quantity);
      this.materialForm.get("lineCost")?.setValue(materialPorderMaterial.expectedLineCost);
      console.log(this.materialForm.getRawValue(),materialPorderMaterial)
      this.addToTable()
    })
  }
}
