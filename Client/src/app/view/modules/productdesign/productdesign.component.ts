import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Operation} from "../../../entity/operation";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Product} from "../../../entity/Product";
import {ProductService} from "../../../service/product/product.service";
import {FileUploadControl, FileUploadValidators} from "@iplab/ngx-file-upload";
import {Productdesignstatus} from "../../../entity/productdesignstatus";
import {ProductdesignstatusService} from "../../../service/productdesign/productdesignstatus.service";
import {ProductdesignService} from "../../../service/productdesign/productdesign.service";
import {Productdesign} from "../../../entity/productdesign";

@Component({
  selector: 'app-productdesign',
  templateUrl: './productdesign.component.html',
  styleUrls: ['./productdesign.component.css']
})
export class ProductdesignComponent implements OnInit {

  form!: FormGroup;
  ssearch!: FormGroup;

  productdesigns!: Productdesign[];

  productdesign!: Productdesign;
  oldproductdesign!: Productdesign;

  columns: string[] = ['product', 'name', 'date', 'productDesignStatus'];
  headers: string[] = ['Product Name', 'Batch Number', 'Date', 'Product Design Status'];
  binders: string[] = ['product.name', 'name', 'date', 'productDesignStatus.name'];


  data!: MatTableDataSource<Productdesign>
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

  products: Product[] = [];
  productdesignstatuses: Productdesignstatus[] = [];
  fileUploadControl: FileUploadControl;
  skipFileUploadChange = false;
  navItem = "Product Design";

  constructor(
    private productService: ProductService,
    private productdesignService: ProductdesignService,
    private productdesignstatusService: ProductdesignstatusService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    public authService: AuthorizationManager,
    private toastrService: ToastrService
  ) {

    this.uiassist = new UiAssist(this);

    this.form = this.formBuilder.group({
      product: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      productDesignStatus: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      images: new FormControl(null),
      designDocument: new FormControl(null),
      logger: new FormControl('', Validators.required)
    });
    this.form.get("logger")?.setValue(this.authService.getUsername());

    this.fileUploadControl = new FileUploadControl({
      listVisible: true,
    });
    this.fileUploadControl.setValidators([FileUploadValidators.filesLimit(1)]);
    this.fileUploadControl.valueChanges.subscribe((files: File[] | null) => {
      const control = this.form.controls['designDocument'];

      if (this.skipFileUploadChange) {
        this.skipFileUploadChange = false;
        return; // Skip programmatic change event
      }

      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64DataUrl = e.target.result; // full data URL: data:application/pdf;base64,...
          const base64Data = base64DataUrl.split(',')[1]; // extract raw base64

          if (control.value !== base64Data) {
            control.setValue(base64Data);
            control.markAsDirty();
          }
        };

        reader.readAsDataURL(file);
      } else {
        if (control.value !== null) {
          control.setValue(null);
          control.markAsDirty();
        }
      }
    });
    this.ssearch = this.formBuilder.group({
      "product": new FormControl(),
      "name": new FormControl(),
      "date": new FormControl(),
      "productDesignStatus": new FormControl()
    });

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.productService.getAll('').subscribe((Products: Product[]) => {
      this.products = Products;
    });

    this.productdesignstatusService.getAll().subscribe((Productdesignstatuses: Productdesignstatus[]) => {
      this.productdesignstatuses = Productdesignstatuses;
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

          if (this.oldproductdesign != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.productdesign[controlName]) {
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
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'product design' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'product design' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'product design' && authority.operation === 'delete');

  }

  createView() {
    this.loadTable("");
  }

  loadTable(query: string): void {
    this.productdesignService.getAll(query).subscribe((productdesigns: Productdesign[]) => {
      this.productdesigns = productdesigns;
      this.data = new MatTableDataSource(this.productdesigns);
      this.data.paginator = this.paginator;
    });

  }

  onPhotoChanged(files: File[]) {
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64String = dataUrl.split(',')[1];

      if (this.form.get("images")?.value !== base64String) {
        this.form.get("images")?.setValue(base64String);
        this.form.get("images")?.markAsDirty();
      }
    };
    reader.readAsDataURL(files[0]);
  }

  onPhotoRemoved(fileId: string) {
    this.form.get("images")?.setValue(null);
    if (this.form.get("photo")?.value != this.oldproductdesign.images) {
      this.form.get("images")?.markAsDirty();
    } else {
      this.form.get("images")?.markAsPristine();
    }
  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();

    const product = sserchdata.product;
    const name = sserchdata.name;
    const date = sserchdata.date;
    const productDesignStatus = sserchdata.productDesignStatus;

    let query = "";

    if (product != null) query = query + "&product=" + product;
    if (name != null) query = query + "&name=" + name;
    if (date != null) query = query + "&date=" + date;
    if (productDesignStatus != null) query = query + "&productDesignStatus=" + productDesignStatus;

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
        data: {heading: "Errors - Product Design Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.productdesign = this.form.getRawValue();
      let prvdata = "";

      prvdata = prvdata + "<br>Product is : " + this.productdesign.product.name
      prvdata = prvdata + "<br>Name is : " + this.productdesign.name;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Product Design Add",
          message: "Are you sure to Add the following Product Design? <br> <br>" + prvdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.productdesignService.add(this.productdesign).subscribe({
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

  fillForm(productdesign: Productdesign) {

    this.enableButtons(false, true, true);

    this.selectedrow = productdesign;

    this.productdesign = JSON.parse(JSON.stringify(productdesign));
    this.oldproductdesign = JSON.parse(JSON.stringify(productdesign));

    // @ts-ignore
    this.productdesign.product = this.products.find(p => p.id === this.productdesign.product.id);
    // @ts-ignore
    this.productdesign.productDesignStatus = this.productdesignstatuses.find(s => s.id === this.productdesign.productDesignStatus.id);
    if ( this.productdesign.designDocument) {
      const base64 = this.productdesign.designDocument; // base64 string without prefix
      const base64WithPrefix = `data:application/pdf;base64,${base64}`;

      const byteCharacters = atob(this.productdesign.designDocument);
      const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const file = new File([byteArray], "filename.pdf", {type: "application/pdf"}); // Adjust filename/type as needed

      // 👇 Temporarily skip listener
      this.skipFileUploadChange = true;
      this.fileUploadControl.setValue([file]);

      this.form.controls['designDocument'].setValue(base64WithPrefix);
      this.form.controls['designDocument'].markAsPristine();
    }

    this.form.patchValue(this.productdesign);
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
        data: {heading: "Errors - Product Design Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Confirmation - Product Design Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.productdesign = this.form.getRawValue();

            this.productdesign.id = this.oldproductdesign.id;
            this.productdesignService.update(this.productdesign).subscribe({
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
          data: {heading: "Confirmation - Product Design Update", message: "Nothing Changed"}
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
        heading: "Confirmation - Route Delete",
        message: "Are you sure to Delete folowing Product Design? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.productdesignService.delete(this.productdesign.id).subscribe({
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

  previewPDF() {
    const base64 = this.form.controls['designDocument'].value;
    const byteCharacters = atob(base64.split(',')[1] || base64); // Strip off "data:application/pdf;base64," if present
    const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {type: 'application/pdf'});
    const fileURL = URL.createObjectURL(blob);
    window.open(fileURL, '_blank'); // Open in new tab
  }
}
