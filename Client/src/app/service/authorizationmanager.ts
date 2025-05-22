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

  // please define all local storage suitable for relevant Main Menu name like below
  // Ex : Main Menu -> Report
  //  Then LocalStorage -> 'localstorageReportMenus'

  private readonly localStorageAdminMenus = 'admMenuState';
  private readonly localStorageAcademicMenus = 'acdMenuState';
  private readonly localStorageRegistrationMenus = 'regMenuState';
  private readonly localStorageClassMenus = 'clsMenuState';

  Admin = [
    {name: 'Employee', isVisible: false, routerLink: 'employee'},
    {name: 'User', isVisible: false, routerLink: 'user'},
    {name: 'Privilege', isVisible: false, routerLink: 'privilege'}
    // { name: 'Operations', isVisible: false, routerLink: 'operation' }
  ];

  Inventory = [
    {name: 'Material', isVisible: false, routerLink: 'material'},
    {name: 'Product', isVisible: false, routerLink: 'product'},
    {name: 'Paper', isVisible: false, routerLink: 'paper'},
  ];
  Registration = [
    {name: 'Supplier', isVisible: false, routerLink: 'supplier'},
  ]


  getNavListItem() {
    return [
      {Menu: 'ADMIN', MenuItems: this.Admin},
      {Menu: 'INVENTORY', MenuItems: this.Inventory},
      {Menu: 'Registration', MenuItems: this.Registration}
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      localStorage.setItem(this["localStorage" + menuGroup.Menu + "Menus"], JSON.stringify(menuGroup));
    });

  }

  getAuth(username: string) {
    console.log("username", username)
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const localStorageState = localStorage.getItem(this['localStorage' + menuState.Menu + 'Menus']);
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      localStorage.removeItem(this['localStorage' + menu.Menu + 'Menus']);
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
