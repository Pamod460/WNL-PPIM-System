import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MaterialSubcategory} from "../../../entity/MaterialSubcategory";
import {Unittype} from "../../../entity/Unittype";
import {UiAssist} from "../../../util/ui/ui.assist";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ProductService} from "../../../service/product/product.service";
import {Product} from "../../../entity/Product";
import {ProductCategory} from "../../../entity/ProductCategory";
import {ProductFrequency} from "../../../entity/ProductFrequency";
import {ProductMaterial} from "../../../entity/ProductMaterial";
import {MaterialService} from "../../../service/material/material.service";
import {ProductStatusService} from "../../../service/product/product-status.service";
import {ProductCategoryService} from "../../../service/product/product-category.service";
import {ProductFrequencyService} from "../../../service/product/product-frequency.service";
import {ProductStatus} from "../../../entity/ProductStatus";
import {Material} from "../../../entity/Material";
import {PaperService} from "../../../service/Paper/paper.service";
import {Paper} from "../../../entity/Paper";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  columns: string[] = ['name', 'code', 'quantity', 'unitprice', 'productStatus', 'productfrequency', 'productCategory'];
  headers: string[] = ['Name', 'Code', 'Quantity', 'Unit Price', 'Status', 'Frequency', 'Category'];
  binders: string[] = ['name', 'code', 'quantity', 'unitprice', 'productStatus.name', 'productfrequency.frequency', 'productCategory.name'];

  defaultProfile = 'assets/defaultimg.png';
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify = false;
  disableGenerateNo = false;

  product!: Product;
  oldProduct!: Product;

  selectedrow: any;
  data!: MatTableDataSource<Product>;
  imageurl = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl = 'assets/defaultImg.png';

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;

  productStatuses: ProductStatus[] = [];
  protected readonly document = document;
  materialSubcategories: MaterialSubcategory[] = [];
  unitTypes: Unittype[] = [];


  regexes: any;

  uiassist: UiAssist;

  minDate: Date;
  maxDate: Date;

  today: Date = new Date();
  productFrequencies: ProductFrequency[] = [];
  productmaterials: ProductMaterial[] = [];
  productCategories: ProductCategory[] = [];
  paperList: Paper[] = [];
  lastProductCode = '';
  materialList!: Material[];
  compareMaterials = (a: any, b: any) => a && b && a.id === b.id;
  comparePapers= (a: any, b: any) => a && b && a.id === b.id;


  constructor(
    private productService: ProductService,
    private productStatusService: ProductStatusService,
    private productCategoryService: ProductCategoryService,
    private productFrequencyService: ProductFrequencyService,
    private materialService: MaterialService,
    private paperService: PaperService,
    private regexService: RegexService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private dp: DatePipe,
    public authService: AuthorizationManager,
    private toastr: ToastrService,
    private tableUtils: TableUtilsService
  ) {


    this.uiassist = new UiAssist(this);

    this.ssearch = this.formBuilder.group({
      "code": new FormControl(),
      "name": new FormControl(),
      "materialsubcategory": new FormControl(),
      "materialstatus": new FormControl(),
    });
    this.form = this.formBuilder.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      dointroduced: new FormControl('', [Validators.required]),
      unitprice: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      photo: new FormControl(''),
      logger: new FormControl(''),
      productStatus: new FormControl(null, [Validators.required]),
      productCategory: new FormControl(null, [Validators.required]),
      productfrequency: new FormControl(null, [Validators.required]),
      productMaterials: this.formBuilder.array([]),
      productPapers: this.formBuilder.array([]),
    });


    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
    this.form.get("logger")?.setValue(this.authService.getUsername());
  }

  createMaterialForm(): FormGroup {
    const materialForm = this.formBuilder.group({
      material: [null],     // Assumes full Material object
      quantity: [1],
      lineCost: [0]
    });

    // Helper function to calculate and update lineCost
    const updateLineCost = () => {
      const selectedMaterial: any = materialForm.get('material')?.value;
      const quantity: number = materialForm.get('quantity')?.value ?? 0;

      if (selectedMaterial?.unitprice != null) {
        const cost = selectedMaterial.unitprice * quantity;
        materialForm.get('lineCost')?.setValue(cost, {emitEvent: false});
      } else {
        materialForm.get('lineCost')?.setValue(0, {emitEvent: false});
      }
    };

    // Subscribe to both value changes
    materialForm.get('quantity')?.valueChanges.subscribe(updateLineCost);
    materialForm.get('material')?.valueChanges.subscribe(updateLineCost);

    return materialForm;
  }


  createPaperForm(): FormGroup {
    const paperForm = this.formBuilder.group({
      paper: [null],
      quantity: [1],
      lineCost: [0],
    });

    // Helper function to calculate and update lineCost
    const updateLineCost = () => {
      const selectedPaper: any = paperForm.get('paper')?.value;
      const quantity: number = paperForm.get('quantity')?.value ?? 0;

      if (selectedPaper?.unitPrice != null) {
        const cost = selectedPaper.unitPrice * quantity;
        paperForm.get('lineCost')?.setValue(cost, {emitEvent: false});
      } else {
        paperForm.get('lineCost')?.setValue(0, {emitEvent: false});
      }
    };

    // Subscribe to both value changes
    paperForm.get('quantity')?.valueChanges.subscribe(updateLineCost);
    paperForm.get('paper')?.valueChanges.subscribe(updateLineCost);

    return paperForm;
  }

  get materials(): FormArray {
    return this.form.get('productMaterials') as FormArray;
  }

  get papers(): FormArray {
    return this.form.get('productPapers') as FormArray;
  }

  addMaterial() {
    this.materials.push(this.createMaterialForm());
  }

  removeMaterial(index: number) {
    this.materials.removeAt(index);
  }

  addPapers() {
    this.papers.push(this.createPaperForm());
  }

  removePaper(i: number) {
    this.papers.removeAt(i);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.createView();
    this.productStatusService.getAll().subscribe({
      next: (productStatuses: ProductStatus[]) => {
        this.productStatuses = productStatuses;
      }, error: (err) => {
        console.log(err);
      }
    })
    this.productFrequencyService.getAll().subscribe({
      next: (productFrequencies: ProductFrequency[]) => {
        this.productFrequencies = productFrequencies;
      }, error: (err) => {
        console.log(err);
      }
    })
    this.productCategoryService.getAll().subscribe({
      next: (productCategories: ProductCategory[]) => {
        console.log(productCategories)
        this.productCategories = productCategories;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.materialService.getAllList().subscribe({
      next: (materials: Material[]) => {
        this.materialList = materials;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperService.getAllList().subscribe({
      next: (papers:Paper[]) => {
        this.paperList = papers;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.regexService.get('product').subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    // this.form.valueChanges.subscribe((materials: any[]) => {
    //   console.log(materials);
    // });
  }

  createView() {
    this.loadTable("");
  }


  createForm() {
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['quantity'].setValidators([Validators.required]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['unitprice'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['productStatus'].setValidators([Validators.required]);
    this.form.controls['productCategory'].setValidators([Validators.required]);
    this.form.controls['productfrequency'].setValidators([Validators.required]);
    this.form.controls['productMaterials'].setValidators([Validators.required]);
    this.form.controls['productPapers'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldProduct != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (value === this.product[controlName]) {
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
    this.getLastProductCode()
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    console.log('btn ', add, upd, del)
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'delete');
    console.log(this.hasInsertAuthority, this.hasUpdateAuthority, this.hasDeleteAuthority)
  }

  loadTable(query: string) {

    this.productService.getAll(query).subscribe({
      next: (materials: Product[]) => {
        this.data = new MatTableDataSource(materials);
        this.data.paginator = this.paginator;
      }, error: (error) => {
        console.log(error);
      }
    })
  }

  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    const code = sserchdata.code;
    const name = sserchdata.name;
    const materialstatusid = sserchdata.materialstatus;
    const materialsubcategoryid = sserchdata.materialsubcategory;

    let query = "";

    if (code != null && code.trim() != "") query = query + "&code=" + code;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (materialstatusid != null) query = query + "&materialstatusid=" + materialstatusid;
    if (materialsubcategoryid != null) query = query + "&materialsubcategoryid=" + materialsubcategoryid;

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

  selectImage(e: any): void {
    console.log(e.target.files[0]);
    if (e.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.form.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.form.controls['photo'].markAsDirty();
  }


  add() {
    const errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Product Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.product = this.form.getRawValue();
      this.product.photo = btoa(this.imageempurl);
      let matdata = "";
      matdata = matdata + "<br>Number is : " + this.product.code;
      matdata = matdata + "<br>Fullname is : " + this.product.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Product Add",
          message: "Are you sure to Add the following Product? <br> <br>" + matdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.productService.add(this.product).subscribe({
            next: (responce) => {
              if (responce)
                this.toastr.success("Product Added Successfully", "Success").onShown.subscribe(() => {
                  // this.form.reset();
                  this.form.controls['doassignment'].setValue(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));
                  this.clearImage();
                  Object.values(this.form.controls).forEach(control => {
                    control.markAsTouched();
                  });
                  this.loadTable("");
                })
            }, error: (error) => {
              this.toastr.error("Failed to add product :" + error.error.data.message, "Error")
            }
          })
        }
      });
    }
  }


  getErrors(optionalFields?: string []): string {

    let errors = "";

    for (const controlName in this.form.controls) {
      if (!optionalFields?.includes(controlName)) {
        const control = this.form.controls[controlName];
        if (control.errors) {

          if (this.regexes[controlName] != undefined) {
            errors = errors + "<br>" + this.regexes[controlName]['message'];
          } else {
            errors = errors + "<br>Invalid " + controlName;
          }
        }
      }
    }

    return errors;
  }

  fillForm(product: Product) {
    console.log(product)
    this.form.reset()
    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;
    this.selectedrow = product;
    this.product = JSON.parse(JSON.stringify(product));
    this.oldProduct = JSON.parse(JSON.stringify(product));
    if (this.product.photo != null) {
      if (typeof this.product.photo === "string") {
        this.imageempurl = atob(this.product.photo);
      }
      this.form.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }


    this.product.productStatus = this.productStatuses.find(g => g.id === product.productStatus?.id);
    this.product.productCategory = this.productCategories.find(g => g.id === product.productCategory?.id);
    this.product.productfrequency = this.productFrequencies.find(f => f.id === product.productfrequency?.id);

    this.materials.clear(); // clear existing if needed

    // @ts-ignore
    this.product.productMaterials.forEach(pm => {
      // @ts-ignore
      const mat = this.materialList.find(m => m.id == pm.material.id)
      const fg = this.createMaterialForm();
      fg.patchValue({
        // @ts-ignore
        material: mat,       // full object
        quantity: pm.quantity,
        lineCost: pm.lineCost
      });
      this.materials.push(fg);
    });

    this.papers.clear();
    this.product.productPapers?.forEach( pp => {
      const paper = this.paperList.find(p => p.id == pp.paper.id)
      const fg = this.createPaperForm();
      fg.patchValue({

        paper: paper,       // full object
        quantity: pp.quantity,
        lineCost: pp.lineCost
      });
      this.papers.push(fg);
    })
    this.product.photo = "";
    this.form.patchValue(this.product);
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
        data: {heading: "Errors - Product Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Product Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.product = this.form.getRawValue();

            if (this.form.controls['photo'].dirty)
              this.product.photo = btoa(this.imageempurl);
            else this.product.photo = this.oldProduct.photo
            this.product.id = this.oldProduct.id;
            this.productService.update(this.product).subscribe({
              next: (response: any) => {
                this.form.reset();
                this.disableGenerateNo = false;
                this.clearImage();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                this.loadTable("");
                this.toastr.success(response.message, "Success");
              }, error: (error) => {
                this.toastr.error(error.data.message)
              }
            })
          }
        });
      } else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Product Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Product? <br> <br>" + this.product.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.productService.delete(this.product.id).subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              this.toastr.success(response.data.message, "Success").onShown.subscribe(() => {
                this.form.reset();
                this.disableGenerateNo = false;
                this.clearImage();
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
                this.loadTable("");
              })
            }
          },
          error: (err) => {
            this.toastr.error(err.error.data.message, "Error:  Failed to delete")
          }
        });
      }
    });
  }

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Product Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.selectedrow = null;
        this.createForm();
        this.clearImage();
        this.form.controls['description'].markAsPristine();
        this.form.controls['doassignment'].markAsPristine();
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.clearImage();
    this.form.controls['description'].markAsPristine();
    this.form.controls['doassignment'].markAsPristine();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    this.enableButtons(true, false, false);
  }

  checkMatStatus(statusId: string) {
    switch (statusId) {
      case "Available":
        return "text-success-light";
      case "Discontinued":
        return "text-info-light";
      case "Out of Stock":
        return "text-danger-light";
      case "Low Stock":
        return "text-warning-light";
      default:
        return "";
    }
  }

  getLastProductCode() {
    this.productService.getLastProductCode().subscribe(ecode => {
      this.lastProductCode = ecode.code
      this.form.controls["code"].setValue(this.lastProductCode)
    });

  }

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }


}
