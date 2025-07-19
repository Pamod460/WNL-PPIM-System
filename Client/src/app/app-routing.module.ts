import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {PrivilageComponent} from "./view/modules/privilage/privilage.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";
import {ProfileComponent} from "./view/profile/profile.component";
import {AuthGuard} from "./guard/auth.guard";
import {MaterialComponent} from "./view/modules/material/material.component";
import {SupplierComponent} from "./view/modules/supplier/supplier.component";
import {ProductComponent} from "./view/modules/product/product.component";
import {PaperComponent} from "./view/modules/paper/paper.component";
import {AgentComponent} from "./view/modules/agent/agent.component";
import {VehicleComponent} from "./view/modules/vehicle/vehicle.component";
import {RouteComponent} from "./view/modules/route/route.component";
import {CountByDisctrictComponent} from "./report/view/count-by-disctrict/count-by-disctrict.component";
import {PaperPurchaseOrderReportComponent} from "./report/view/paper-purchase-order-report/paper-purchase-order-report.component";
import {CountByDesignationComponent} from "./report/view/countbydesignation/countbydesignation.component";
import {MaterialporderComponent} from "./view/modules/materialporder/materialporder.component";
import {PaperporderComponent} from "./view/modules/paperporder/paperporder.component";
import {MaterialgrnComponent} from "./view/modules/materialgrn/materialgrn.component";
import {PapergrnComponent} from "./view/modules/papergrn/papergrn.component";
import {SupplierpaymentComponent} from "./view/modules/supplierpayment/supplierpayment.component";
import {ProductdesignComponent} from "./view/modules/productdesign/productdesign.component";
import {ProductionorderComponent} from "./view/modules/productionorder/productionorder.component";
import {PaperissueComponent} from "./view/modules/paperissue/paperissue.component";
import {MaterialissueComponent} from "./view/modules/materialissue/materialissue.component";
import {AgentorderComponent} from "./view/modules/agentorder/agentorder.component";
import {DistributionComponent} from "./view/modules/distribution/distribution.component";
import {AgentpaymentComponent} from "./view/modules/agentpayment/agentpayment.component";
import {LandingPageComponent} from "./public/landing-page/landing-page.component";
import {AgentRegisterComponent} from "./public/agent-register/agent-register.component";
import {WelcomeComponent} from "./public/welcome/welcome.component";
import {AgentOrderPublicComponent} from "./public/agent-order-public/agent-order-public.component";
import {DashboardGuard} from "./guard/dashboard.guard";
import {AgentOrderReportComponent} from "./report/view/agent-order-report/agent-order-report.component";
import {PorderSummryReportComponent} from "./report/view/porder-summry-report/porder-summry-report.component";
import {StockLevelReportComponent} from "./report/view/stock-level-report/stock-level-report.component";

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: 'login', pathMatch: 'full'},
  {
    path: "main",
    component: MainwindowComponent,
    children: [
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "profile", component: ProfileComponent},
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path: "privilege", component: PrivilageComponent},
      {path: "material", component: MaterialComponent,canActivate:[DashboardGuard]},
      {path: "supplier", component: SupplierComponent,canActivate:[DashboardGuard]},
      {path: "product", component: ProductComponent,canActivate:[DashboardGuard]},
      {path: "paper", component: PaperComponent,canActivate:[DashboardGuard]},
      {path: "agent", component: AgentComponent,canActivate:[DashboardGuard]},
      {path: "vehicle", component: VehicleComponent,canActivate:[DashboardGuard]},
      {path: "route", component: RouteComponent},
      {path: "materialpurchaseorder", component: MaterialporderComponent},
      {path: "paperpurchaseorder", component: PaperporderComponent},
      {path: "materialgrn", component: MaterialgrnComponent},
      {path: "papergrn", component: PapergrnComponent},
      {path: "supplierpayment", component: SupplierpaymentComponent},
      {path: "productdesign", component: ProductdesignComponent},
      {path: "productionorder", component: ProductionorderComponent},
      {path: "paperissue", component: PaperissueComponent},
      {path: "materialissue", component: MaterialissueComponent},
      {path: "agentorder", component: AgentorderComponent},
      {path: "distribution", component: DistributionComponent},
      {path: "agentpayment", component: AgentpaymentComponent},

      //Report
      {path: "employeesreport", component: CountByDesignationComponent},
      {path: "purchaseorderreport", component: PaperPurchaseOrderReportComponent},
      {path: "agentsreport", component: CountByDisctrictComponent},
      {path: "agentcoutbyorders", component: AgentOrderReportComponent},
      {path: "paperpordersummry", component: PorderSummryReportComponent},
      {path: "materialinventory", component: StockLevelReportComponent},
    ],canActivate:[AuthGuard]
  },
  {path:"public", component:LandingPageComponent,
  children:[
    {path:"agentregister", component:AgentRegisterComponent},
    {path:"agentorder", component:AgentOrderPublicComponent},
    {path:"welcome", component: WelcomeComponent}

  ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
