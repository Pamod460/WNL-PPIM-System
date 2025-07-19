import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AgentOrder} from "../../../entity/agentOrder";
import {Product} from "../../../entity/Product";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {District} from "../../../entity/District";
import {AgentOrderStatus} from "../../../entity/agentOrderStatus";
import {AgentOrderProduct} from "../../../entity/agentorderproduct";
import {AgentorderService} from "../../../service/agentorder/agentorder.service";
import {AgentorderstatusService} from "../../../service/agentorder/agentorderstatus.service";
import {ProductService} from "../../../service/product/product.service";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {Distribution} from "../../../entity/distribution";
import {DistributionStatus} from "../../../entity/distributionstatus";
import {DistributionService} from "../../../service/distribution/distribution.service";
import {DistributionStatusService} from "../../../service/distribution/distributionstatus.service";
import {Productdesign} from "../../../entity/productdesign";
import {ProductdesignService} from "../../../service/productdesign/productdesign.service";

@Component({
  selector: 'app-distribution',
  templateUrl: './distribution.component.html',
  styleUrls: ['./distribution.component.css']
})
export class DistributionComponent implements OnInit {

  columns: string[] = ['distributionNumber', 'date', 'distributionStatus'];
  headers: string[] = ['Distribution Number', 'Date', 'Status'];
  binders: string[] = ['distributionNumber', 'date', 'distributionStatus.name'];
  defaultProfile = 'assets/default.png';
  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;
  disableModify = false;
  disableGenerateNo = false;
  distribution!: Distribution;
  oldDistribution!: Distribution;
  productOrderData: any[] = [];
  filteredProductList: Product[] = [];
  selectedrow: any;
  distributions: Distribution[] = [];
  data!: MatTableDataSource<Distribution>;
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
  distributionStatuses: DistributionStatus[] = [];
  productList!: Product[];

  productForm: FormGroup
  isInnerDataUpdated = false;
  inndata!: AgentOrderProduct;
  innerdata: AgentOrderProduct[] = [];
  id: number = 0;
  protected readonly document = document;
  grandTotal = 0
  smRole? = false;
  accRole? = false;
  agentOrders: AgentOrder[] = [];
  productDesignList!: Productdesign[];
  filteredProductDesignList: Productdesign[] = [];

  constructor(
    private agentOrderService: AgentorderService,
    private agentOrderStatusService: AgentorderstatusService,
    private distributionService: DistributionService,
    private distributionStatusService: DistributionStatusService,
    private productDesignService: ProductdesignService,
    private productService: ProductService,
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
      distributionNumber: new FormControl('', [Validators.maxLength(20)]),
      distributionStatus: new FormControl(null),
      agentOrder: new FormControl(null, [Validators.required]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl(null),
      logger: new FormControl('', [Validators.required]),
      grandTotal: new FormControl(null),
      description: new FormControl(''),
      agentOrderProducts: this.formBuilder.array([]),
    }, {updateOn: 'change'});
    this.productForm = this.formBuilder.group({
      product: [null, Validators.required],
      productDesign: [null],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineTotal: [0]
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago

    this.productForm.get("quantity")?.valueChanges.subscribe(values => {

      this.updatePrices(values)
    })
    this.form.get("logger")?.setValue(this.authService.getUsername());

    this.form.get("agentOrderStatus")?.disable()


  }

  updatePrices(values: number) {

    const unitPrice = this.productForm.get("product")?.value.unitPrice
    const lineTotal = unitPrice * values
    this.productForm.get("lineTotal")?.setValue(lineTotal)

  }

  addToTable() {
    this.inndata = this.productForm.getRawValue();
    console.log(this.inndata.quantity)
    // Validate product input
    if (!this.inndata.product || this.inndata.quantity == 0) {
      this.showMessageDialog("Errors - Product POrder Add", "Please Add Required Details");
      return;
    }

    const quantity = this.inndata.quantity || 0;
    const unitPrice = this.inndata.product?.unitPrice || 0;
    const lineTotal = quantity * unitPrice;
    this.grandTotal += lineTotal
    this.form.get("grandTotal")?.setValue(this.grandTotal);
    console.log(this.inndata.productDesign)
    const newEntry = new AgentOrderProduct(
      this.id,
      this.inndata.product,
      this.inndata.productDesign,
      quantity,
      lineTotal
    );

    // Clone and repopulate innerdata
    const updatedData: AgentOrderProduct[] = this.innerdata ? [...this.innerdata] : [];

    const isDuplicate = updatedData.some(item => item.product?.id === newEntry.product?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Product POrder Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedProductId = newEntry.product?.id;
      const removeIndex = this.filteredProductList.findIndex(e => e.id === addedProductId);
      if (removeIndex > -1) {
        this.filteredProductList.splice(removeIndex, 1);
      }
      this.innerdata = updatedData;
      this.id++;
      this.isInnerDataUpdated = true;
      this.resetProductForm();
    }
  }

  private showMessageDialog(heading: string, message: string): void {
    const dialogRef = this.matDialog.open(MessageComponent, {
      width: '400px',
      data: {heading, message}
    });

    dialogRef.afterClosed().subscribe(); // Just to keep the observable chain alive
  }

  private resetProductForm(): void {
    this.productForm.reset();
    for (const controlName in this.productForm.controls) {
      const control = this.productForm.controls[controlName];
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  deleteRow(x: AgentOrderProduct): void {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Product POrder",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.innerdata.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const product = this.innerdata[indexToDelete]?.product;

        // Re-add the product to the filtered list if not already present
        if (product?.id) {
          const existingProduct = this.productList.find(e => e.id === product.id);
          const isAlreadyInFiltered = this.filteredProductList.some(e => e.id === product.id);

          if (existingProduct && !isAlreadyInFiltered) {
            this.filteredProductList.push(existingProduct);
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

    // this.regexService.get('agentOrder').subscribe((regs: []) => {
    //   console.log(regs)
    //   this.regexes = regs;
    this.createForm();
    // });
    this.productService.getAll("").subscribe({
      next: (products: Product[]) => {
        this.productList = products;
        this.filteredProductList = this.productList;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.productDesignService.getAllListNameId().subscribe(response=>{
      this.productDesignList = response;

    })
    this.distributionStatusService.getAllList().subscribe(
      {
        next:
          (statuses: AgentOrderStatus[]) => {
            this.distributionStatuses = statuses;
            this.form.get("agentOrderStatus")?.setValue(this.distributionStatuses.find(m => m.id == 1))
          }, error: (error: any) => {
          console.error('Error fetching Product POrder  statuses:', error);
        }
      }
    )
    this.agentOrderService.getAllListNameId().subscribe({
      next:
        (agentOrders: AgentOrder[]) => {
          this.agentOrders = agentOrders;
        }, error: (error: any) => {
        console.error('Error fetching Product POrder  statuses:', error);
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

  get products(): FormArray {
    return this.form.get('agentOrderProducts') as FormArray;
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


          if (this.oldDistribution != undefined && control.valid) {
            // @ts-ignore
            if (value === this.distribution[controlName]) {
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

    this.hasInsertAuthority = authorities.some(authority => authority.module === 'distribution' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'distribution' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'distribution' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.distributionService.getAll(query).subscribe({
      next: (distributions: Distribution[]) => {
        this.distributions = distributions;
        this.data = new MatTableDataSource(this.distributions);
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
          heading: "Errors - Product Purchase Order Add ",
          message: "You have the following Errors <br> " + errors
        }
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.distribution = this.form.getRawValue();
      // @ts-ignore
      this.innerdata.forEach((i) => delete i.id);
      this.distribution.distributionProducts = this.innerdata
      let mpdata = "";

      mpdata = mpdata + "<br>Number is : " + this.distribution.distributionNumber;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Product Purchase Order Add",
          message: "Are you sure to Add the following Product Purchase Order? <br> <br>" + mpdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.distributionService.add(this.distribution).subscribe({
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


  fillForm(agentOrder: AgentOrder) {


    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = agentOrder;

    this.distribution = JSON.parse(JSON.stringify(agentOrder));
    this.oldDistribution = JSON.parse(JSON.stringify(agentOrder));
    this.innerdata = this.distribution.distributionProducts ? this.distribution.distributionProducts : []

    this.distribution.distributionStatus = this.distributionStatuses.find(s => s.id === this.distribution.distributionStatus?.id);
    this.distribution.agentOrder = this.agentOrders.find(s => s.id === this.distribution.agentOrder?.id);


    this.form.patchValue(this.distribution);
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
      updates += "<br> Product Quantity Changed"
    }
    return updates;
  }

  update() {

    const errors = this.getErrors(['photo', 'land', 'description']);

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product POrder Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Product POrder Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("AgentOrderService.update()");
            this.distribution = this.form.getRawValue();
            // @ts-ignore
            this.innerdata.forEach((i) => delete i.id);
            this.distribution.distributionProducts = this.innerdata

            this.distribution.id = this.oldDistribution.id;
            this.distributionService.update(this.distribution).subscribe({
              next: (response: { message: string | undefined; }) => {
                this.toastrService.success(response.message).onShown.subscribe(() => {
                  this.disableGenerateNo = false;
                  this.loadTable("");
                  this.resetForm()
                })
              }, error: (error: { error: { data: { message: string | undefined; }; }; }) => {
                this.toastrService.error(error.error.data.message)
              }
            });
          }
        });
      } else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product POrder Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Product Purchase Order? <br> <br>" + this.distribution.distributionNumber
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.agentOrderService.delete(this.distribution.id).subscribe({
          next: (response: { message: string | undefined; }) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.disableGenerateNo = false;
              this.loadTable("");
              this.resetForm()
            })
          }, error: (error: { error: { message: string | undefined; }; }) => {
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
        heading: "Confirmation - AgentOrder Clear",
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

  get timeControl() {
    return this.form.get('time');
  }

  getNextCode() {

    this.distributionService.getNextCode().subscribe((code: { code: any; }) => {
      this.form.controls["distributionNumber"].setValue(code.code);
    });
  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

  flterProductDesign(event: any) {
    this.filteredProductDesignList=this.productDesignList.filter(value => value.product.id==event.id)

  }
}
