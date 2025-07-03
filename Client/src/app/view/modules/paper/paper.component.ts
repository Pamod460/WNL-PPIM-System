import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Paper} from "../../../entity/Paper";
import {PaperStatus} from "../../../entity/PaperStatus";
import {UiAssist} from "../../../util/ui/ui.assist";
import {RegexService} from "../../../service/Shared/regex.service";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {MatDialog} from "@angular/material/dialog";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PaperService} from "../../../service/Paper/paper.service";
import {PaperUnitTypeService} from "../../../service/Paper/paper-unit-type.service";
import {PaperStatusService} from "../../../service/Paper/paper-status.service";
import {PaperUnitType} from "../../../entity/PaperUnitType";
import {PaperType} from "../../../entity/PaperType";
import {PaperColor} from "../../../entity/PaperColor";
import {PaperGsm} from "../../../entity/PaperGsm";
import {PaperSize} from "../../../entity/PaperSize";
import {PaperTypeService} from "../../../service/Paper/paper-type.service";
import {PaperGsmService} from "../../../service/Paper/paper-gsm.service";
import {PaperColorService} from "../../../service/Paper/paper-color.service";
import {PaperSizeService} from "../../../service/Paper/paper-size.service";


@Component({
  selector: 'app-paper',
  templateUrl: './paper.component.html',
  styleUrls: ['./paper.component.css']
})
export class PaperComponent implements OnInit {

  columns: string[] = ['name', 'code', 'qoh', 'rop', 'unitPrice', 'paperType', 'paperStatus',];
  headers: string[] = ['Name', 'Code', 'Quantity', 'ROP', 'Unit Price', 'Type', 'Status'];
  binders: string[] = ['name', 'code', 'qoh', 'rop', 'unitPrice', 'paperType.name', 'paperStatus.name'];

  defaultProfile = 'assets/defaultimg.png';
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify = false;
  disableGenerateNo = false;

  paper!: Paper;
  oldpaper!: Paper;

  selectedrow: any;
  data!: MatTableDataSource<Paper>;
  imageurl = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  enaadd = false;
  enaupd = false;
  enadel = false;

  hasInsertAuthority = false;
  hasUpdateAuthority = false;
  hasDeleteAuthority = false;

  protected readonly document = document;

  regexes: any;

  uiassist: UiAssist;

  minDate: Date;
  maxDate: Date;

  today: Date = new Date();

  paperTypes: PaperType[] = [];
  paperUnitTypes: PaperUnitType[] = [];
  paperStatuses: PaperStatus[] = [];
  paperColors: PaperColor[] = [];
  paperGsms: PaperGsm[] = [];
  paperSizes: PaperSize[] = [];


  constructor(
    private paperService: PaperService,
    private paperStatusService: PaperStatusService,
    private paperTypeService: PaperTypeService,
    private paperSizeService: PaperSizeService,
    private paperGsmService: PaperGsmService,
    private paperUnitTypeService: PaperUnitTypeService,
    private paperColorService: PaperColorService,
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
      "papertype": new FormControl(),
      "paperstatus": new FormControl(),
    });
    this.form = this.formBuilder.group({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      rop: new FormControl('', [Validators.required, Validators.min(0)]),
      unitPrice: new FormControl('', [Validators.required, Validators.min(0)]),
      description: new FormControl(''),
      doIntroduced: new FormControl(''),
      paperGsm: new FormControl(''),
      paperSize: new FormControl(''),
      paperType: new FormControl(null, [Validators.required]),
      paperColor: new FormControl(null, [Validators.required]),
      paperStatus: new FormControl(null, [Validators.required]),
      qoh: new FormControl(null, [Validators.required]),
      paperUnitType: new FormControl(null, [Validators.required]),
      logger: new FormControl(null, [Validators.required]),
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
    this.paperStatusService.getAll().subscribe({
      next: (paperstatuses: PaperStatus[]) => {
        this.paperStatuses = paperstatuses;
      }, error: (err) => {
        console.log(err);
      }
    })

    this.paperUnitTypeService.getAll().subscribe({
      next: (unittypes: PaperUnitType[]) => {
        this.paperUnitTypes = unittypes;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperColorService.getAll().subscribe({
      next: (paperColors: PaperColor[]) => {
        this.paperColors = paperColors;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperGsmService.getAll().subscribe({
      next: (paperGsms: PaperGsm[]) => {
        this.paperGsms = paperGsms;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperSizeService.getAll().subscribe({
      next: (paperSizes: PaperSize[]) => {
        this.paperSizes = paperSizes;
      }, error: (err: any) => {
        console.log(err);
      }
    })
    this.paperTypeService.getAll().subscribe({
      next: (paperTypes: PaperType[]) => {
        this.paperTypes = paperTypes;
      }, error: (err: any) => {
        console.log(err);
      }
    })


    this.regexService.get('paper').subscribe((regs: []) => {
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
    // this.form.controls['code'].setValidators([Validators.required]);
    // this.form.controls['name'].setValidators([Validators.required]);
    // this.form.controls['quantity'].setValidators([Validators.required]);
    // this.form.controls['rop'].setValidators([Validators.required]);
    // this.form.controls['unitprice'].setValidators([Validators.required]);
    // this.form.controls['description'].setValidators(Validators.required);
    // this.form.controls['dointroduced'].setValidators([Validators.required]);
    // this.form.controls['unittype'].setValidators([Validators.required]);
    // this.form.controls['paperstatus'].setValidators([Validators.required]);
    // this.form.controls['papersubcategory'].setValidators([Validators.required]);
    // this.form.controls['papercategory'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {
          if (this.oldpaper != undefined && control.valid) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (value === this.paper[controlName]) {
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

    // this.form.controls['dointroduced'].setValue(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));
    // this.disableGenerateNo = false;
    // this.form.controls["papercategory"].valueChanges.subscribe(value => {
    //   console.log(value)
    //   this.paperSubcategories = this.allPaperSubcategories.filter(msc =>
    //     msc.papercategory?.id === value?.id
    //   );
    // });
    this.enableButtons(true, false, false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {

    this.enaadd = add;
    this.enaupd = upd;
    this.enadel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'paper' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'paper' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'paper' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.paperService.getAll(query).subscribe({
      next: (papers: Paper[]) => {
        this.data = new MatTableDataSource(papers);
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
    const paperstatusid = sserchdata.paperstatus;
    const paperTypeid = sserchdata.papertype;

    let query = "";

    if (code != null && code.trim() != "") query = query + "&code=" + code;
    if (name != null && name.trim() != "") query = query + "&name=" + name;
    if (paperstatusid != null) query = query + "&paperstatusid=" + paperstatusid;
    if (paperTypeid != null) query = query + "&paperTypeid=" + paperTypeid;

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
        data: {heading: "Errors - Paper Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {
      this.paper = this.form.getRawValue();
      let matdata = "";
      matdata = matdata + "<br>Number is : " + this.paper.code;
      matdata = matdata + "<br>Fullname is : " + this.paper.name;
      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Paper Add",
          message: "Are you sure to Add the following Paper? <br> <br>" + matdata
        }
      });
      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.paperService.add(this.paper).subscribe({
            next: (responce) => {
              this.toastr.success(responce.message).onShown.subscribe(() => {
                this.form.reset();
                this.loadTable("");
                this.form.controls['doassignment'].setValue(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()));
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
              })
            }, error: (error) => {
              this.toastr.error("Failed to add paper :" + error.error.data.message, "Error")
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

  fillForm(paper: Paper) {
    this.form.reset()
    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;
    this.selectedrow = paper;
    this.paper = JSON.parse(JSON.stringify(paper));
    this.oldpaper = JSON.parse(JSON.stringify(paper));
    this.paper.paperUnitType = this.paperUnitTypes.find(g => g.id === paper.paperUnitType?.id);
    this.paper.paperStatus = this.paperStatuses.find(g => g.id === paper.paperStatus?.id);
    this.paper.paperColor = this.paperColors.find(g => g.id === paper.paperColor?.id);
    this.paper.paperGsm = this.paperGsms.find(g => g.id === paper.paperGsm?.id);
    this.paper.paperType = this.paperTypes.find(g => g.id === paper.paperType?.id);
    this.paper.paperSize = this.paperSizes.find(g => g.id === paper.paperSize?.id);
    this.paper.photo = "";
    console.log(this.paper.paperStatus)
    this.form.patchValue(this.paper);
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
        data: {heading: "Errors - Paper Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Paper Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {

            this.paper = this.form.getRawValue();


            this.paper.id = this.oldpaper.id;
            this.paperService.update(this.paper).subscribe({
              next: (response: any) => {
                this.form.reset();
                this.disableGenerateNo = false;

                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
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
          data: {heading: "Confirmation - Paper Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Paper? <br> <br>" + this.paper.name
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.paperService.delete(this.paper.id).subscribe({
          next: (response: any) => {
            if (response) {
              this.toastr.success(response.data).onShown.subscribe(() => {
                this.form.reset();
                this.disableGenerateNo = false;
                this.loadTable("");
                Object.values(this.form.controls).forEach(control => {
                  control.markAsTouched();
                });
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
        heading: "Confirmation - Paper Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.form.reset();
        this.selectedrow = null;
        this.createForm();

        this.form.controls['description'].markAsPristine();
        this.form.controls['doassignment'].markAsPristine();
      }
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

  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }
}
