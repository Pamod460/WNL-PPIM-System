import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";

import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {MaterialPorder} from "../../../entity/MaterialPorder";
import {MaterialPorderStatus} from "../../../entity/MaterialPorderStatus";
import {MaterialPorderService} from "../../../service/materialporder/material-porder.service";
import {MaterialPorderStatusService} from "../../../service/materialporder/material-porder-status.service";
import {Supplier} from "../../../entity/Supplier";
import {SupplierService} from "../../../service/supplier/supplier.service";
import {Material} from "../../../entity/Material";
import {MaterialService} from "../../../service/material/material.service";
import {MaterialPorderMaterial} from "../../../entity/MaterialPorderMaterial";


@Component({
  selector: 'app-materialporder',
  templateUrl: './materialporder.component.html',
  styleUrls: ['./materialporder.component.css']
})
export class MaterialporderComponent implements OnInit {
  columns: string[] = ['number', 'date', 'supplier', 'status', 'expectedCost'];
  headers: string[] = ['PO Number', 'Date', 'Supplier' , 'Status', 'Expected Cost'];
  binders: string[] = ['poNumber', 'date', 'supplier.name', 'materialPorderStatus.name', 'expectedCost'];
  defaultProfile = 'assets/default.png';
  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  materialPorder!: MaterialPorder;
  oldMaterialPorder!: MaterialPorder;
  materialOrderData: any[] = [];
  filteredMaterialList: Material[] = [];
  selectedrow: any;
  MaterialPorders: MaterialPorder[] = [];
  data!: MatTableDataSource<MaterialPorder>;
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
  materialPorderStatuses: MaterialPorderStatus[] = [];
  suppliers: Supplier[] = [];
  materialList!: Material[];
  matchedNavItem = 'Material Purchase Order';
  materialForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: MaterialPorderMaterial;
  innerdata: MaterialPorderMaterial[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  smRole? = false;
  accRole? = false;
  approvalStatus = 'Not approved';
  isDisabledSmApproval = false;
  isDisabledAcApproval = false;

  constructor(
    private materialPorderService: MaterialPorderService,
    private materialPorderStatusService: MaterialPorderStatusService,
    private supplierService: SupplierService,
    private materialService: MaterialService,
    private regexService: RegexService,
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
      poNumber: new FormControl('', [Validators.maxLength(20)]),
      date: new FormControl('', [Validators.required]),
      expectedCost: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      logger: new FormControl(null, [Validators.required]),
      supplier: new FormControl(null, [Validators.required]),
      smApproved: new FormControl(),
      accountentApproved: new FormControl(),
      approvedManagerName: new FormControl(),
      approvedAccountantName: new FormControl(),
      materialPorderStatus: new FormControl(null, [Validators.required]),
      materialPorderMaterials: this.formBuilder.array([]),
    }, {updateOn: 'change'});
    this.materialForm = this.formBuilder.group({
      material: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      expectedLineCost: [0]
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    this.materialForm.get("quantity")?.valueChanges.subscribe(value => {
      const material = this.materialForm.get("material")?.value;
      if (material && value > 0) {
        this.updatePrices(value);
      } else {
        this.materialForm.get("expectedLineCost")?.setValue(null);
      }
    })
    this.form.get("logger")?.setValue(this.authService.getUsername());

    // this.form.get("materialPorderStatus")?.disable()


  }

  updatePrices(quantity: number) {

    const material = this.materialForm.get("material")?.value;
    if (!material || quantity <= 0) {
      this.materialForm.get("expectedLineCost")?.setValue(null);
      return;
    }

    const unitPrice = material.unitPrice || 0;
    const lineTotal = unitPrice * quantity;
    this.materialForm.get("expectedLineCost")?.setValue(lineTotal);

  }

  addToTable() {
    this.inndata = this.materialForm.getRawValue();

    // Validate material input
    if (!this.inndata.material || this.inndata.quantity == 0) {
      this.showMessageDialog("Errors - Material POrder Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;
    const unitPrice = this.inndata.material?.unitPrice || 0;
    const expectedLineCost = quantity * unitPrice;
    this.grandTotal += expectedLineCost
    this.form.get("expectedCost")?.setValue(this.grandTotal);
    console.log(this.inndata);
    const newEntry = new MaterialPorderMaterial(
      this.id,
      this.inndata.material,
      quantity,
      expectedLineCost
    );

    // Clone and repopulate innerdata
    const updatedData: MaterialPorderMaterial[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.material?.id === newEntry.material?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Material POrder Add", "Duplicate record.<br>This record already exists in the table.");
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
        heading: "Delete Material POrder",
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
        this.innerdata.splice(indexToDelete, 1);
        this.calculateGrandTotal();
        this.isInnerDataUpdated = true;
      }
    });
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.innerdata.reduce((total, item) => {
      return total + (item.expectedLineCost || 0);
    }, 0);
    this.form.get("expectedCost")?.setValue(this.grandTotal);
  }
  trackByInnerData(index: number, item: any): any {
    return item?.id || index;
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.regexService.get('materialporder').subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });
    this.materialService.getAllList().subscribe({
      next: (materials: Material[]) => {
        this.materialList = materials;
        this.filteredMaterialList = this.materialList;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.materialPorderStatusService.getAllList().subscribe(
      {
        next:
          (statuses: MaterialPorderStatus[]) => {
            this.materialPorderStatuses = statuses;
            // this.form.get("materialPorderStatus")?.setValue(this.materialPorderStatuses.find(m => m.id == 1))
          }, error: (error: any) => {
          console.error('Error fetching Material POrder  statuses:', error);
        }
      }
    )
    this.supplierService.getAllList().subscribe({
      next:
        (suppiers: Supplier[]) => {
          this.suppliers = suppiers;
        }, error: (error: any) => {
        console.error('Error fetching Material POrder  statuses:', error);
      }
    })
    this.form.get("date")?.setValue(this.today)

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.getNextCode();
  }

  get materials(): FormArray {
    return this.form.get('materialPorderMaterials') as FormArray;
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


          if (this.oldMaterialPorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.materialPorder[controlName]) {
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

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'material porder' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'material porder' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'material porder' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.materialPorderService.getAll(query).subscribe({
      next: (emps: MaterialPorder[]) => {
        this.MaterialPorders = emps;
        this.data = new MatTableDataSource(this.MaterialPorders);
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
    const mpstatusid = sserchdata.ssstatus;

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

      this.materialPorder = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.materialPorder.materialPorderMaterials = this.innerdata
      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.materialPorder.poNumber;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Material Purchase Order Add",
          message: "Are you sure to Add the following Material Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.materialPorderService.add(this.materialPorder).subscribe({
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

  onApprovalChange(isApproved: boolean) {
    this.approvalStatus = isApproved ? 'Approved' : 'Not approved';
  }

  fillForm(materialPorder: MaterialPorder) {


    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = materialPorder;

    this.materialPorder = JSON.parse(JSON.stringify(materialPorder));
    this.oldMaterialPorder = JSON.parse(JSON.stringify(materialPorder));
    this.innerdata = this.materialPorder.materialPorderMaterials ? this.materialPorder.materialPorderMaterials : []

    this.isDisabledAcApproval = this.oldMaterialPorder.approvedAccountantName != this.authService.getUsername()

    this.materialPorder.materialPorderStatus = this.materialPorderStatuses.find(s => s.id === this.materialPorder.materialPorderStatus?.id);
    this.materialPorder.supplier = this.suppliers.find(s => s.id === this.materialPorder.supplier?.id);

    this.form.patchValue(this.materialPorder);


    if (this.authService.getRoles() != null) {
      const roles = this.authService.getRoles();
      const username = this.authService.getUsername().toLowerCase();
      // @ts-ignore
      this.smRole = roles.some(role => role.name === "Store Manager" || role.name === "Admin");
      this.isDisabledSmApproval = !!this.oldMaterialPorder.approvedManagerName &&
        this.oldMaterialPorder.approvedManagerName.toLowerCase() !== username;


      if (this.smRole) {
        this.form.get("smApproved")?.valueChanges.subscribe(checked => {
          this.form.get("approvedManagerName")?.setValue(checked ? this.authService.getUsername() : null);
        });

        // Set initial value based on existing approval
        const isApproved = !!materialPorder.approvedManagerName;
        this.form.get("smApproved")?.setValue(isApproved, {emitEvent: false});
        this.form.get("approvedManagerName")?.setValue(materialPorder.approvedManagerName);
      }
      // @ts-ignore
      this.accRole = roles.some(role => role.name === "Accountant" || role.name === "Admin");
      this.isDisabledAcApproval = !!this.oldMaterialPorder.approvedAccountantName &&
        this.oldMaterialPorder.approvedAccountantName.toLowerCase() !== username;


      if (this.accRole) {
        this.form.get("accountentApproved")?.valueChanges.subscribe(checked => {
          this.form.get("approvedAccountantName")?.setValue(checked ? this.authService.getUsername() : null);
        });

        const isApproved = !!materialPorder.approvedAccountantName;
        this.form.get("accountentApproved")?.setValue(isApproved, {emitEvent: false});
        this.form.get("approvedAccountantName")?.setValue(materialPorder.approvedAccountantName);
      }
    }


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
        data: {heading: "Errors - Material POrder Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Material POrder Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("MaterialPorderService.update()");
            this.materialPorder = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.materialPorder.materialPorderMaterials = this.innerdata

            this.materialPorder.id = this.oldMaterialPorder.id;
            this.materialPorderService.update(this.materialPorder).subscribe({
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
          data: {heading: "Confirmation - Material POrder Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Material Purchase Order? <br> <br>" + this.materialPorder.poNumber
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.materialPorderService.delete(this.materialPorder.id).subscribe({
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
        heading: "Confirmation - MaterialPorder Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    })
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm()
        this.clearInnerTable()

      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.clearInnerTable()
    this.form.controls['description'].markAsPristine();
    this.smRole = false
    this.accRole = false
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

    this.materialPorderService.getNextCode("MPO-").subscribe(code => {
      this.form.controls["poNumber"].setValue(code.code);
    });
  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

}

// if (this.authService.getRoles() != null) {
//   this.smRole = this.authService.getRoles()?.some(role => role.name === "Store Manager" || role.name === "Admin");
//
//   this.isDisabledSmApproval = this.oldMaterialPorder.approvedManagerName ? this.oldMaterialPorder.approvedManagerName.toLowerCase() != this.authService.getUsername().toLowerCase() : false
//
//   if (this.smRole && !materialPorder.approvedManagerName) {
//     this.form.get("smApproved")?.valueChanges.subscribe(checked => {
//       if (checked) {
//         this.form.get("approvedManagerName")?.setValue(this.authService.getUsername())
//       } else {
//         this.form.get("approvedManagerName")?.setValue(null)
//       }
//
//     })
//   }
//
//   this.accRole = this.authService.getRoles()?.some(role => role.name === "Accountant" || role.name === "Admin");
//   this.isDisabledAcApproval = this.oldMaterialPorder.approvedAccountantName ? this.oldMaterialPorder.approvedAccountantName.toLowerCase() != this.authService.getUsername().toLowerCase() : false
//   if (this.accRole && !materialPorder.approvedAccountantName) {
//     this.form.get("accountentApproved")?.valueChanges.subscribe(checked => {
//       if (checked) {
//         this.form.get("approvedAccountantName")?.setValue(this.authService.getUsername())
//       } else {
//         this.form.get("approvedAccountantName")?.setValue(null)
//       }
//     })
//   }
// }

// if (this.smRole) {
//   if (!materialPorder.approvedManagerName){
//     this.form.get("smApproved")?.valueChanges.subscribe(checked => {
//       this.form.get("approvedManagerName")?.setValue(checked ? this.authService.getUsername() : null);
//     });
//   }
//  else {
//     this.form.get("approvedManagerName")?.setValue(this.oldMaterialPorder.approvedManagerName);
//   }
// }

// if (this.accRole) {
//   if (!materialPorder.approvedAccountantName){
//     this.form.get("accountentApproved")?.valueChanges.subscribe(checked => {
//       this.form.get("approvedAccountantName")?.setValue(checked ? this.authService.getUsername() : null);
//     });
//   }
//   else {
//     this.form.get("approvedAccountantName")?.setValue(this.oldMaterialPorder.approvedAccountantName);
//   }
// }
