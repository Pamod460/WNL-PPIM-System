import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import {UiAssist} from "../../../util/ui/ui.assist";
import {Paper} from "../../../entity/Paper";
import {PaperService} from "../../../service/Paper/paper.service";

import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {PaperGrn} from "../../../entity/PaperGrn";
import {District} from "../../../entity/District";
import {PaperGrnStatus} from "../../../entity/PaperGrnStatus";

import {PaperGrnService} from "../../../service/papergrn/paper-grn.service";
import {PaperGrnPaper} from "../../../entity/PaperGrnPaper";
import {PaperGrnStatusService} from "../../../service/papergrn/paper-grn-status.service";
import {PaperPorder} from "../../../entity/PaperPorder";
import {PaperPorderService} from "../../../service/paperporder/paper-porder.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MaterialPorderMaterial} from "../../../entity/MaterialPorderMaterial";
import {PaperPorderPaper} from "../../../entity/PaperPorderPaper";

@Component({
  selector: 'app-papergrn',
  templateUrl: './papergrn.component.html',
  styleUrls: ['./papergrn.component.css']
})
export class PapergrnComponent implements OnInit {
  columns: string[] = ['code', 'date', 'grandTotal', 'paperGrnStatus'];
  headers: string[] = ['GRN Number', 'Date', 'Grand Total', 'Status'];
  binders: string[] = ['code', 'date', 'grandTotal', 'paperGrnStatus.name'];
  defaultProfile = 'assets/default.png';

  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  paperGrn!: PaperGrn;
  oldPaperGrn!: PaperGrn;

  filteredPaperList: Paper[] = [];
  selectedrow: any;
  PaperGrns: PaperGrn[] = [];
  data!: MatTableDataSource<PaperGrn>;
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
  paperGrnStatuses: PaperGrnStatus[] = [];
  paperList!: Paper[];
  matchedNavItem = 'Paper GRN';
  paperForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: PaperGrnPaper;
  innerdata: PaperGrnPaper[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  paperPorders: PaperPorder[] = [];
  isModify = false

  constructor(
    private paperGrnService: PaperGrnService,
    private paperGrnStatusService: PaperGrnStatusService,
    private paperService: PaperService,
    private paperPorderService: PaperPorderService,
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
      paperGrnStatus: new FormControl(null, [Validators.required]),
      paperPorder: new FormControl(null),
      logger: new FormControl(),
      paperGrnPapers: this.formBuilder.array([]),
    }, {updateOn: 'change'});

    this.paperForm = this.formBuilder.group({
      paper: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineCost: [0],
      unitPrice: [0]
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    this.paperForm.get("quantity")?.valueChanges.subscribe(values => {

      this.updatePrices(values)
    })


  }

  updatePrices(values: number) {
    const selectedPaper = this.paperForm.get("paper")?.value;
    const unitPrice = selectedPaper?.unitPrice;

    if (typeof unitPrice !== 'number' || isNaN(unitPrice) || typeof values !== 'number' || isNaN(values)) {
      this.paperForm.get("lineCost")?.setValue(null);
      return;
    }

    const lineTotal = unitPrice * values;
    this.paperForm.get("lineCost")?.setValue(lineTotal);
  }


  addToTable() {
    this.inndata = this.paperForm.getRawValue();
    console.log(this.inndata)
    if (!this.inndata.paper || this.inndata.quantity == 0) {
      this.showMessageDialog("Errors - Paper Grn Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;
    const unitPrice = this.inndata.paper.unitPrice || 0;
    const linecost = quantity * unitPrice;
    this.grandTotal += linecost
    this.form.get("grandTotal")?.setValue(this.grandTotal);
    const newEntry = new PaperGrnPaper(
      this.id,
      this.inndata.paper,
      quantity,
      linecost,
      unitPrice
    );

    // Clone and repopulate innerdata
    const updatedData: PaperGrnPaper[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.paper?.id === newEntry.paper?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Paper Grn Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedPaperId = newEntry.paper?.id;
      const removeIndex = this.filteredPaperList.findIndex(e => e.id === addedPaperId);
      if (removeIndex > -1) {
        this.filteredPaperList.splice(removeIndex, 1);
      }
      this.innerdata = updatedData;
      this.id++;
      this.isInnerDataUpdated = true;
      this.resetPaperForm();
    }
  }

  private showMessageDialog(heading: string, message: string): void {
    const dialogRef = this.matDialog.open(MessageComponent, {
      width: '400px',
      data: {heading, message}
    });

    dialogRef.afterClosed().subscribe(); // Just to keep the observable chain alive
  }

  private resetPaperForm(): void {
    this.paperForm.reset();
    for (const controlName in this.paperForm.controls) {
      const control = this.paperForm.controls[controlName];
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  deleteRow(x: { id: number }): void {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Paper Grn",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const paper = this.innerdata[indexToDelete]?.paper;
        if (paper?.id) {
          if (!this.filteredPaperList.some(e => e.id === paper.id)) {
            this.filteredPaperList = [paper, ...this.filteredPaperList];
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
    this.paperService.getAllList().subscribe({
      next: (papers: Paper[]) => {
        this.paperList = papers;
        this.filteredPaperList = this.paperList;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperPorderService.getAllList().subscribe(response => {
      this.paperPorders = response;
    })
    this.paperGrnStatusService.getAllList().subscribe(
      {
        next:
          (statuses: PaperGrnStatus[]) => {
            this.paperGrnStatuses = statuses;
            // this.form.get("paperGrnStatus")?.setValue(this.paperGrnStatuses.find(m => m.id == 1))
          }, error: (error: any) => {
          console.error('Error fetching Paper Grn  statuses:', error);
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

  get papers(): FormArray {
    return this.form.get('paperGrnPapers') as FormArray;
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

          if (this.oldPaperGrn != undefined && control.valid) {
            // @ts-ignore
            if (value === this.paperGrn[controlName]) {
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

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'paper grn' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'paper grn' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'paper grn' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.paperGrnService.getAll(query).subscribe({
      next: (emps: PaperGrn[]) => {
        this.PaperGrns = emps;
        this.data = new MatTableDataSource(this.PaperGrns);
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
          heading: "Errors - Paper Purchase Order Add ",
          message: "You have the following Errors <br> " + errors
        }
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.paperGrn = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.paperGrn.paperGrnPapers = this.innerdata
      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.paperGrn.code;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Paper Purchase Order Add",
          message: "Are you sure to Add the following Paper Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.paperGrnService.add(this.paperGrn).subscribe({
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


  fillForm(paperGrn: PaperGrn) {
    this.isModify = true

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = paperGrn;

    this.paperGrn = JSON.parse(JSON.stringify(paperGrn));
    this.oldPaperGrn = JSON.parse(JSON.stringify(paperGrn));
    this.innerdata = this.paperGrn.paperGrnPapers ? this.paperGrn.paperGrnPapers : []

    this.paperGrn.paperGrnStatus = this.paperGrnStatuses.find(s => s.id === this.paperGrn.paperGrnStatus?.id);
    this.paperGrn.paperPorder = this.paperPorders.find(s => s.id === this.paperGrn.paperPorder?.id);
    this.innerdata = this.paperGrn.paperGrnPapers

    this.form.patchValue(this.paperGrn);
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
      updates += "<br> Paper Quantity Changed"
    }
    return updates;
  }

  update() {

    const errors = this.getErrors(['photo', 'land', 'description']);

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Paper Grn Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Paper Grn Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("PaperGrnService.update()");
            this.paperGrn = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.paperGrn.paperGrnPapers = this.innerdata

            this.paperGrn.id = this.oldPaperGrn.id;
            this.paperGrnService.update(this.paperGrn).subscribe({
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
          data: {heading: "Confirmation - Paper Grn Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Paper Purchase Order? <br> <br>" + this.paperGrn.code
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.paperGrnService.delete(this.paperGrn.id).subscribe({
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
        heading: "Confirmation - PaperGrn Clear",
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
    this.paperForm.reset();
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

    this.paperGrnService.getNextCode("PGRN-").subscribe(code => {
      this.form.controls["code"].setValue(code.code);
    });
  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

  get toscheduledControl() {
    return this.form.get('toscheduled');
  }

  loadPaperList(event: any) {
    this.innerdata = [];
    const selectedPorder = event.value;
    selectedPorder.paperPorderPapers?.forEach((materialPorderMaterial:PaperPorderPaper) => {
      this.paperForm.get("paper")?.setValue(materialPorderMaterial.paper);
      this.paperForm.get("quantity")?.setValue(materialPorderMaterial.quentity);
      console.log(materialPorderMaterial.expectedLineCost,materialPorderMaterial.quentity)
      this.paperForm.get("lineCost")?.setValue(materialPorderMaterial.expectedLineCost);
      console.log(this.paperForm.getRawValue(),materialPorderMaterial)
      this.addToTable()
      // this.paperForm.reset()
    })
  }
}
