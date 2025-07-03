import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/auth/authorizationmanager";
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent implements OnInit{

  opened = true;

  isNavigationActive = false;
  menuGroup: any[] = [];

  // Set Mat icons you need to add to Menus
  matIcons: any = {
    'Admin': 'person',
    'Academic': 'event_note',
    'Registration': 'assignment',
    'Class': 'schedule',
    'Inventory': 'description'
  };
  matSubMenuIcons: any = {
    'Employee': 'person',
    'User': 'event_note',
    'Privilege': 'assignment',
    'Material': 'widgets',
    'Product': 'inventory',
    'Paper': 'receipt_long',
    'Supplier': 'store'
  };
  userImage = 'assets/default.png'
  activeRole="";
  constructor(private router: Router, public authorizationManager: AuthorizationManager) {
  }

  logout(): void {
    this.authorizationManager.logout();
    // this.router.navigateByUrl("login")
    // this.authService.clearUsername();
    // this.authService.clearMenuState();
    // localStorage.removeItem("Authorization");
    // localStorage.removeItem("employee");
  }


  isMenuVisible(category: string): boolean {
    let isVisible = true;

    this.menuGroup.forEach((menuGroup: { Menu: string; MenuItems: { name: string; isVisible: boolean }[] }) => {

      if (menuGroup.Menu === category) {
        isVisible = menuGroup.MenuItems.some(menuItem => menuItem.isVisible);
      }
    });

    return isVisible;
  }

   ngOnInit() {
    this.menuGroup = this.authorizationManager.getNavListItem();
     this.menuGroup.forEach(e => {

       if (e.Menu === "REPORTS" && this.authorizationManager.getRoles()?.some(role => role.name === "Admin")) {
         e.MenuItems = e.MenuItems.map((item: any) => ({ ...item, isVisible: true }));
       }
     });
    this.authorizationManager.getAuth(this.authorizationManager.getUsername());
    this.userImage = this.authorizationManager.getUserProfile();
     // @ts-ignore
     this.activeRole = this.authorizationManager.getRoles()[0].name
  }



  private closeTimeout: any;

  // Open the menu
  openMenu(menuTrigger: MatMenuTrigger): void {
    this.cancelCloseMenu(); // Ensure no pending close action
    menuTrigger.openMenu(); // Open the menu
  }

  // Schedule the menu to close
  scheduleCloseMenu(): void {
    this.closeTimeout = setTimeout(() => {
      this.closeActiveMenu();
    }, 300); // Delay before closing
  }

  // Cancel the close operation
  cancelCloseMenu(): void {
    clearTimeout(this.closeTimeout); // Clear any existing close timeout
  }

  // Close the active menu (if any)
  private closeActiveMenu(): void {
    const activeMenu = document.querySelector('.mat-menu-panel.mat-menu-open');
    if (activeMenu) {
      const menuInstance = activeMenu.getAttribute('aria-controls');
      const menuElement = document.getElementById(menuInstance || '');
      if (menuElement) {
        menuElement.dispatchEvent(new Event('mouseleave')); // Simulate menu close
      }
    }
  }



  toggleMenu(): void {
    this.isNavigationActive = !this.isNavigationActive;
  }

  checkIsAdmin() {
    return localStorage.getItem("username") !="Admin"
  }
}



