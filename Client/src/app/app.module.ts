import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HomeComponent} from './view/home/home.component';
import {LoginComponent} from './view/login/login.component';
import {MainwindowComponent} from './view/mainwindow/mainwindow.component';
import {EmployeeComponent} from './view/modules/employee/employee.component';
import {UserComponent} from './view/modules/user/user.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from "./service/employeeservice";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatPseudoCheckboxModule} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import { ArrearsByProgramComponent } from './report/view/arrearsbyprogram/arrearsbyprogram.component';
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {MatChipsModule} from "@angular/material/chips";
import { PrivilageComponent } from './view/modules/privilage/privilage.component';
import {JwtInterceptor} from "./service/JwtInterceptor";
import {AuthorizationManager} from "./service/authorizationmanager";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonLayoutComponent} from "./util/layout/common-layout/common-layout.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import {MatMenuModule} from "@angular/material/menu";
import { ProfileComponent } from './view/profile/profile.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    EmployeeComponent,
    UserComponent,
    ConfirmComponent,
    ArrearsByProgramComponent,
    CountByDesignationComponent,
    MessageComponent,
    PrivilageComponent,
    DashboardComponent,
    ProfileComponent,


  ],
    imports: [
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatGridListModule,
        MatCardModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatExpansionModule,
        MatIconModule,
        MatDialogModule,
        HttpClientModule,
        MatChipsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatPseudoCheckboxModule,
        MatCheckboxModule,
        CommonLayoutComponent,
        NgbModule,
        MatMenuModule,
    ],
  providers: [
    EmployeeService,
    DatePipe,
    AuthorizationManager,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  exports: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
