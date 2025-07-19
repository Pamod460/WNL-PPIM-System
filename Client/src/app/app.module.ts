import {NgModule} from '@angular/core';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';

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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatIconModule, MatIconRegistry} from "@angular/material/icon";
import {MessageComponent} from "./util/dialog/message/message.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {EmployeeService} from "./service/employee/employee.service";
import {MatSelectModule} from "@angular/material/select";
import {ConfirmComponent} from "./util/dialog/confirm/confirm.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, MatPseudoCheckboxModule} from "@angular/material/core";
import {DatePipe} from "@angular/common";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {MatChipsModule} from "@angular/material/chips";
import { PrivilageComponent } from './view/modules/privilage/privilage.component';
import {JwtInterceptor} from "./interceptor/JwtInterceptor";
import {AuthorizationManager} from "./service/auth/authorizationmanager";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CommonLayoutComponent} from "./util/layout/common-layout/common-layout.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import {MatMenuModule} from "@angular/material/menu";
import { ProfileComponent } from './view/profile/profile.component';
import { MaterialComponent } from './view/modules/material/material.component';
import {ToastrModule} from "ngx-toastr";
import { LogoutComponent } from './util/dialog/logout/logout.component';
import { SupplierComponent } from './view/modules/supplier/supplier.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import { ProductComponent } from './view/modules/product/product.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import { PaperComponent } from './view/modules/paper/paper.component';
import {
  ChecklistDialogComponent
} from "./util/dialog/material-checklist-dialog/checklist-dialog.component";
import { AgentComponent } from './view/modules/agent/agent.component';
import {VehicleComponent} from "./view/modules/vehicle/vehicle.component";
import { RouteComponent } from './view/modules/route/route.component';
import { MaterialporderComponent } from './view/modules/materialporder/materialporder.component';
import {MatTabsModule} from "@angular/material/tabs";
import { PaperporderComponent } from './view/modules/paperporder/paperporder.component';
import { CountByDisctrictComponent } from './report/view/count-by-disctrict/count-by-disctrict.component';
import { PaperPurchaseOrderReportComponent } from './report/view/paper-purchase-order-report/paper-purchase-order-report.component';
import {CapitalizePipe} from "./util/layout/pipe/capitalize.pipe";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { WelcomeComponent } from './public/welcome/welcome.component';
import { MaterialgrnComponent } from './view/modules/materialgrn/materialgrn.component';
import { PapergrnComponent } from './view/modules/papergrn/papergrn.component';
import { SupplierpaymentComponent } from './view/modules/supplierpayment/supplierpayment.component';
import { ProductdesignComponent } from './view/modules/productdesign/productdesign.component';
import { ProductionorderComponent } from './view/modules/productionorder/productionorder.component';
import {ImageUploaderComponent} from "./util/image-uploader/image-uploader.component";
import {FileUploadModule} from "@iplab/ngx-file-upload";
import { PaperissueComponent } from './view/modules/paperissue/paperissue.component';
import { MaterialissueComponent } from './view/modules/materialissue/materialissue.component';
import { AgentorderComponent } from './view/modules/agentorder/agentorder.component';
import { DistributionComponent } from './view/modules/distribution/distribution.component';
import { AgentpaymentComponent } from './view/modules/agentpayment/agentpayment.component';
import {ApproveButtonComponent} from "./util/approve-button/approve-button.component";
import { SortPipe } from './util/layout/pipe/sort.pipe';
import {NgChartsModule} from "ng2-charts";
import {CustomBreadcrumbComponent} from "./util/layout/custom-breadcrumb/custom-breadcrumb.component";
import {ReportComponent} from "./util/report/report.component";
import { LandingPageComponent } from './public/landing-page/landing-page.component';
import { AgentRegisterComponent } from './public/agent-register/agent-register.component';
import { AgentOrderPublicComponent } from './public/agent-order-public/agent-order-public.component';
import { InventoryRopChartComponent } from './view/dashboard/inventory-rop-chart/inventory-rop-chart.component';
import { AgentOrderReportComponent } from './report/view/agent-order-report/agent-order-report.component';
import { PorderApprovalReportComponent } from './report/view/porder-approval-report/porder-approval-report.component';
import { PorderSummryReportComponent } from './report/view/porder-summry-report/porder-summry-report.component';
import { StockLevelReportComponent } from './report/view/stock-level-report/stock-level-report.component';
import { SupplierPaymentReportComponent } from './report/view/supplier-payment-report/supplier-payment-report.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainwindowComponent,
    EmployeeComponent,
    UserComponent,
    ConfirmComponent,
    CountByDesignationComponent,
    MessageComponent,
    PrivilageComponent,
    DashboardComponent,
    ProfileComponent,
    MaterialComponent,
    LogoutComponent,
    SupplierComponent,
    ProductComponent,
    PaperComponent,
    AgentComponent,
    VehicleComponent,
    RouteComponent,
    MaterialporderComponent,
    PaperporderComponent,
    CountByDisctrictComponent,
    PaperPurchaseOrderReportComponent,
    WelcomeComponent,
    MaterialgrnComponent,
    PapergrnComponent,
    SupplierpaymentComponent,
    ProductdesignComponent,
    ProductionorderComponent,
    PaperissueComponent,
    MaterialissueComponent,
    AgentorderComponent,
    DistributionComponent,
    AgentpaymentComponent,
    SortPipe,
    LandingPageComponent,
    AgentRegisterComponent,
    AgentOrderPublicComponent,
    InventoryRopChartComponent,
    AgentOrderReportComponent,
    PorderApprovalReportComponent,
    PorderSummryReportComponent,
    StockLevelReportComponent,
    SupplierPaymentReportComponent

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
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true
    }),
    FormsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    ChecklistDialogComponent,
    MatTabsModule,
    CapitalizePipe,
    MatRadioModule,
    MatButtonToggleModule,
    ImageUploaderComponent,
    FileUploadModule,
    ApproveButtonComponent,
    NgChartsModule,
    CustomBreadcrumbComponent,
    ReportComponent,

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
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.registerFontClassAlias('material-icons');
  }
}
