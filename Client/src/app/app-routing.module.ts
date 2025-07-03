import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./view/login/login.component";
import {MainwindowComponent} from "./view/mainwindow/mainwindow.component";
import {EmployeeComponent} from "./view/modules/employee/employee.component";
import {HomeComponent} from "./view/home/home.component";
import {UserComponent} from "./view/modules/user/user.component";
import {ArrearsByProgramComponent} from "./report/view/arrearsbyprogram/arrearsbyprogram.component";
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
      {path: "material", component: MaterialComponent},
      {path: "supplier", component: SupplierComponent},
      {path: "product", component: ProductComponent},
      {path: "paper", component: PaperComponent},
      {path: "agent", component: AgentComponent},
      {path: "vehicle", component: VehicleComponent},
      {path: "route", component: RouteComponent},
      {path: "reports", component: ArrearsByProgramComponent},
      {path: "materialpurchaseorder", component: MaterialporderComponent},
      {path: "paperpurchaseorder", component: PaperporderComponent},
    ],canActivate:[AuthGuard]
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
