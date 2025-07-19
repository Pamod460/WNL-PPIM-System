import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Route} from "../../../entity/Route";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Operation} from "../../../entity/operation";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Productionorderstatus} from "../../../entity/productionorderstatus";
import {ProductionorderstatusService} from "../../../service/productionorder/productionorderstatus.service";
import {Productdesign} from "../../../entity/productdesign";
import {ProductdesignService} from "../../../service/productdesign/productdesign.service";
import {ProductionorderService} from "../../../service/productionorder/productionorder.service";
import {Productionorder} from "../../../entity/productionorder";
import {ProductService} from "../../../service/product/product.service";
import {Product} from "../../../entity/Product";

@Component({
  selector: 'app-productionorder',
  templateUrl: './productionorder.component.html',
  styleUrls: ['./productionorder.component.css']
})
export class ProductionorderComponent implements OnInit {

  form!: FormGroup;
  ssearch!: FormGroup;

  productionorders!: Productionorder[];

  productionorder!: Productionorder;
  oldproductionorder!: Productionorder;

  columns: string[] = ['orderNo', 'quantity', 'expectedDate','productionOrderStatus'];
  headers: string[] = ['Order Number', 'Quantity', 'Expected Date', 'Status'];
  binders: string[] = ['orderNo', 'quantity', 'expectedDate','productionOrderStatus.name'];


  data!: MatTableDataSource<Productionorder>
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

  productionorderstatuses: Productionorderstatus[]=[];
  productdesigns: Productdesign[] = [];
  products: Product[] = [];
  navItem="Production Order";

  constructor(
    private formBuilder: FormBuilder,
    private productionorderstatusService: ProductionorderstatusService,
    private productdesignService: ProductdesignService,
    private productionorderService: ProductionorderService,
    private productService: ProductService,
    private matDialog: MatDialog,
    public authService: AuthorizationManager,
    private toastrService: ToastrService
  ) {

    this.uiassist = new UiAssist(this);


    this.form = this.formBuilder.group({
      orderNo: new FormControl('', Validators.required),
      quantity: new FormControl('', Validators.required),
      createdDate: new FormControl('', Validators.required),
      createdTime: new FormControl('', Validators.required),
      expectedDate: new FormControl('', Validators.required),
      expectedTime: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      productDesign: new FormControl('', Validators.required),
      productionOrderStatus: new FormControl('', Validators.required),
      logger: new FormControl('', Validators.required)
    });
    this.form.get("logger")?.setValue(this.authService.getUsername());


    this.ssearch = this.formBuilder.group({
      "orderno": new FormControl(),
      "createddate": new FormControl(),
      "expecteddate": new FormControl(),
      "productionOrderStatus": new FormControl(),
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.productionorderstatusService.getAll().subscribe((statuses:  Productionorderstatus[]) => {
      this.productionorderstatuses = statuses;
    });

    this.productdesignService.getAll('').subscribe((productdesigns:  Productdesign[]) => {
      this.productdesigns = productdesigns;
    });

    this.productService.getAll('').subscribe( response =>{
      this.products = response;
    });

    this.productionorderService.getNextProductionOrderCode().subscribe(res =>{
      this.form.get('orderNo')?.setValue(res.code);
    });

    this.createForm();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createForm() {


    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {

          if (this.oldproductionorder != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.productionorder[controlName]) {
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
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'production order' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'production order' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'production order' && authority.operation === 'delete');

  }

  createView() {
    this.loadTable("");
  }

  loadTable(query: string): void {
    this.productionorderService.getAll(query).subscribe((orders: Productionorder[]) => {
      this.productionorders = orders;
      this.data = new MatTableDataSource(this.productionorders);
      this.data.paginator = this.paginator;
    });

  }


  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    const orderno = sserchdata.orderno;
    const createddate = sserchdata.createddate;
    const expecteddate = sserchdata.expecteddate;
    const productionOrderStatus = sserchdata.productionOrderStatus;

    let query = "";

    if (orderno != null) query = query + "&orderno=" + orderno;
    if (createddate != null) query = query + "&createddate=" + createddate;
    if (expecteddate != null) query = query + "&expecteddate=" + expecteddate;
    if (productionOrderStatus != null) query = query + "&productionOrderStatus=" + productionOrderStatus;

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
        data: {heading: "Errors - Production Order Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.productionorder = this.form.getRawValue();

      let prvdata = "";

      prvdata = prvdata + "<br>Production Order No is : " + this.productionorder.orderNo

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Production Order Add",
          message: "Are you sure to Add the following Production Order? <br> <br>" + prvdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.productionorderService.add(this.productionorder).subscribe({
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

    this.productionorder = JSON.parse(JSON.stringify(route));
    this.oldproductionorder = JSON.parse(JSON.stringify(route));

    // @ts-ignore
    this.productionorder.productDesign = this.productdesigns.find(d => d.id === this.productionorder.productDesign.id);
    // @ts-ignore
    this.productionorder.productionOrderStatus = this.productionorderstatuses.find(s => s.id === this.productionorder.productionOrderStatus.id);

    this.form.patchValue(this.productionorder);
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
        data: {heading: "Errors - Production Order Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Confirmation - Production Order Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.productionorder = this.form.getRawValue();

            this.productionorder.id = this.oldproductionorder.id;
            this.productionorderService.update(this.productionorder).subscribe({
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
          data: {heading: "Confirmation - Production Order Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Production Order Delete",
        message: "Are you sure to Delete following Production Order? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.productionorderService.delete(this.productionorder.id).subscribe({
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
        heading: "Confirmation - Production Order Clear",
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

  get toscheduledControl() {
    return this.form.get('createdTime');
  }

  onProductChange(value: any) {
    this.productdesigns = this.productdesigns.filter(des => des.product.id === value.id);
  }
}
