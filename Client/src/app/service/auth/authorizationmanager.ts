import {Injectable} from '@angular/core';
import {UserService} from "../user/user.service";
import {jwtDecode} from "jwt-decode";
import {CustomJwtPayload} from "../../entity/customJwtPayload";
import {BehaviorSubject, filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {LogoutComponent} from "../../util/dialog/logout/logout.component";

@Injectable()
export class AuthorizationManager {

  private isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  public imageempurl!: string;

  private readonly localStorageUsreName = 'username';
  private readonly localStorageFullName = 'fullname';


  Admin = [
    {name: 'Employee', isVisible: false, routerLink: 'employee', icon: 'person'},
    {name: 'User', isVisible: false, routerLink: 'user', icon: 'event_note'},
    {name: 'Privilege', isVisible: false, routerLink: 'privilege', icon: 'assignment'}

  ];

  Inventory = [
    {name: 'Material', isVisible: false, routerLink: 'material', icon: 'widgets'},
    {name: 'Product', isVisible: false, routerLink: 'product', icon: 'widgets'},
    {name: 'Paper', isVisible: false, routerLink: 'paper', icon: 'inventory'},
  ];
  Registration = [
    {name: 'Supplier', isVisible: false, routerLink: 'supplier', icon: 'store'},
    {name: 'Agent', isVisible: false, routerLink: 'agent', icon: 'person'},
  ]
  Distribution = [
    {name: 'Vehicle', isVisible: false, routerLink: 'vehicle', icon: 'directions_car'},
    {name: 'Route', isVisible: false, routerLink: 'route', icon: 'map'},
  ]
  PurchaseOrder = [
    {name: 'Material POrder', isVisible: false, routerLink: 'materialpurchaseorder', icon: 'inventory'},
    {name: 'Paper POrder', isVisible: false, routerLink: 'paperpurchaseorder', icon: 'description'}
  ]
  Report = [
    {name: 'Agents Report', isVisible: false, routerLink: 'agentsreport', icon: 'assignment'},
    {name: 'Employees Report', isVisible: false, routerLink: 'employeesreport', icon: 'assignment'},
    {name: 'Purchase Order Report', isVisible: false, routerLink: 'purchaseorderreport', icon: 'assignment'}
  ];

  getNavListItem() {
    return [
      {Menu: 'ADMIN', MenuItems: this.Admin},
      {Menu: 'INVENTORY', MenuItems: this.Inventory},
      {Menu: 'REGISTRATION', MenuItems: this.Registration},
      {Menu: 'DISTRIBUTION', MenuItems: this.Distribution},
      {Menu: 'PURCHASE ORDER', MenuItems: this.PurchaseOrder},
      {Menu: 'REPORTS', MenuItems: this.Report}
    ]
  }

  constructor(private userService: UserService, private router: Router, private dialog: MatDialog,) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });
  }

  enableMenus(modules: { module: string; operation: string }[]): void {
    const menus = this.getNavListItem();
    menus.forEach(menuGroup => {
      menuGroup.MenuItems.forEach(menuItem => {
        menuItem.isVisible = modules.some(module => module.module.toLowerCase() === menuItem.name.toLowerCase());
      });
    });

    menus.forEach(menuGroup => {

      localStorage.setItem(menuGroup.Menu + "Menus", JSON.stringify(menuGroup));
    });

  }

  getAuth(username: string) {
    if (username) {
      this.setFullName();
      this.setUsername(username);
      try {
        const authoritiesArray = this.getAuthorities();
        if (username !== "Admin")
          this.userService.getEmployeeByUserName(username).subscribe({
            next: employee => {
              this.setEmployee(employee);
              this.setUserProfile();
            }, error: err => {
              console.log(err)
            }
          });
        this.setUserProfile();
        if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
          const authorities = this.extractAuthorities(authoritiesArray);
          this.enableMenus(authorities);
        } else {
          console.log('Authorities are undefined or not an array');
        }

      } catch (error) {
        console.error(error);
      }
    }
  }


  extractAuthorities(authoritiesArray: string[]): { module: string; operation: string }[] {
    return authoritiesArray.map(authority => {
      const [module, operation] = authority.split('-');
      return {module, operation};
    });
  }

  getUsername(): string {
    return localStorage.getItem(this.localStorageUsreName) || '';
  }

  getFullName(): string {
    return localStorage.getItem(this.localStorageFullName) || '';
  }

  getToken() {
    const jwtToken = localStorage.getItem("Authorization");
    if (jwtToken != null) return jwtToken.split(' ')[1]
    else return ""

  }

  private hasToken(): boolean {
    const token = localStorage.getItem("Authorization");
    return token !== null;
  }

  private checkAuthStatus(): void {
    this.isAuthenticated.next(this.hasToken());
  }

  isUserAuthenticated() {
    return this.isAuthenticated.asObservable();
  }

  setFullName(): void {
    const jwtToken = this.getToken()
    const value = jwtToken ? jwtDecode<CustomJwtPayload>(jwtToken).uname : '';

    // @ts-ignore
    localStorage.setItem(this.localStorageFullName, value);
  }

  setUsername(value: string): void {
    localStorage.setItem(this.localStorageUsreName, value);
  }

  setEmployee(employee: any): void {
    localStorage.setItem('employee', JSON.stringify(employee));
  }

  setUserProfile(): void {
    const employee = localStorage.getItem('employee');
    if (employee) {
      const img = JSON.parse(employee).photo;
      if (img) {
        this.imageempurl = atob(img);
      } else {
        this.imageempurl = "assets/default.png";
      }
    } else {
      this.imageempurl = "assets/default.png";
    }
  }

  getAuthorities() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const jwtToken = localStorage.getItem("Authorization").split(' ')[1];
    return jwtDecode<CustomJwtPayload>(jwtToken).aud;
  }

  getRoles() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const jwtToken = localStorage.getItem("Authorization").split(' ')[1];

    return jwtDecode<CustomJwtPayload>(jwtToken).roles;
  }

  getUserProfile(): string {
    return this.imageempurl;
  }

  initializeMenuState(): void {

    const menus = this.getNavListItem();

    menus.forEach(menuState => {

      const localStorageState = localStorage.getItem(menuState.Menu + 'Menus');
      if (localStorageState) {
        menuState.Menu = JSON.parse(localStorageState);
      }
    });
  }

  clearUsername(): void {
    localStorage.removeItem(this.localStorageUsreName);
  }

  clearMenuState(): void {
    const menus = this.getNavListItem();
    menus.forEach(menu => {

      localStorage.removeItem(menu.Menu + 'Menus');
    });
  }


  removeToken() {
    localStorage.removeItem("Authorization")
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutComponent);

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.performLogout();
      }
    });
  }

  performLogout(): void {
    this.clearUsername();
    this.clearMenuState();
    localStorage.removeItem("Authorization");
    localStorage.removeItem("employee");
    localStorage.removeItem("fullname");
    this.router.navigateByUrl("/login");
  }
}
