import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
import {ProductPaper} from "../../../entity/ProductPaper";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  columns: string[] = ['name', 'code', 'quantity', 'unitPrice', 'productStatus', 'productfrequency', 'productCategory'];
  headers: string[] = ['Name', 'Code', 'Quantity', 'Unit Price', 'Status', 'Frequency', 'Category'];
  binders: string[] = ['name', 'code', 'quantity', 'unitPrice', 'productStatus.name', 'productfrequency.frequency', 'productCategory.name'];

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
  productCategories: ProductCategory[] = [];
  paperList: Paper[] = [];
  lastProductCode = '';
  materialList!: Material[];

  materialForm: FormGroup
  paperForm: FormGroup
  isMaterialInnerDataUpdated = false;
  productMaterial!: ProductMaterial;
  productMaterials: ProductMaterial[] = [];
  filteredMaterialList: Material[] = [];
  productPaper!: ProductPaper;
  id = 0;
  grandTotal = 0
  filteredPaperList: Paper[] = [];
  productPapers: ProductPaper[] = [];
  navitem = 'Product Analysis';
  isPaperInnerDataUpdated = false;


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
      unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      agentPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      photo: new FormControl(''),
      logger: new FormControl(''),
      productStatus: new FormControl(null, [Validators.required]),
      productCategory: new FormControl(null, [Validators.required]),
      productfrequency: new FormControl(null, [Validators.required]),

    });
    this.materialForm = this.formBuilder.group({
      material: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineCost: [0]
    });
    this.paperForm = this.formBuilder.group({
      paper: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      lineCost: [0]
    });

    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
    this.form.get("logger")?.setValue(this.authService.getUsername());

    this.materialForm.get("quantity")?.valueChanges.subscribe(value => {
      const material = this.materialForm.get("material")?.value;
      console.log(material)
      if (material && value > 0) {
        this.updatePrices(value);
      } else {
        this.materialForm.get("lineCost")?.setValue(null);
      }
    })
    this.paperForm.get("quantity")?.valueChanges.subscribe(value => {
      const paper = this.paperForm.get("paper")?.value;
      console.log(paper)
      if (paper && value > 0) {
        this.updatePaperPrices(value);
      } else {
        this.paperForm.get("lineCost")?.setValue(null);
      }
    })
  }
  getUnitcost(): number {
    // @ts-ignore
    const totalMaterialCost = this.productMaterials.reduce((sum, m) => sum + m.lineCost, 0);
    // @ts-ignore
    const totalPaperCost = this.productPapers.reduce((sum, p) => sum + p.lineCost, 0);
    // console.log("Total Material Cost: ", this.productMaterials);
    const totalCost = totalMaterialCost + totalPaperCost;
    return totalCost / 100;
  }

  updateUnitPrice(): void {
    const unitCost = parseFloat((this.getUnitcost()).toFixed(2));
    const agentPrice = parseFloat((unitCost * 1.2).toFixed(2)); // Assuming agent price is 20% more than unit price
    const unitPrice= parseFloat((agentPrice * 1.1).toFixed(2)); // Assuming unit price is 10% more than unit cost
    this.form.get('unitPrice')?.setValue(unitPrice);
    this.form.get('agentPrice')?.setValue(agentPrice);
  }


  updatePrices(quantity: number) {

    const material = this.materialForm.get("material")?.value;
    // if (!material || quantity <= 0) {
    //   this.materialForm.get("lineCost")?.setValue(null);
    //   return;
    // }

    const unitPrice = material.unitPrice || 0;
    const lineTotal = unitPrice * quantity;
    this.materialForm.get("lineCost")?.setValue(lineTotal);
    console.log(this.getUnitcost())
  }

  updatePaperPrices(quantity: number) {

    const paper = this.paperForm.get("paper")?.value;
    if (!paper || quantity <= 0) {
      this.paperForm.get("lineCost")?.setValue(null);
      return;
    }
    const unitPrice = paper.unitPrice || 0;
    const lineTotal = unitPrice * quantity;
    this.paperForm.get("lineCost")?.setValue(lineTotal);

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
        this.filteredMaterialList = [...materials];
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperService.getAllList().subscribe({
      next: (papers: Paper[]) => {
        this.paperList = papers;
        this.filteredPaperList = [...papers];
      }, error: (err: any) => {
        console.log(err);
      }
    })
    // this.regexService.get('product').subscribe((regs: []) => {
    //   this.regexes = regs;
    // });
    this.createForm();

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
    this.form.controls['unitPrice'].setValidators([Validators.required]);
    this.form.controls['photo'].setValidators([Validators.required]);
    this.form.controls['productStatus'].setValidators([Validators.required]);
    this.form.controls['productCategory'].setValidators([Validators.required]);
    this.form.controls['productfrequency'].setValidators([Validators.required]);


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
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'product' && authority.operation === 'delete');

  }

  loadTable(query: string) {

    this.productService.getAll(query).subscribe({
      next: (materials: Product[]) => {
        this.data = new MatTableDataSource(materials);
        this.data.paginator = this.paginator;
      }, error: (error) => {

      }
    })
  }

  addMaterialToTable() {
    this.productMaterial = this.materialForm.getRawValue();

    // Validate material input
    if (!this.productMaterial.material || this.productMaterial.quantity == 0) {
      this.showMessageDialog("Errors - Material  Add", "Please Add Required Details");
      return;
    }

    const quantity = this.productMaterial.quantity || 0;
    const unitPrice = this.productMaterial.material?.unitPrice || 0;
    const expectedLineCost = quantity * unitPrice;
    this.grandTotal += expectedLineCost
    this.form.get("expectedCost")?.setValue(this.grandTotal);
    const newEntry = new ProductMaterial(
      this.id,
      this.productMaterial.material,
      expectedLineCost,
      quantity
    );
    const updatedData: ProductMaterial[] = this.productMaterials ? [...this.productMaterials] : [];

    const isDuplicate = updatedData.some(item => item.material?.id === newEntry.material?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Material Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedMaterialId = newEntry.material?.id;
      const removeIndex = this.filteredMaterialList.findIndex(e => e.id === addedMaterialId);
      if (removeIndex > -1) {
        this.filteredMaterialList.splice(removeIndex, 1);
      }
      this.productMaterials = updatedData;
      this.updateUnitPrice();
      this.id++;
      this.isMaterialInnerDataUpdated = true;
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

  private resetPaperForm(): void {
    this.paperForm.reset();
    for (const controlName in this.paperForm.controls) {
      const control = this.paperForm.controls[controlName];
      control.clearValidators();
      control.updateValueAndValidity();
    }
  }

  deleteMaterialRow(x: ProductMaterial): void {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Material POrder",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.productMaterials.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const material = this.productMaterials[indexToDelete]?.material;

        if (material?.id) {
          if (!this.filteredMaterialList.some(e => e.id === material.id)) {
            this.filteredMaterialList = [material, ...this.filteredMaterialList];
          }
        }
        this.productMaterials.splice(indexToDelete, 1);
        this.isMaterialInnerDataUpdated = true;
      }
    });
  }


  trackByInnerData(index: number, item: any): any {
    return item?.id || index;
  }


  addPaperToTable() {
    this.productPaper = this.paperForm.getRawValue();

    // Validate material input
    if (!this.productPaper.paper || this.productPaper.quantity == 0) {
      this.showMessageDialog("Errors - Material POrder Add", "Please Add Required Details");
      return;
    }

    const quantity = this.productPaper.quantity || 0;
    const unitPrice = this.productPaper.paper?.unitPrice || 0;
    const expectedLineCost = quantity * unitPrice;
    this.grandTotal += expectedLineCost
    this.form.get("expectedCost")?.setValue(this.grandTotal);
    const newEntry = new ProductPaper(
      this.id,
      this.productPaper.paper,
      quantity,
      expectedLineCost
    );
    const updatedData: ProductPaper[] = this.productPapers ? [...this.productPapers] : [];

    const isDuplicate = updatedData.some(item => item.paper?.id === newEntry.paper?.id);

    if (isDuplicate) {
      this.showMessageDialog("Errors - Material POrder Add", "Duplicate record.<br>This record already exists in the table.");
    } else {
      // Add new entry and remove from filtered list
      updatedData.push(newEntry);
      const addedMaterialId = newEntry.paper?.id;
      const removeIndex = this.filteredPaperList.findIndex(e => e.id === addedMaterialId);
      if (removeIndex > -1) {
        this.filteredPaperList.splice(removeIndex, 1);
      }
      this.productPapers = updatedData;
      this.updateUnitPrice();
      this.id++;
      this.isPaperInnerDataUpdated = true;
      this.resetPaperForm();
    }
  }

  deletePaperRow(x: ProductPaper) {
    const dialogRef = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Delete Product Paper",
        message: "Are You Sure You Want To Perform this Operation?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      const indexToDelete = this.productPapers.findIndex(item => item.id === x.id);

      if (indexToDelete > -1) {
        const material = this.productPapers[indexToDelete]?.paper;
        if (material?.id) {
          if (!this.filteredPaperList.some(e => e.id === material.id)) {
            this.filteredPaperList = [material, ...this.filteredPaperList];
          }
        }
        this.productPapers.splice(indexToDelete, 1);
        this.isPaperInnerDataUpdated = true;
      }
    });
  }

  onPhotoChanged(files: File[]) {
    if (!files || files.length === 0) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const base64String = dataUrl.split(',')[1];

      if (this.form.get("photo")?.value !== base64String) {
        this.form.get("photo")?.setValue(base64String);
        this.form.get("photo")?.markAsDirty();
      }
    };
    reader.readAsDataURL(files[0]);
  }

  onPhotoRemoved(fileId: string) {
    this.form.get("photo")?.setValue(null);
    if (this.form.get("photo")?.value != this.product.photo) {
      this.form.get("photo")?.markAsDirty();
    } else {
      this.form.get("photo")?.markAsPristine();
    }
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
      this.productMaterials.forEach((i) => delete i.id);
      this.productPapers.forEach((i) => delete i.id);
      this.product.productMaterials = this.productMaterials;
      this.product.productPapers = this.productPapers;
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
                this.toastr.success("Product Added Successfully").onShown.subscribe(() => {
                  this.resetForm();
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

    this.form.reset()
    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;
    this.selectedrow = product;
    this.product = JSON.parse(JSON.stringify(product));
    this.oldProduct = JSON.parse(JSON.stringify(product));
    this.product.productStatus = this.productStatuses.find(g => g.id === product.productStatus?.id);
    this.product.productCategory = this.productCategories.find(g => g.id === product.productCategory?.id);
    this.product.productfrequency = this.productFrequencies.find(f => f.id === product.productfrequency?.id);
    this.productMaterials = product.productMaterials || [];
    this.productPapers = product.productPapers || [];
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
    if (this.isMaterialInnerDataUpdated) {
      updates += "<br> Material Quantity Changed"
    }

    if (this.isPaperInnerDataUpdated) {
      updates += "<br> Paper Quantity Changed"
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
            this.product.id = this.oldProduct.id;

            this.productMaterials.forEach((i) => delete i.id);
            this.productPapers.forEach((i) => delete i.id);

            this.product.productMaterials = this.productMaterials;
            this.product.productPapers = this.productPapers;
            this.productService.update(this.product).subscribe({
              next: (response: any) => {
                this.resetForm();
                this.loadTable("");
                this.toastr.success(response.message);
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
              this.toastr.success(response.data.message).onShown.subscribe(() => {
                this.loadTable("");
                this.resetForm();
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
        this.resetForm()
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.disableGenerateNo = false;
    this.createForm();
    this.productPapers=[]
    this.productMaterials=[]
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
