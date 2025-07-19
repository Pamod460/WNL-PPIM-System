import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Material} from "../../../entity/Material";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";
import {MaterialPorderStatus} from "../../../entity/MaterialPorderStatus";
import {Supplier} from "../../../entity/Supplier";
import {Paymentstatus} from "../../../entity/paymentstatus";
import {Paymenttype} from "../../../entity/paymenttype";
import {Grntype} from "../../../entity/grntype";
import {MaterialPorderMaterial} from "../../../entity/MaterialPorderMaterial";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Distribution} from "../../../entity/distribution";
import {Bank} from "../../../entity/bank";
import {CheqStatus} from "../../../entity/cheqstatus";
import {AgentPayment} from "../../../entity/agentpayment";
import {AgentPaymentService} from "../../../service/agentpayment/agentpayment.service";
import {BankService} from "../../../service/agentpayment/bank.service";
import {CheqstatusService} from "../../../service/agentpayment/cheqstatus.service";
import {DistributionService} from "../../../service/distribution/distribution.service";
import {AgentpaymenttypeService} from "../../../service/agentpayment/agentpaymenttype.service";
import {PaymentstatusService} from "../../../service/supplierpayment/paymentstatus.service";

@Component({
  selector: 'app-agentpayment',
  templateUrl: './agentpayment.component.html',
  styleUrls: ['./agentpayment.component.css']
})
export class AgentpaymentComponent implements OnInit {

  columns: string[] = ['agent', 'distribution', 'paymentStatus'];
  headers: string[] = ['Agent', 'Distribution', 'Status'];
  binders: string[] = ['distribution.agentOrder.agent.fullName', 'distribution.distributionNumber', 'paymentStatus.name'];
  defaultProfile = 'assets/default.png';
  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  agentPayment!: AgentPayment;
  oldAgentPayment!: AgentPayment;
  materialOrderData: any[] = [];
  filteredMaterialList: Material[] = [];
  selectedrow: any;
  agentPaments: AgentPayment[] = [];
  data!: MatTableDataSource<AgentPayment>;
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
  matchedNavItem = 'Agent Payment';
  checkPaymentForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: MaterialPorderMaterial;
  innerdata: MaterialPorderMaterial[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  smRole? = false;
  accRole? = false;
  distributions: Distribution[] = []
  banks: Bank[] = [];
  isChequePayment = false;
  cheqStatus: CheqStatus[] = [];

  constructor(
    private agentPaymentService: AgentPaymentService,
    private bankService: BankService,
    private cheqStatusService: CheqstatusService,
    private diatributionService: DistributionService,
    private agentPaymentTypeService: AgentpaymenttypeService,
    private paymentstatusService: PaymentstatusService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private datePipe: DatePipe,
    public authService: AuthorizationManager,
    private toastrService: ToastrService,
    private tableUtils: TableUtilsService
  ) {
    this.uiassist = new UiAssist(this);
    this.ssearch = this.formBuilder.group({
      ssponumber: new FormControl(),
      ssstatus: new FormControl(),
      ssdate: new FormControl(),
    });
    this.form = this.formBuilder.group({
      distribution: [null, Validators.required],
      date: ['', Validators.required],
      amount: ['', Validators.required],
      paymentStatus: [null],
      agentPaymentType: [null],
      description: [null],
      logger: [null]
    }, {updateOn: 'change'});
    this.checkPaymentForm = this.formBuilder.group({
      cheqNumber: ['', [Validators.maxLength(20)]],
      dorealized: [''],
      bank: [null],
      cheqStatus: [null],
      description: [''],
    });


    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago



  }


  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.createForm();
    this.getNextCode();

    this.cheqStatusService.getAllList().subscribe(response => {
      this.cheqStatus = response;
    })
    this.bankService.getAllList().subscribe(response => {
      this.banks = response;
    })
    this.diatributionService.getAll("").subscribe(response => {
      this.distributions = response;
    })

    this.agentPaymentTypeService.getAllList().subscribe(response => {
      this.paymenttypes = response;
    })
    this.paymentstatusService.getAllList().subscribe(response => {
      this.paymentstatuses = response;
    })
    this.form.get("date")?.setValue(this.today)

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.form.get("logger")?.setValue(this.authService.getUsername());

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


          if (this.oldAgentPayment != undefined && control.valid) {
            // @ts-ignore
            if (value === this.agentPayment[controlName]) {
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

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'agent payment' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'agent payment' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'agent payment' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.agentPaymentService.getAll(query).subscribe({
      next: (emps: AgentPayment[]) => {
        this.agentPaments = emps;
        this.data = new MatTableDataSource(this.agentPaments);
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
          heading: "Errors - Agent Payment Order Add ",
          message: "You have the following Errors <br> " + errors
        }
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.agentPayment = this.form.getRawValue();
      // // @ts-ignore
      // this.innerdata.forEach((i) => delete i.id);
      const checkPayment = this.checkPaymentForm.getRawValue();


      this.agentPayment.cheqPayments = [checkPayment]

      let mpdata = "";

      // mpdata = mpdata + "<br>Agent is : " + this.agentPayment.distribution?.agentOrder?.agent?.fullName;
      mpdata = mpdata + "<br>Distribution is : " + this.agentPayment.distribution?.distributionNumber;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Agent Payment Order Add",
          message: "Are you sure to Add the following Agent Payment Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.agentPaymentService.add(this.agentPayment).subscribe({
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


  fillForm(agentPayment: AgentPayment) {

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = agentPayment;

    this.agentPayment = JSON.parse(JSON.stringify(agentPayment));
    this.oldAgentPayment = JSON.parse(JSON.stringify(agentPayment));
    this.agentPayment.distribution=this.distributions.find(d => d.id === this.agentPayment.distribution?.id);
    this.agentPayment.agentPaymentType = this.paymenttypes.find(pt => pt.id === this.agentPayment.agentPaymentType?.id);
    this.agentPayment.paymentStatus = this.paymentstatuses.find(pt => pt.id === this.agentPayment.paymentStatus?.id);
    this.agentPayment.agentPaymentType = this.paymenttypes.find(pt => pt.id === this.agentPayment.agentPaymentType?.id);

    if (this.agentPayment.cheqPayments && this.agentPayment.cheqPayments.length > 0) {
      this.isChequePayment =true
      // @ts-ignore
      this.agentPayment.cheqPayments[0].bank = this.banks.find(b => b.id === this.agentPayment.cheqPayments[0]?.bank?.id);
      // @ts-ignore
      this.agentPayment.cheqPayments[0].cheqStatus = this.cheqStatus.find(b => b.id === this.agentPayment.cheqPayments[0]?.cheqStatus?.id);
      this.checkPaymentForm.patchValue(this.agentPayment.cheqPayments[0]);
    }

    console.log(this.agentPayment)
    this.form.patchValue(this.agentPayment);
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
        data: {heading: "Errors - Agent Payment Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Agent Payment Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("MaterialPorderService.update()");
            this.agentPayment = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            // this.agentPayment.materialPorderMaterials = this.innerdataw

            this.agentPayment.id = this.oldAgentPayment.id;
            this.agentPaymentService.update(this.agentPayment).subscribe({
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
          data: {heading: "Confirmation - Agent Payment Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Agent Payment Belongs To? <br> <br>" + this.agentPayment.distribution?.agentOrder?.agent?.fullName
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.agentPaymentService.delete(this.agentPayment.id).subscribe({
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
    this.clearInnerTable()
    this.form.controls['description'].markAsPristine();
    this.isChequePayment =false
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

    // this.supplierpamentService.getNextCode().subscribe(code => {
    //   this.form.controls["referenceNo"].setValue(code.code);
    // });
  }


  checkPaymentType(value: any) {

    this.isChequePayment =value.name =="Cheque"


  }
}

