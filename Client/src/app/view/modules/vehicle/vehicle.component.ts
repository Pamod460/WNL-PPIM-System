import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";

import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/auth/authorizationmanager";
import {ToastrService} from "ngx-toastr";

import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {VehicleService} from "../../../service/vehicle/vehicle.service";
import {Vehicle} from "../../../entity/vehicle";
import {VehiclestatusService} from "../../../service/vehicle/vehiclestatus.service";
import {VehicleStatus} from "../../../entity/vehiclestatus";
import {VehicletypeService} from "../../../service/vehicle/vehicletype.service";
import {VehicleType} from "../../../entity/vehicletype";

import {VehiclemodelService} from "../../../service/vehicle/vehiclemodel.service";
import {VehicleModel} from "../../../entity/vehiclemodel";
import {RegexService} from "../../../service/Shared/regex.service";
import {TableUtilsService} from "../../../service/Shared/table-utils.service";

@Component({
    selector: 'app-vehicle',
    templateUrl: './vehicle.component.html',
    styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {


    columns: string[] = ['number', 'yom', 'vehicleStatus', 'vehicleType'];
    headers: string[] = ['Number', 'YOM', 'Status', 'Type'];
    binders: string[] = ['number', 'yom', 'vehicleStatus.name', 'vehicleType.name'];

    public search!: FormGroup;
    public form!: FormGroup;

    disableModify = false;

    vehicle!: Vehicle;
    oldVehicle!: Vehicle;

    selectedrow: any;

    vehicles: Vehicle[] = [];
    data!: MatTableDataSource<Vehicle>;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    enaadd = false;
    enaupd = false;
    enadel = false;

    hasInsertAuthority = false;
    hasUpdateAuthority = false;
    hasDeleteAuthority = false;

    vehicleStatuses: VehicleStatus[] = [];
    vehicleTypes: VehicleType[] = [];
    vehicleModels: VehicleModel[] = [];


    regexes: any;

    uiassist: UiAssist;

    doaMaxDate: Date = new Date();

    constructor(
        private vehicleService: VehicleService,
        private vehicletypeService: VehicletypeService,
        private vehiclestatusService: VehiclestatusService,
        private vehiclemodelService: VehiclemodelService,
        private regexService: RegexService,
        private formBuilder: FormBuilder,
        private matDialog: MatDialog,
        private datePipe: DatePipe,
        public authService: AuthorizationManager,
        private toastrService: ToastrService,
        private tableUtils: TableUtilsService
    ) {
        this.uiassist = new UiAssist(this);
        this.search = this.formBuilder.group({
            "number": new FormControl(),
            "vehiclestatus": new FormControl(),
            "vehicletype": new FormControl(),
        });
        this.form = this.formBuilder.group({
            "number": new FormControl('', [Validators.required]),
            "doAttached": new FormControl('', [Validators.required]),
            "yom": new FormControl('', [Validators.required]),
            "curruntMeterReading": new FormControl('', [Validators.required]),
            "capacity": new FormControl('', [Validators.required]),
            "lastRegDate": new FormControl('', [Validators.required]),
            "vehicleStatus": new FormControl('', [Validators.required]),
            "vehicleType": new FormControl('', [Validators.required]),
            "vehicleModel": new FormControl('', [Validators.required]),
            "description": new FormControl('', [Validators.required]),
            "logger": new FormControl('', [Validators.required]),
        }, {updateOn: 'change'});

    }

    ngOnInit() {
        this.initialize();
    }

    initialize() {

        this.createView();

        this.vehiclestatusService.getAll().subscribe(response => {
            this.vehicleStatuses = response;
        });

        this.vehicletypeService.getAll().subscribe(response => {
            this.vehicleTypes = response;
        });

        this.vehiclemodelService.getAll().subscribe(response => {
            this.vehicleModels = response;
        });



        this.regexService.get('vehicle').subscribe((regs: []) => {
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

        this.form.controls['number'].setValidators([Validators.required, Validators.pattern(this.regexes['number']['regex'])]);
        this.form.controls['doattached'].setValidators(Validators.required);
        this.form.controls['yom'].setValidators([Validators.required, Validators.pattern(this.regexes['yom']['regex'])]);
        this.form.controls['currentmeterreading'].setValidators([Validators.required, Validators.pattern(this.regexes['currentmeterreading']['regex'])]);
        this.form.controls['capacity'].setValidators([Validators.required, Validators.pattern(this.regexes['capacity']['regex'])]);
        this.form.controls['lastregdate'].setValidators(Validators.required);

        this.form.controls['vehiclestatus'].setValidators(Validators.required);
        this.form.controls['vehicletype'].setValidators(Validators.required);
        this.form.controls['vehiclemodel'].setValidators(Validators.required);
        this.form.controls['description'].setValidators([Validators.required, Validators.pattern(this.regexes['description']['regex'])]);

        Object.values(this.form.controls).forEach(control => {
            control.markAsTouched();
        });

        for (const controlName in this.form.controls) {
            const control = this.form.controls[controlName];
            control.valueChanges.subscribe(value => {

                    // @ts-ignore
                    if (controlName == "doattached" || controlName == "lastregdate")
                        value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

                    if (this.oldVehicle != undefined && control.valid) {
                        // @ts-ignore
                        if (value === this.vehicle[controlName]) {
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
        this.hasInsertAuthority = authorities.some(authority => authority.module === 'vehicle' && authority.operation === 'insert');
        this.hasUpdateAuthority = authorities.some(authority => authority.module === 'vehicle' && authority.operation === 'update');
        this.hasDeleteAuthority = authorities.some(authority => authority.module === 'vehicle' && authority.operation === 'delete');
    }

    loadTable(query: string) {

        this.vehicleService.getAll(query).subscribe(response => {
            this.vehicles = response;
            this.data = new MatTableDataSource(this.vehicles);
            this.data.paginator = this.paginator;
        });

    }

    btnSearchMc(): void {

        const serchdata = this.search.getRawValue();
        console.log(serchdata)

        const number = serchdata.number;
        const vehiclestatusid = serchdata.vehiclestatus;
        const vehicletypeid = serchdata.vehicletype;


        let query = "";

        if (number != null && number.trim() != "") query = query + "&number=" + number;
        if (vehiclestatusid != null) query = query + "&vehiclestatusid=" + vehiclestatusid;
        if (vehicletypeid != null) query = query + "&vehicletypeid=" + vehicletypeid;


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
                this.search.reset();
                this.loadTable("");
            }
        });

    }


    add() {

        const errors = this.getErrors();

        if (errors != "") {
            const errmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Errors - Vehicle Add ", message: "You have following Errors <br> " + errors}
            });
            errmsg.afterClosed().subscribe(async result => {
                if (!result) {
                    return;
                }
            });
        } else {

            this.vehicle = this.form.getRawValue();
            this.vehicle.doAttached = this.datePipe.transform(this.form.controls['doattached'].value, 'yyyy-MM-dd') || "";
            this.vehicle.lastRegDate = this.datePipe.transform(this.form.controls['lastregdate'].value, 'yyyy-MM-dd') || "";
            let vehicledata = "";

            vehicledata = vehicledata + "<br>Number is : " + this.vehicle.number;
            vehicledata = vehicledata + "<br>Type is : " + this.vehicle.vehicleType?.name;
            vehicledata = vehicledata + "<br>Model is : " + this.vehicle.vehicleModel?.name;

            const confirm = this.matDialog.open(ConfirmComponent, {
                width: '500px',
                data: {
                    heading: "Vehicle Add",
                    message: "Are you sure to Add the following Vehicle? <br> <br>" + vehicledata
                }
            });

            confirm.afterClosed().subscribe(async result => {
                if (result) {
                    this.vehicleService.add(this.vehicle).subscribe({
                        next: (response) => {
                            this.toastrService.success(response.message).onShown.subscribe(() => {
                                this.form.reset();
                                Object.values(this.form.controls).forEach(control => {
                                    control.markAsTouched();
                                });
                                this.loadTable("");
                            })
                        }, error: (error) => {
                            this.toastrService.error(error.error.data.message);
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


    fillForm(vehicle: Vehicle) {

        this.enableButtons(false, true, true);
        this.selectedrow = vehicle;

        this.vehicle = JSON.parse(JSON.stringify(vehicle));
        this.oldVehicle = JSON.parse(JSON.stringify(vehicle));
        //@ts-ignore
        this.vehicle.vehicleStatus = this.vehicleStatuses.find(s => s.id === this.vehicle.vehicleStatus?.id);
        //@ts-ignore
        this.vehicle.vehicleModel = this.vehicleModels.find(m => m.id === this.vehicle.vehicleModel?.id);
        //@ts-ignore
        this.vehicle.vehicleType = this.vehicleTypes.find(t => t.id === this.vehicle.vehicleType?.id);

        this.form.patchValue(this.vehicle);
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
                data: {heading: "Errors - Vehicle Update ", message: "You have the following Errors <br> " + errors}
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
                        heading: "Updates - Vehicle Update",
                        message: "Are you sure to Save following Updates? <br> <br>" + updates
                    }
                });
                confirm.afterClosed().subscribe(async result => {
                    if (result) {
                        this.vehicle = this.form.getRawValue();
                        this.vehicle.id = this.oldVehicle.id;
                        this.vehicle.doAttached = this.datePipe.transform(this.form.controls['doAttached'].value, 'yyyy-MM-dd') || "";
                        this.vehicle.lastRegDate = this.datePipe.transform(this.form.controls['lastRegDate'].value, 'yyyy-MM-dd') || "";
                        this.vehicleService.update(this.vehicle).subscribe({
                            next: (response) => {
                                this.toastrService.success(response.message).onShown.subscribe(() => {
                                    this.form.reset();
                                    Object.values(this.form.controls).forEach(control => {
                                        control.markAsTouched();
                                    });
                                    this.loadTable("");
                                    this.enableButtons(true, false, false)
                                })
                            }, error: (error) => {
                                this.toastrService.error('Failed! ' + error.error.data.message);
                            }
                        });
                    }
                });
            } else {
                const updmsg = this.matDialog.open(MessageComponent, {
                    width: '500px',
                    data: {heading: "Confirmation - Vehicle Update", message: "Nothing Changed"}
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
                message: "Are you sure to Delete following Vehicle? <br> <br>" + this.vehicle.number
            }
        });
        confirm.afterClosed().subscribe(async result => {
            if (result) {
                this.vehicleService.delete(this.vehicle.id).subscribe({
                    next: (response) => {
                        this.toastrService.success(response.message).onShown.subscribe(() => {
                            this.form.reset();
                            Object.values(this.form.controls).forEach(control => {
                                control.markAsTouched();
                            });
                            this.loadTable("");
                            this.enableButtons(true, false, false);
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
                heading: "Confirmation - Vehicle Clear",
                message: "Are you sure to Clear following Details ? <br> <br>"
            }
        });

        confirm.afterClosed().subscribe(async result => {
            if (result) {
                this.form.reset();
                this.selectedrow = null;
                this.createForm();
                // this.form.controls['description'].markAsPristine();
                // this.form.controls['doassignment'].markAsPristine();
            }
        });
    }

    checkVehicleStatus(statusId: string) {
        switch (statusId) {
            case "Available":
                return "text-success-light";
            case "At Maintainance":
                return "text-danger-light";
            case "Unavailable":
                return "text-danger-light";
            case "Down":
                return "text-danger-light";
            default:
                return "";
        }
    }

    getColumnClass(columnIndex: number) {
        return this.tableUtils.getColumnSizeClass(this.data, this.binders, columnIndex, this.uiassist);
    }

}
