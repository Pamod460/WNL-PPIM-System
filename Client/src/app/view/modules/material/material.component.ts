import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {Materialstatus} from "../../../entity/Materialstatus";
import {MaterialSubcategory} from "../../../entity/MaterialSubcategory";
import {Unittype} from "../../../entity/Unittype";
import {MaterialService} from "../../../service/material/material.service";
import {Material} from "../../../entity/Material";
import {MaterialstatusService} from "../../../service/material/materialstatus.service";
import {MaterialsubcategoryService} from "../../../service/material/materialsubcategory.service";
import {UnittypeService} from "../../../service/material/unittype.service";
import {ToastrService} from "ngx-toastr";
import {MaterialCategory} from "../../../entity/MaterialCategory";
import {MaterialcategoryService} from "../../../service/material/materialcategory.service";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {


  columns: string[] = ['name', 'code', 'quantity', 'rop', 'unitPrice', 'unitType', 'materialStatus', 'materialSubcategory'];
  headers: string[] = ['Name', 'Code', 'Quantity', 'ROP', 'Unit Price', 'Unit Type', 'Status', 'Subcategory'];
  binders: string[] = ['name', 'code', 'quantity', 'rop', 'unitPrice', 'unitType.name', 'materialStatus.name', 'materialSubcategory.name'];

  defaultProfile = 'assets/defaultimg.png';
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify = false;
  disableGenerateNo = false;

  material!: Material;
  oldmaterial!: Material;

  selectedrow: any;
  data!: MatTableDataSource<Material>;
  imageurl = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl = 'assets/defaultImg.png';

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;

  materialStatuses: Materialstatus[] = [];
  protected readonly document = document;
  materialSubcategories: MaterialSubcategory[] = [];
  unitTypes: Unittype[] = [];
  materialCategories: MaterialCategory[] = [];

  regexes: any;

  uiassist: UiAssist;

  minDate: Date;
  maxDate: Date;

  today: Date = new Date();
  allMaterialSubcategories: MaterialSubcategory[] = [];

  isModify=false;

  constructor(
    private materialService: MaterialService,
    private materialstatusService: MaterialstatusService,
    private materialsubcategoryService: MaterialsubcategoryService,
    private unittypeService: UnittypeService,
    private materialcategoryService: MaterialcategoryService,
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
      rop: new FormControl('', [Validators.required, Validators.min(0)]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      dointroduced: new FormControl(''),
      photo: new FormControl(''),
      logger: new FormControl(''),
      unitType: new FormControl(null, [Validators.required]),
      materialStatus: new FormControl(null, [Validators.required]),
      materialSubcategory: new FormControl(null, [Validators.required]),
      materialCategory: new FormControl(null, [Validators.required]),
    });
    this.form.get("logger")?.setValue(this.authService.getUsername());
    const today = new Date();
    this.minDate = new Date(today.getFullYear() - 60, today.getMonth(), today.getDate()); // 60 years ago
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()); // 18 years ago
    this.form.get("materialSubcategory")?.valueChanges.subscribe(value => {
      if (!this.isModify){
        this.getNextCode(value)
      }
    })
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.materialstatusService.getAll("").subscribe({
      next: (materialstatuses: Materialstatus[]) => {
        this.materialStatuses = materialstatuses;
      }, error: (err) => {
        console.log(err);
      }
    })
    this.materialsubcategoryService.getAll("").subscribe({
      next: (materialsubcategories: MaterialSubcategory[]) => {
        console.log(materialsubcategories)
        this.allMaterialSubcategories = materialsubcategories;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.unittypeService.getAll("").subscribe({
      next: (unittypes: Unittype[]) => {
        this.unitTypes = unittypes;
      }, error: (err: any) => {
        console.log(err);
      }
    })

    this.materialcategoryService.getAll("").subscribe(
      {
        next: (materialcategories: MaterialCategory[]) => {
          this.materialCategories = materialcategories;
        }, error: (err: any) => {
          console.log(err);
        }
      }
    )


    this.regexService.get('material').subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createView() {
    this.loadTable("");
  }


  createForm() {
    this.form.controls['code'].setValidators([Validators.required]);
    this.form.controls['name'].setValidators([Validators.required]);
    this.form.controls['quantity'].setValidators([Validators.required]);
    this.form.controls['rop'].setValidators([Validators.required]);
    this.form.controls['unitPrice'].setValidators([Validators.required]);
    this.form.controls['dointroduced'].setValidators([Validators.required]);
    this.form.controls['unitType'].setValidators([Validators.required]);
    this.form.controls['materialStatus'].setValidators([Validators.required]);
    this.form.controls['materialSubcategory'].setValidators([Validators.required]);
    this.form.controls['materialCategory'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldmaterial != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (value === this.material[controlName]) {
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

    this.form.controls['dointroduced'].setValue(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));
    this.disableGenerateNo = false;
    this.form.controls["materialCategory"].valueChanges.subscribe(value => {
      console.log(value)
      this.materialSubcategories = this.allMaterialSubcategories.filter(msc =>
        msc.materialCategory?.id === value?.id
      );
    });
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    console.log('btn ', add, upd, del)
    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'material' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'material' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'material' && authority.operation === 'delete');
    console.log(this.hasInsertAuthority, this.hasUpdateAuthority, this.hasDeleteAuthority)
  }

  loadTable(query: string) {

    this.materialService.getAll(query).subscribe({
      next: (materials: Material[]) => {
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



  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.form.controls['photo'].markAsDirty();
  }


  add() {
    const errors = this.getErrors();
    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Material Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.material = this.form.getRawValue();
      // this.material.photo = btoa(this.imageempurl);
      let matdata = "";
      matdata = matdata + "<br>Number is : " + this.material.code;
      matdata = matdata + "<br>Fullname is : " + this.material.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Material Add",
          message: "Are you sure to Add the following Material? <br> <br>" + matdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.materialService.add(this.material).subscribe({
            next: (responce) => {
              if (responce)
                this.toastr.success("Material Added Successfully").onShown.subscribe(() => {

                  this.resetForm()

                  this.loadTable("");
                })
            }, error: (error) => {
              this.toastr.error("Failed to add material :" + error.error.data.message, "Error")
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

  fillForm(material: Material) {
    this.isModify=true;
    this.form.reset()
    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;
    this.selectedrow = material;
    this.material = JSON.parse(JSON.stringify(material));
    this.oldmaterial = JSON.parse(JSON.stringify(material));

    this.material.unitType = this.unitTypes.find(g => g.id === material.unitType?.id);
    this.material.materialStatus = this.materialStatuses.find(g => g.id === material.materialStatus?.id);
    this.material.materialCategory = this.materialCategories.find(g => g.id === material.materialSubcategory?.materialCategory?.id);
    this.material.materialSubcategory = this.allMaterialSubcategories.find(g => g.id === material.materialSubcategory?.id);

    this.form.patchValue(this.material);
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
        data: {heading: "Errors - Material Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Material Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.material = this.form.getRawValue();

            // if (this.form.controls['photo'].dirty)
            //   this.material.photo = btoa(this.imageempurl);
            // else this.material.photo = this.oldmaterial.photo
            this.material.id = this.oldmaterial.id;
            this.materialService.update(this.material).subscribe({
              next: (response: any) => {
                this.toastr.success(response.message);
                this.loadTable("");

                this.resetForm()


              }, error: (error) => {
                this.toastr.error(error.data.message)
              }
            })
          }
        });
      } else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Material Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Material? <br> <br>" + this.material.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.materialService.delete(this.material.id).subscribe({
          next: (response: any) => {
            if (response) {
              this.toastr.success(response.message).onShown.subscribe(() => {
                this.loadTable("");

                this.form.reset();


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
    if (this.form.get("photo")?.value != this.oldmaterial.photo) {
      this.form.get("photo")?.markAsDirty();
    } else {
      this.form.get("photo")?.markAsPristine();
    }
  }

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Material Clear",
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
    this.isModify=false;
    this.createForm();
    this.clearImage();
    this.form.get("logger")?.setValue(this.authService.getUsername());
    this.form.controls['description'].markAsPristine();
    // this.form.controls['doassignment'].markAsPristine();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
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

  getNextCode(value: MaterialSubcategory) {
    const nameParts = value.name.trim().split(" ");
    let textPart = "";

    if (nameParts.length > 1) {
      textPart = nameParts.map(part => part[0].toUpperCase()).join(""); // First letter of each word
    } else {
      textPart = nameParts[0].substring(0, 2).toUpperCase(); // First two letters of the single word
    }
    this.materialService.getNextCode(textPart).subscribe(code => {
      this.form.controls["code"].setValue(code.code);
    });
  }


  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }
}
