import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AgentService} from "../../service/agent/agent.service";
import {DistrictService} from "../../service/agent/district.service";
import {RouteService} from "../../service/route/route.service";
import {District} from "../../entity/District";
import {Route} from "../../entity/Route";
import {DatePipe} from "@angular/common";
import {Agent} from "../../entity/agent";
import {RegexService} from "../../service/Shared/regex.service";

@Component({
  selector: 'app-agent-register',
  templateUrl: './agent-register.component.html',
  styleUrls: ['./agent-register.component.css']
})
export class AgentRegisterComponent implements OnInit {
  registrationForm: FormGroup;
  districts: any[] = [];
  routes: any[] = [];
  submitted = false;
   oldagent?: Agent;
  regexes: any;

  constructor(private fb: FormBuilder, private agentService: AgentService,private districtService: DistrictService,
              private regexService: RegexService,
              private datePipe: DatePipe,
              private routeService: RouteService,) {
    this.registrationForm = this.fb.group({
      number: new FormControl('', [Validators.required]),
      nic: new FormControl('', [Validators.required]),
      fullName: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      land: new FormControl(''),
      address: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      doRegisterd: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      logger: new FormControl(),
      district: new FormControl(null, Validators.required),
      route: new FormControl(null, Validators.required),
      agentStatus: new FormControl(null, Validators.required)
    });


  }

  ngOnInit(): void {
    this.initialize();

  }

  initialize(): void {
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

    this.regexService.get('agent').subscribe((regs: []) => {
      console.log(regs)
      this.regexes = regs;
      this.createForm();
    });
    this.agentService.getLastAgentCode().subscribe(ecode => {

      this.registrationForm.controls["number"].setValue(ecode.code)
    });
  }

  createForm() {
    this.registrationForm.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
    this.registrationForm.controls['fullName'].setValidators([Validators.required, Validators.pattern(this.regexes['fullName']['regex'])]);
    this.registrationForm.controls['nic'].setValidators([Validators.required, Validators.pattern(this.regexes['nic']['regex'])]);
    this.registrationForm.controls['address'].setValidators([Validators.required]);
    this.registrationForm.controls['mobile'].setValidators([Validators.required, Validators.pattern(this.regexes['mobile']['regex'])]);
    this.registrationForm.controls['land'].setValidators([Validators.pattern(this.regexes['land']['regex'])]);
    this.registrationForm.controls['email'].setValidators([Validators.required, Validators.pattern(this.regexes['email']['regex'])]);
    this.registrationForm.controls['doRegisterd'].setValidators([Validators.required]);
    this.registrationForm.controls['agentStatus'].setValidators([Validators.required]);

    Object.values(this.registrationForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.registrationForm.controls) {
      const control = this.registrationForm.controls[controlName];
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
  }

  get fullNameControl() { return this.registrationForm.get('fullName'); }
  get nicControl() { return this.registrationForm.get('nic'); }
  get emailControl() { return this.registrationForm.get('email'); }
  get mobileControl() { return this.registrationForm.get('mobile'); }
  get addressControl() { return this.registrationForm.get('address'); }
  get districtControl() { return this.registrationForm.get('district'); }
  get routeControl() { return this.registrationForm.get('route'); }

  onSubmit(): void {
    this.registrationForm.get('logger')?.setValue("Agent")
    this.registrationForm.get('agentStatus')?.setValue({id: 1, name: 'Active'});
    console.log(this.registrationForm.getRawValue());
    this.submitted = true;
    if (this.registrationForm.valid) {
      this.agentService.add(this.registrationForm.value).subscribe({
        next: () => {
          this.registrationForm.reset();
          this.submitted = false;
        },
        error: () => alert('Registration failed. Please try again.')
      });
    }
  }
}
