import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PaperPorder} from "../../../entity/PaperPorder";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {PaperPorderStatus} from "../../../entity/PaperPorderStatus";
import {Supplier} from "../../../entity/Supplier";
import {Paper} from "../../../entity/Paper";
import {PaperPorderStatusService} from "../../../service/paperporder/paper-porder-status.service";
import {SupplierService} from "../../../service/supplier/supplier.service";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {PaperPorderService} from "../../../service/paperporder/paper-porder.service";
import {PaperService} from "../../../service/Paper/paper.service";
import {PaperPorderPaper} from "../../../entity/PaperPorderPaper";

@Component({
  selector: 'app-paperporder',
  templateUrl: './paperporder.component.html',
  styleUrls: ['./paperporder.component.css']
})
export class PaperporderComponent implements OnInit {
  protected readonly document = document;

  columns: string[] = ['number', 'fullName', 'nic', 'PaperPorderStatus'];
  headers: string[] = ['Registration Number', 'Full Name', 'NIC', 'Status'];
  binders: string[] = ['number', 'fullName', 'nic', 'PaperPorderStatus.name'];

  defaultProfile = 'assets/default.png';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify = false;
  disableGenerateNo = false;

  paperPorder!: PaperPorder;
  oldPaperPorder!: PaperPorder;

  selectedrow: any;

  PaperPorders: PaperPorder[] = [];
  data!: MatTableDataSource<PaperPorder>;
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


  today: Date = new Date();


  paperPorderStatuses: PaperPorderStatus[] = [];
  suppliers: Supplier[] = [];

  paperList!: Paper[];
  paperForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: PaperPorderPaper;
  innerdata: PaperPorderPaper[] = [];
  matchedNavItem = "Paper Purchase Order";
  grandTotal = 0
  smRole? = false;
  accRole? = false;
  id!: number;
   filteredPaperList: any;

  constructor(
    private paperPorderService: PaperPorderService,
    private paperPorderStatusService: PaperPorderStatusService,
    private supplierService: SupplierService,
    private paperService: PaperService,
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
      "ssnumber": new FormControl(),
      "ssfullname": new FormControl('', Validators.pattern("^([A-Z][a-z]*[.]?[s]?)*([A-Z][a-z]*)$")),
      "ssgender": new FormControl(),
      "ssdesignation": new FormControl(),
      "ssnic": new FormControl()
    });
    this.form = this.formBuilder.group({
      poNumber: new FormControl('', [Validators.maxLength(6)]),
      date: new FormControl('', [Validators.required]),
      expectedCost: new FormControl(null, [Validators.required]),
      description: new FormControl(''),
      logger: new FormControl(null, [Validators.required]),
      supplier: new FormControl(null, [Validators.required]),
      paperPorderStatus: new FormControl(null, [Validators.required]),
      productPapers: this.formBuilder.array([]),
    }, {updateOn: 'change'});
    this.paperForm = this.formBuilder.group({
      paper: [null, Validators.required],
      quentity: [0, [Validators.required, Validators.min(1)]],
      expectedLineCost: [0]
    });
    this.form.get("logger")?.setValue(this.authService.getUsername());
    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
  }


  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.regexService.get('paperporder').subscribe((regs: []) => {
      console.log(regs)
      this.regexes = regs;
      this.createForm();
    });
    this.paperService.getAllList().subscribe({
      next: (papers: Paper[]) => {
        this.paperList = papers;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperPorderStatusService.getAllList().subscribe(
      {
        next:
          (statuses: PaperPorderStatus[]) => {
            this.paperPorderStatuses = statuses;
            this.form.get("materialPorderStatus")?.setValue( this.paperPorderStatuses.find(m=>m.id==1))
          }, error: (error: any) => {
          console.error('Error fetching PaperPorder statuses:', error);
        }
      }
    )
    this.supplierService.getAllList().subscribe({
      next:
        (suppiers: Supplier[]) => {
          this.suppliers = suppiers;
        }, error: (error: any) => {
        console.error('Error fetching PaperPorder statuses:', error);
      }
    })

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  addToTable() {
    this.inndata = this.paperForm.getRawValue();
    console.log(this.inndata.quentity)
    // Validate paper input
    if (!this.inndata.paper || this.inndata.quentity == 0) {
      this.showMessageDialog("Errors - Paper POrder Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quentity || 0;
    const unitPrice = this.inndata.paper?.unitPrice || 0;
    const expectedLineCost = quantity * unitPrice;
    this.grandTotal += expectedLineCost
    this.form.get("expectedCost")?.setValue(this.grandTotal);
    const newEntry = new PaperPorderPaper(
      this.id,
      this.inndata.paper,
      quantity,
      expectedLineCost
    );

    // Clone and repopulate innerdata
    const updatedData: PaperPorderPaper[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.paper?.id === newEntry.paper?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Paper POrder Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedPaperId = newEntry.paper?.id;
      const removeIndex = this.filteredPaperList.findIndex((e: { id: number | undefined; }) => e.id === addedPaperId);
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
        heading: "Delete Paper POrder",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const paper = this.innerdata[indexToDelete]?.paper;

        // Re-add the paper to the filtered list if not already present
        if (paper?.id) {
          const existingPaper = this.paperList.find(e => e.id === paper.id);
          const isAlreadyInFiltered = this.filteredPaperList.some((e: { id: number | undefined; }) => e.id === paper.id);

          if (existingPaper && !isAlreadyInFiltered) {
            this.filteredPaperList.push(existingPaper);
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

          if (this.oldPaperPorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.PaperPorder[controlName]) {
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
    console.log(authorities)
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'paper porder' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'paper porder' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'paper porder' && authority.operation === 'delete');
    console.log(this.hasDeleteAuthority)
  }

  loadTable(query: string) {

    this.paperPorderService.getAll(query).subscribe({
      next: (emps: PaperPorder[]) => {
        this.PaperPorders = emps;
        this.data = new MatTableDataSource(this.PaperPorders);
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

      this.paperPorder = this.form.getRawValue();

      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.paperPorder.poNumber;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Paper Purchase Order Add",
          message: "Are you sure to Add the following Paper Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.paperPorderService.add(this.paperPorder).subscribe({
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


  fillForm(PaperPorder: PaperPorder) {

    if (this.authService.getRoles() != null) {
      this.smRole = this.authService.getRoles()?.some(role => role.name === "Store Manager");
      if (this.smRole) {
        this.form.get("smApproved")?.valueChanges.subscribe(() => {
          this.form.get("approvedManagername")?.setValue(this.authService.getUsername())

        })
      }

      this.accRole = this.authService.getRoles()?.some(role => role.name === "Accountant");
      if (this.accRole) {
        this.form.get("accountentApproved")?.valueChanges.subscribe(() => {
          this.form.get("approvedManagername")?.setValue(this.authService.getUsername())

        })
      }
    }

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = PaperPorder;

    if (localStorage.getItem('PaperPorder')) {
      const loginPaperPorder = JSON.parse(localStorage.getItem('PaperPorder') || '');
      this.disableModify = loginPaperPorder.id === PaperPorder.id;
    }

    this.paperPorder = JSON.parse(JSON.stringify(PaperPorder));
    this.oldPaperPorder = JSON.parse(JSON.stringify(PaperPorder));


    this.paperPorder.paperPorderStatus = this.paperPorderStatuses.find(s => s.id === this.paperPorder.paperPorderStatus?.id);


    this.form.patchValue(this.paperPorder);
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

    const errors = this.getErrors(['photo', 'land', 'description']);

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - PaperPorder Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - PaperPorder Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("PaperPorderService.update()");
            this.paperPorder = this.form.getRawValue();


            this.paperPorder.id = this.oldPaperPorder.id;
            this.paperPorderService.update(this.paperPorder).subscribe({
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
          data: {heading: "Confirmation - PaperPorder Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Paper Purchase Order? <br> <br>" + this.paperPorder.poNumber
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.paperPorderService.delete(this.paperPorder.id).subscribe({
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

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Paper Porder Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    })
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm()
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.form.controls['description'].markAsPristine();
    this.form.controls['doassignment'].markAsPristine();
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


  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }
}


