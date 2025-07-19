import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Agent} from "../../../entity/agent";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {RegexService} from "../../../service/Shared/regex.service";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {AgentService} from "../../../service/agent/agent.service";
import {District} from "../../../entity/District";
import {Route} from "../../../entity/Route";
import {Agentstatus} from "../../../entity/agentstatus";
import {AgentStatusService} from "../../../service/agent/agent-status.service";
import {DistrictService} from "../../../service/agent/district.service";
import {RouteService} from "../../../service/route/route.service";

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.css']
})
export class AgentComponent implements OnInit {
  protected readonly document = document;

  columns: string[] = ['number', 'fullName', 'nic', 'agentStatus'];
  headers: string[] = ['Registration Number', 'Full Name', 'NIC', 'Status'];
  binders: string[] = ['number', 'fullName', 'nic', 'agentStatus.name'];

  defaultProfile = 'assets/default.png';

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public form!: FormGroup;

  disableModify = false;
  disableGenerateNo = false;

  agent!: Agent;
  oldagent!: Agent;

  selectedrow: any;

  agents: Agent[] = [];
  data!: MatTableDataSource<Agent>;
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
  routes: Route[] = [];
  agentStatuses: Agentstatus[] = [];


  constructor(
    private agentService: AgentService,
    private agentStatusService: AgentStatusService,
    private districtService: DistrictService,
    private routeService: RouteService,
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
      "ssnumber": new FormControl(),
      "ssfullname": new FormControl('', Validators.pattern("^([A-Z][a-z]*[.]?[s]?)*([A-Z][a-z]*)$")),
      "ssgender": new FormControl(),
      "ssdesignation": new FormControl(),
      "ssnic": new FormControl()
    });
    this.form = this.formBuilder.group({
      number: new FormControl('', [Validators.required]),
      nic: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      land: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      doRegisterd: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      // longitude: new FormControl(null),
      // latitude: new FormControl(null),
      logger: new FormControl(),
      district: new FormControl(null, Validators.required),
      route: new FormControl(null, Validators.required),
      agentStatus: new FormControl(null, Validators.required)
    }, {updateOn: 'change'});
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

    this.regexService.get('agent').subscribe((regs: []) => {
      console.log(regs)
      this.regexes = regs;
      this.createForm();
    });
    this.agentStatusService.getAllList().subscribe(
      {
        next:
          (statuses: Agentstatus[]) => {
            this.agentStatuses = statuses;
          }, error: error => {
          console.error('Error fetching agent statuses:', error);
        }
      }
    )
    this.districtService.getAllList().subscribe(
      {
        next: (districts: District[]) => {
          this.districts = districts;
        }, error: error => {
          console.error('Error fetching districts:', error);
        }
      }
    )
    this.routeService.getAllList().subscribe(
      {
        next: (routes: Route[]) => {
          this.routes = routes;
        }, error: error => {
          console.error('Error fetching districts:', error);
        }
      }
    )

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
    this.getLastAgentCode()
  }

  createView() {
    this.loadTable("");
  }


  createForm() {
    this.form.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.form.controls['fullName'].setValidators([Validators.required, Validators.pattern(this.regexes['fullName']['regex'])]);
    this.form.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.form.controls['address'].setValidators([Validators.required]);
    this.form.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.form.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.form.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.form.controls['doRegisterd'].setValidators([Validators.required]);
    this.form.controls['agentStatus'].setValidators([Validators.required]);

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.form.controls) {
      const control = this.form.controls[controlName];
      control.valueChanges.subscribe(value => {


          if (controlName == "doRegisterd")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldagent != undefined && control.valid) {
            // @ts-ignore
            if (value === this.agent[controlName]) {
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
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'agent' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'agent' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'agent' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.agentService.getAll(query).subscribe({
      next: (emps: Agent[]) => {
        this.agents = emps;
        this.data = new MatTableDataSource(this.agents);
        this.data.paginator = this.paginator;
      }, error: (error) => {
        console.log(error);
      }
    });

  }


  btnSearchMc(): void {

    const sserchdata = this.ssearch.getRawValue();

    const number = sserchdata.ssnumber;
    const fullname = sserchdata.ssfullname;
    const nic = sserchdata.ssnic;
    const genderid = sserchdata.ssgender;
    const designationid = sserchdata.ssdesignation;

    let query = "";

    if (number != null && number.trim() != "") query = query + "&number=" + number;
    if (fullname != null && fullname.trim() != "") query = query + "&fullname=" + fullname;
    if (nic != null && nic.trim() != "") query = query + "&nic=" + nic;
    if (genderid != null) query = query + "&genderid=" + genderid;
    if (designationid != null) query = query + "&designationid=" + designationid;

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
        data: {heading: "Errors - Agent Add ", message: "You have following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.agent = this.form.getRawValue();

      let empdata = "";

      empdata = empdata + "<br>Number is : " + this.agent.number;
      empdata = empdata + "<br>Fullname is : " + this.agent.fullName;


      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Agent Add",
          message: "Are you sure to Add the following Agent? <br> <br>" + empdata
        }
      });

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          if (this.agent.land === undefined || this.agent.land === "") {
            // @ts-ignore
            this.agent.land = null;
          }
          this.agentService.add(this.agent).subscribe({
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


  fillForm(agent: Agent) {

    this.enableButtons(false, true, true);
    this.disableGenerateNo = true;

    this.selectedrow = agent;

    if (localStorage.getItem('agent')) {
      const loginAgent = JSON.parse(localStorage.getItem('agent') || '');
      this.disableModify = loginAgent.id === agent.id;
    }

    this.agent = JSON.parse(JSON.stringify(agent));
    this.oldagent = JSON.parse(JSON.stringify(agent));


    this.agent.agentStatus = this.agentStatuses.find(s => s.id === this.agent.agentStatus?.id);
    this.agent.district = this.districts.find(s => s.id === this.agent.district?.id);

    this.agent.route = this.routes.find(s => s.id === this.agent.route?.id);

    this.form.patchValue(this.agent);
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
        data: {heading: "Errors - Agent Update ", message: "You have the following Errors <br> " + errors}
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
            heading: "Updates - Agent Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("AgentService.update()");
            this.agent = this.form.getRawValue();
            if (this.agent.land !== undefined || this.agent.land === "") {
              // @ts-ignore
              this.agent.land = null;
            }

            this.agent.id = this.oldagent.id;
            this.agentService.update(this.agent).subscribe({
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
          data: {heading: "Confirmation - Agent Update", message: "Nothing Changed"}
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
        message: "Are you sure to Delete following Agent? <br> <br>" + this.agent.fullName
      }
    });
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.agentService.delete(this.agent.id).subscribe({
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

  clear(): void {
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '400px',
      data: {
        heading: "Confirmation - Agent Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    })
    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.resetForm()
      }
    });
  }

  resetForm() {
    this.form.reset();
    this.selectedrow = null;
    this.createForm();
    this.form.controls['description'].markAsPristine();
    this.form.controls['doRegisterd'].markAsPristine();
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    console.log("Name",this.authService.getUsername())
    this.form.get("logger")?.setValue(this.authService.getUsername());
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

  getLastAgentCode() {
    this.agentService.getLastAgentCode().subscribe(ecode => {
      console.log(ecode.code)
      this.lastEmpCode = ecode.code
      this.form.controls["number"].setValue(this.lastEmpCode)
    });

  }


  getColumnClass(columnIndex: number) {
    return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
  }
}
