import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MaterialPorder} from "../../../entity/MaterialPorder";
import {Material} from "../../../entity/Material";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";
import {MaterialPorderStatus} from "../../../entity/MaterialPorderStatus";
import {Supplier} from "../../../entity/Supplier";
import {MaterialPorderMaterial} from "../../../entity/MaterialPorderMaterial";
import {MaterialPorderService} from "../../../service/materialporder/material-porder.service";
import {MaterialPorderStatusService} from "../../../service/materialporder/material-porder-status.service";
import {SupplierService} from "../../../service/supplier/supplier.service";
import {MaterialService} from "../../../service/material/material.service";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {PaymentstatusService} from "../../../service/supplierpayment/paymentstatus.service";
import {Paymentstatus} from "../../../entity/paymentstatus";
import {Paymenttype} from "../../../entity/paymenttype";
import {PaymenttypeService} from "../../../service/supplierpayment/paymenttype.service";
import {Grntype} from "../../../entity/grntype";
import {GrntypeService} from "../../../service/supplierpayment/grntype.service";
import {MaterialGrnService} from "../../../service/materialgrn/material-grn.service";
import {PaperGrnService} from "../../../service/papergrn/paper-grn.service";
import {SupplierpaymentService} from "../../../service/supplierpayment/supplierpayment.service";
import {Supplierpayment} from "../../../entity/supplierpayment";
import {Supplierpaymentgrn} from "../../../entity/supplierpaymentgrn";

@Component({
  selector: 'app-supplierpayment',
  templateUrl: './supplierpayment.component.html',
  styleUrls: ['./supplierpayment.component.css']
})
export class SupplierpaymentComponent implements OnInit {

  columns: string[] = ['number', 'date', 'supplier'];
  headers: string[] = ['PO Number', 'Date', 'Status'];
  binders: string[] = ['referenceNo', 'date', 'supplier.name'];
  defaultProfile = 'assets/default.png';
  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  supplierpayment!: Supplierpayment;
  oldSupplierPayments!: Supplierpayment;
  materialOrderData: any[] = [];
  filteredMaterialList: Material[] = [];
  selectedrow: any;
  supplierPayments: Supplierpayment[] = [];
  data!: MatTableDataSource<Supplierpayment>;
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

  paymentstatuses: Paymentstatus[] = [];
  paymenttypes: Paymenttype[] = [];
  grntypes: Grntype[] = [];

  materialList!: Material[];
  matchedNavItem = 'Supplier Payment';

  isInnerDataUpdated = false;
  inndata!: MaterialPorderMaterial;
  innerdata: Supplierpaymentgrn[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  smRole? = false;
  accRole? = false;
  grns: any[] = []

  constructor(
    private supplierService: SupplierService,
    private paymentstatusService: PaymentstatusService,
    private paymenttypeService: PaymenttypeService,
    private grntypeService: GrntypeService,
    private materialPorderService: MaterialPorderService,
    private materialPorderStatusService: MaterialPorderStatusService,
    private materialGrnService: MaterialGrnService,
    private paperGrnService: PaperGrnService,
    private supplierpamentService: SupplierpaymentService,
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
      "ssreferenceNo": new FormControl(),
      "ssstatus": new FormControl(),
      "ssdate": new FormControl(),
      "sssupplier": new FormControl(),
    });
    this.form = this.formBuilder.group({
      id: new FormControl(null), // number, optional
      supplier: new FormControl(null), // Supplier object, optional
      referenceNo: new FormControl('', [Validators.maxLength(20)]), // string, optional, max length 20
      date: new FormControl('', [Validators.required]), // string, required (assuming date input)
      time: new FormControl('', [Validators.required]), // string, optional, time format HH:mm
      amount: new FormControl('', [Validators.required]), // string, required, decimal format
      balance: new FormControl('', [Validators.required]), // string, optional, decimal format
      paymentStatus: new FormControl(null), // Paymentstatus, optional
      paymentType: new FormControl(null), // Paymenttype, optional
      grnType: new FormControl(null), // Grntype, optional
      grn: new FormControl(null),
      supplierPaymentGrns: this.formBuilder.array([]), // FormArray for Supplierpaymentgrn
      logger: new FormControl('', [Validators.required, Validators.maxLength(50)]) // string, required, max length 50
    }, {updateOn: 'change'});
    // this.materialForm = this.formBuilder.group({
    //   material: [null, Validators.required],
    //   quentity: [0, [Validators.required, Validators.min(1)]],
    //   expectedLineCost: [0]
    // });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    // this.form.get("grnType")?.valueChanges.subscribe(value => {
    //   this.loadGrns(value);
    // })

  }


  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.createForm();
    this.getNextCode();
    // this.regexService.get('materialporder').subscribe((regs: []) => {
    //   console.log(regs)
    //   this.regexes = regs;
    //   this.createForm();
    // });
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
            this.form.get("materialPorderStatus")?.setValue(this.materialPorderStatuses.find(m => m.id == 1))
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

    this.paymentstatusService.getAllList().subscribe(response => {
      this.paymentstatuses = response;
    });

    this.paymenttypeService.getAllList().subscribe(response => {
      this.paymenttypes = response;
    });

    this.grntypeService.getAllList().subscribe(response => {
      this.grntypes = response;
    });
    this.form.get("date")?.setValue(this.today)

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.form.get("logger")?.setValue(this.authService.getUsername());

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


          if (controlName == "doRegisterd")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldSupplierPayments != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplierPayments[controlName]) {
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

    this.supplierpamentService.getAll(query).subscribe({
      next: (sps: Supplierpayment[]) => {
        this.supplierPayments = sps;
        this.data = new MatTableDataSource(this.supplierPayments);
        this.data.paginator = this.paginator;
      }, error: (error) => {
        console.log(error);
      }
    });

  }


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    const number = sserchdata.ssreferenceNo;
    const date = sserchdata.ssdate;
    const mpstatusid = sserchdata.ssstatus;
    const supplier = sserchdata.sssupplier;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&referenceno=" + number;
    if (date != null && date.trim() != "") query = query + "&date=" + date;
    if (mpstatusid != null) query = query + "&paymentstatus=" + mpstatusid;
    if (supplier != null) query = query + "&supplier=" + supplier;

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

      this.supplierpayment = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.supplierpayment.supplierPaymentGrns = this.innerdata
      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.supplierpayment.referenceNo;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Material Purchase Order Add",
          message: "Are you sure to Add the following Material Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.supplierpamentService.add(this.supplierpayment).subscribe({
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


  fillForm(supplierPayment: Supplierpayment) {

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = supplierPayment;

    this.supplierpayment = JSON.parse(JSON.stringify(supplierPayment));
    this.oldSupplierPayments = JSON.parse(JSON.stringify(supplierPayment));


    this.supplierpayment.paymentStatus = this.paymentstatuses.find(s => s.id === this.supplierpayment.paymentStatus?.id);
    this.supplierpayment.supplier = this.suppliers.find(s => s.id === this.supplierpayment.supplier?.id);
    this.supplierpayment.paymentType = this.paymenttypes.find(s => s.id === this.supplierpayment.paymentType?.id);
    this.supplierpayment.grnType= this.grntypes.find(s => s.id === this.supplierpayment.grnType?.id);

this.supplierpayment.supplierPaymentGrns?.forEach(value => {

  if (value.materialGrn){
    this.grns.push(value.materialGrn)
    this.form.patchValue({
      grn:value.materialGrn
    })
  }

  if (value.paperGrn){
    this.grns.push(value.paperGrn)
    this.form.patchValue({
      grn:value.paperGrn
    })
  }

})

    this.form.patchValue(this.supplierpayment);
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
            this.supplierpayment = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.supplierpayment.supplierPaymentGrns = this.innerdata

            this.supplierpayment.id = this.oldSupplierPayments.id;
            this.supplierpamentService.update(this.supplierpayment).subscribe({
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
        message: "Are you sure to Delete following Material Purchase Order? <br> <br>" + this.supplierpayment.referenceNo
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result && this.supplierpayment.id) {
        this.supplierpamentService.delete(this.supplierpayment.id).subscribe({
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
        this.initialize()

      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.clearInnerTable();
    this.innerdata = [];
    this.grns = [];
    this.form.controls['description'].markAsPristine();
    this.smRole = false
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

  getNextCode() {

    this.supplierpamentService.getNextCode().subscribe(code => {
      this.form.controls["referenceNo"].setValue(code.code);
    });
  }

  get toscheduledControl() {
    return this.form.get('time');
  }

  loadGrns(value: any) {
    if (value.value.id == 2) {
      this.materialGrnService.getAllList().subscribe(response => {
        this.grns = response
      })

    } else if (value.value.id == 1) {
      this.paperGrnService.getAllList().subscribe(response => {
        this.grns = response;
      })
    }
  }


  setGrns(value: any) {
    const grnType = value.code.split("-")[0];

    if (grnType == "PGRN") {
      const paper = value || null;
      const material = null;
      const newEntry = new Supplierpaymentgrn(paper, material);
      this.innerdata.push(newEntry);
    } else if (grnType == "MGRN") {
      const paper = null;
      const material = value || null;
      const newEntry = new Supplierpaymentgrn(paper, material);
      this.innerdata.push(newEntry);
    }
  }

}
