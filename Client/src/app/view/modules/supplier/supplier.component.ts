import {Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Employee} from "../../../entity/employee";
import {MatSelectionList} from "@angular/material/list";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {EmployeeService} from "../../../service/employee/employee.service";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/Shared/regex.service";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {SupplierStatus} from "../../../entity/SupplierStatus";
import {SupplierType} from "../../../entity/SupplierType";
import {SupplierTypeService} from "../../../service/supplier/supplier-type.service";
import {SupplierService} from "../../../service/supplier/supplier.service";
import {Supplier} from "../../../entity/Supplier";
import {SupplierStatusService} from "../../../service/supplier/supplier-status.service";
import {Supply} from "../../../entity/Supply";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {Country} from "../../../entity/Country";
import {map, Observable, startWith} from "rxjs";
import {CountryService} from "../../../service/supplier/country.service";
import {MaterialSubcategory} from "../../../entity/MaterialSubcategory";
import {MaterialsubcategoryService} from "../../../service/material/materialsubcategory.service";
import {PaperSupply} from "../../../entity/PaperSupply";
import {PaperType} from "../../../entity/PaperType";
import {PaperTypeService} from "../../../service/Paper/paper-type.service";


@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SupplierComponent implements OnInit {
  @ViewChild('dialogTemplate', {static: true}) dialogTemplate!: TemplateRef<any>;
  @ViewChild('dialogTemplate2', {static: true}) dialogTemplate2!: TemplateRef<any>;
  public form!: FormGroup;
  public ssearch!: FormGroup;

  employees: Employee[] = [];

  suppliers: Supplier[] = [];

  materialSubcategories: MaterialSubcategory[] = [];

  oldmaterialSubcategories: MaterialSubcategory[] = [];
  countries: Country[] = [];

  filteredCountries: Observable<Country[]>;
  supplier!: Supplier;
  oldSupplier!: Supplier;


  @ViewChild('availablelist') availablelist!: MatSelectionList;
  @ViewChild('selectedlist') selectedlist!: MatSelectionList;
  defaultProfile = 'assets/default.png';

  columns: string[] = ['name', 'regNo', 'telephone', 'email', 'supplierstatus', 'suppliertype'];
  headers: string[] = ['Name', 'Reg No', 'Telephone', 'Email', 'Status', 'Type'];
  binders: string[] = ['name', 'regNo', 'telephone', 'email', 'supplierstatus.name', 'suppliertype.name'];
  imageurl = '';
  btnMaterialText = "Add Materials";

  data = new MatTableDataSource<Supplier>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  selectedrow: any;


  uiassist: UiAssist;

  regexes: any;

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;


  isPwViewable = true
  isConfPwViewable = true

  disableModify = false;
  disableGenerateNo = false;
  isUserNameReadOnly = false;

  today: Date = new Date();
  supplierStatuses: SupplierStatus[] = [];
  supplierTypes: SupplierType[] = [];
  supplies: Supply[] = [];
  dataSource = new MatTableDataSource<Supplier>([]);
  lastSupCode = "";
  paperSupplies: PaperSupply[] = [];
  paperTypes: PaperType[] = [];
  oldPaperTypes: PaperType[] = [];
  btnPaperText = "Add Papers";

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private supplierTypeService: SupplierTypeService,
    private supplierStatusService: SupplierStatusService,
    private materialSubcategoryService: MaterialsubcategoryService,
    private paperTypesService: PaperTypeService,
    private supplierService: SupplierService,
    private datePipe: DatePipe,
    private matDialog: MatDialog,
    private regexService: RegexService,
    public authService: AuthorizationManager,
    private toastrService: ToastrService,
    private tableUtils: TableUtilsService,
    private dialog: MatDialog,
    private countryService: CountryService
  ) {

    this.uiassist = new UiAssist(this);
    this.supplier = new Supplier();

    this.form = this.formBuilder.group({
      "name": new FormControl('', [Validators.required, Validators.maxLength(45)]),
      "telephone": new FormControl('', [Validators.maxLength(10)]),
      "faxNo": new FormControl('', [Validators.maxLength(10)]),
      "address": new FormControl(''),
      "email": new FormControl('', [Validators.email, Validators.maxLength(45)]),
      "contactPerson": new FormControl('', [Validators.maxLength(45)]),
      "contactPersonTelephone": new FormControl('', [Validators.maxLength(10)]),
      "country": new FormControl('', [Validators.maxLength(45)]),
      "regdate": new FormControl('', [Validators.required]),
      "bankAccNo": new FormControl('', [Validators.maxLength(15)]),
      "bankName": new FormControl('', [Validators.required]),
      "bankBranch": new FormControl('', [Validators.required]),
      "accontHolder": new FormControl('', [Validators.required]),
      "description": new FormControl(''),
      "supplierstatus": new FormControl('', [Validators.required]),
      "suppliertype": new FormControl('', [Validators.required]),
      "regNo": new FormControl('', [Validators.maxLength(6)]),
      "material": new FormControl(),
      "supplies": new FormControl(),
      "paperSupplies": new FormControl(),
      "logger": new FormControl(),
    });


    this.ssearch = this.formBuilder.group({
      "number": new FormControl(),
      "name": new FormControl(),
      "suppliertype": new FormControl(),
      "supplierstatus": new FormControl(),
      "material": new FormControl(),
    });

    this.filteredCountries = this.form.controls["country"].valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value || ''))
    );
    this.form.get("logger")?.setValue(this.authService.getUsername());
  }

  private filter(value: string): Country[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.name.toLowerCase().includes(filterValue));
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();
    this.employeeService.getAllListNameId().subscribe({
      next: (emps: Employee[]) => {
        this.employees = emps;
      }, error: (error) => {
        console.error(error)
      }
    });


    this.supplierTypeService.getAllList().subscribe((supplierTypes: SupplierType[]) => {
      this.supplierTypes = supplierTypes;
    });

    this.supplierStatusService.getAllList().subscribe((supplierStatuses: SupplierStatus[]) => {
      this.supplierStatuses = supplierStatuses;
    });
    this.countryService.getAllList().subscribe((countries: Country[]) => {
      this.countries = countries;
    });

    this.materialSubcategoryService.getAll("").subscribe((materialSubcategories: MaterialSubcategory[]) => {
      this.materialSubcategories = materialSubcategories;
      // this.oldmaterialSubcategories = Array.from(this.materialSubcategories)
    });
    this.paperTypesService.getAll().subscribe((paperTypes: PaperType[]) => {
      this.paperTypes = paperTypes;
      // this.oldmaterialSubcategories = Array.from(this.materialSubcategories)
    });


    this.regexService.get("users").subscribe((regs: []) => {
      this.regexes = regs;
      this.createForm();
    });

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.enableButtons(true, false, false);

  }

  createView() {
    this.loadTable("");
  }

  openDialog() {
    this.dialog.open(this.dialogTemplate);
  }

  loadTable(query: string): void {
    this.supplierService.getAll(query).subscribe((suppliers: Supplier[]) => {
      this.suppliers = suppliers;
      this.data = new MatTableDataSource(this.suppliers);
      this.data.paginator = this.paginator;
    })
  }

  getDate(element: Supplier) {
    return this.datePipe.transform(element.regdate, 'yyyy-MM-dd');
  }


  createForm() {
    this.form.controls['name'].setValidators([Validators.required, Validators.maxLength(45)]);
    this.form.controls['telephone'].setValidators([Validators.maxLength(10)]);
    this.form.controls['faxNo'].setValidators([Validators.maxLength(10)]);
    this.form.controls['address'].setValidators([]);
    this.form.controls['email'].setValidators([Validators.email, Validators.maxLength(45)]);
    this.form.controls['contactPerson'].setValidators([Validators.maxLength(45)]);
    this.form.controls['contactPersonTelephone'].setValidators([Validators.maxLength(10)]);
    this.form.controls['country'].setValidators([Validators.maxLength(45)]);
    this.form.controls['regdate'].setValidators([Validators.required]);
    this.form.controls['bankAccNo'].setValidators([Validators.maxLength(15)]);
    this.form.controls['bankName'].setValidators([Validators.maxLength(15)]);
    this.form.controls['bankBranch'].setValidators([Validators.maxLength(15)]);
    this.form.controls['accontHolder'].setValidators([Validators.maxLength(15)]);
    this.form.controls['description'].setValidators([]);
    this.form.controls['supplierstatus'].setValidators([Validators.required]);
    this.form.controls['suppliertype'].setValidators([Validators.required]);
    this.form.controls['regNo'].setValidators([Validators.maxLength(6)]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (controlName == "regdate")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');
          if (this.oldSupplier != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-expect-error
            if (value === this.supplier[controlName]) {
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
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'delete');

  }

  btnSearchMc(): void {
    const sserchdata = this.ssearch.getRawValue();
    const number = sserchdata.number;
    const name = sserchdata.name;
    const suppliertypeid = sserchdata.suppliertype;
    const supplierstatusid = sserchdata.supplierstatus;
    const material = sserchdata.material;

    let query = "";

    if (number != null && number.trim() !== "") query = query + "&number=" + number;
    if (name != null && name.trim() !== "") query = query + "&name=" + name;
    if (suppliertypeid != null) query = query + "&type=" + suppliertypeid;
    if (supplierstatusid != null) query = query + "&status=" + supplierstatusid;
    if (material != null) query = query + "&material=" + material;

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

  add() {

    const errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      const supplier: Supplier = this.form.getRawValue();
      // @ts-ignore
      supplier.country = this.countries.filter(country => country.name === supplier.country)[0];

      supplier.supplies = this.supplier.supplies;
      this.supplier = supplier;

      let supllierdata = "";

      supllierdata = supllierdata + "<br>Supplier Name is : " + this.supplier.name;
      supllierdata = supllierdata + "<br>Registration Number is : " + this.supplier.regNo;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Supplier Add",
          message: "Are you sure to Add the following Supplier? <br> <br>" + supllierdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.supplierService.add(this.supplier).subscribe({
            next: (response) => {
              this.toastrService.success(response.message).onShown.subscribe(() => {
                this.loadTable("");
                this.resetForm()
              })
            }, error: (error) => {
              this.toastrService.error(error.error.data.message)
            }
          })
        }
      });
    }
  }


  fillForm(supplier: Supplier) {
    if (supplier.supplies.length > 0) {
      this.btnMaterialText = "View Materials";
    } else {
      this.btnMaterialText = "Add Materials";
    }
    if (supplier.paperSupplies.length > 0) {
      this.btnPaperText = "View Papers";
    } else {
      this.btnPaperText = "Add Papers";
    }
    this.enableButtons(false, true, true);

    // this.materialSubcategories = Array.from(this.oldmaterialSubcategories);

    this.selectedrow = supplier;

    this.supplier = JSON.parse(JSON.stringify(supplier));
    this.oldSupplier = JSON.parse(JSON.stringify(supplier));

    //@ts-ignore
    this.supplier.supplierstatus = this.supplierStatuses.find(s => s.id === this.supplier.supplierstatus.id);
    //
    //@ts-ignore
    this.supplier.suppliertype = this.supplierTypes.find(s => s.id === this.supplier.suppliertype.id);
    this.supplies = this.supplier.supplies;
    this.paperSupplies = this.supplier.paperSupplies;
    // this.supplier.supplies.forEach((ur) => this.materialSubcategories = this.materialSubcategories.filter((r) => r.id != ur.materialSubcategory.id));
    this.oldmaterialSubcategories = this.supplies.map((ur) => ur.materialSubcategory);
    this.oldPaperTypes = this.supplier.paperSupplies.map((ur) => ur.paperType);
    const supplierData = {...this.supplier}; // Clone the supplier object

    this.form.patchValue(supplierData);// Patch only allowed fields
    // @ts-ignore
    this.form.controls["country"].setValue(this.supplier.country.name);
    // this.form.controls["username"].disable();
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
        data: {heading: "Errors - Supplier Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.supplier = this.form.getRawValue();
            this.supplier.id = this.oldSupplier.id
            this.supplier.supplies = this.supplies
            this.supplier.paperSupplies = this.paperSupplies
            // @ts-ignore
            this.supplier.country = this.countries.filter(country => country.name === this.supplier.country)[0];
            this.supplierService.update(this.supplier).subscribe({
              next: (response) => {
                this.toastrService.success(response.message).onShown.subscribe(() => {
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
          data: {heading: "Confirmation - Employee Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }
  }


  delete(): void {

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '450px',
      data: {
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>" + this.supplier.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.supplierService.delete(this.supplier.id).subscribe({
          next: (response) => {
            this.toastrService.success(response.message).onShown.subscribe(() => {
              this.loadTable("");
              this.resetForm()
            })
          }, error: (error) => {
            this.toastrService.error(error.error.message)
          }
        })
      }
    });
  }


  clear(): void {
    this.isUserNameReadOnly = false;
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Employee Clear",
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
    this.btnMaterialText = "Add Materials";
    this.selectedrow = null;
    this.supplies = []
    this.paperSupplies = []
    this.createForm();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    this.enableButtons(true, false, false);
  }

  checkSupplierStatus(statusId: string) {
    switch (statusId) {
      case "Active":
        return "text-success-light";
      case "Inactive":
        return "text-warning-light";
      case "Blocked":
        return "text-danger-light";
      default:
        return "";
    }
  }


  getColumnClass(columnIndex: number): string {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }

  getLastSupCode() {
    this.supplierService.getLastSupCode().subscribe(ecode => {
      console.log(ecode.code)
      this.lastSupCode = ecode.code
      this.form.controls["regNo"].setValue(this.lastSupCode)
    });

  }

  onMaterialsPicked(selected: MaterialSubcategory[]) {
    this.supplies = [];
    selected.map(option => {
      const supply = new Supply(option);
      this.supplies.push(supply);
      return supply;
    });
    this.oldmaterialSubcategories = selected
  }

  onPickCancelled() {
    this.dialog.closeAll()
  }

  openMaterialDialog(): void {

    const dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.closeAll()
        console.log(result)
        // this.addMaterials(result);
      }
    });
  }

  addMaterials(selected: MaterialSubcategory[]) {
    this.form.get("supplies")?.setValue(selected);
    this.form.controls["supplies"].clearValidators();
    this.form.controls["supplies"].updateValueAndValidity();
    this.dialog.closeAll()
  }

  onPapersPicked(paperTypes: PaperType[]) {
    this.paperSupplies = [];
    paperTypes.map(option => {
      const paperSupply = new PaperSupply(option);
      this.paperSupplies.push(paperSupply);
      return paperSupply;
    });
    this.oldmaterialSubcategories = paperTypes
  }

  openPaperDialog() {

    const dialogRef = this.dialog.open(this.dialogTemplate2, {
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '90vh',
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialog.closeAll()
        console.log(result)
        // this.addMaterials(result);
      }
    });
  }

  addPapers(paperTypes: PaperType[]) {
    this.form.get("paperSupplies")?.setValue(paperTypes);
    this.form.controls["paperSupplies"].clearValidators();
    this.form.controls["paperSupplies"].updateValueAndValidity();
    this.dialog.closeAll()
  }
}
