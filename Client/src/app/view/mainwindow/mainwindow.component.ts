import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthorizationManager} from "../../service/authorizationmanager";
import {DarkModeService} from "../../service/DarkModeService";
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent {

  opened: boolean = true;

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
    'Class': 'schedule',
    'Inventory': 'description'
  };
  userImage: string = 'assets/default.png'

  constructor(private router: Router, public authService: AuthorizationManager, public darkModeSevice: DarkModeService) {
  }

  logout(): void {
    this.router.navigateByUrl("login")
    this.authService.clearUsername();
    this.authService.clearMenuState();
    localStorage.removeItem("Authorization");
    localStorage.removeItem("employee");
  }

  // Check that the logged user has the permission to view and then set Visible menu or else set not-visible menu
  isExpanded: boolean = false;
  panelExpanded: boolean = false;

  isMenuVisible(category: string): boolean {
    let isVisible = true;

    this.menuGroup.forEach((menuGroup: { Menu: string; MenuItems: { name: string; isVisible: boolean }[] }) => {

      if (menuGroup.Menu === category) {
        isVisible = menuGroup.MenuItems.some(menuItem => menuItem.isVisible);
      }
    });

    return isVisible;
  }

  async ngOnInit(): Promise<void> {
    this.menuGroup = this.authService.getNavListItem();
    await this.authService.getAuth(this.authService.getUsername());
    this.userImage = this.authService.getUserProfile();

  }

  protected readonly event = event;

  show(event: any) {
    console.log(event)
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


  isNavigationActive = false;
  // menuItems = [
  //   { label: 'Home', isActive: false },
  //   { label: 'About', isActive: false },
  //   { label: 'Services', isActive: false },
  //   { label: 'Contact', isActive: false },
  // ];

  toggleMenu(): void {
    this.isNavigationActive = !this.isNavigationActive;
  }

  // activateLink(item: any): void {
  //   this.menuItems.forEach(menuItem => menuItem.isActive = false);
  //   item.isActive = true;
  // }
}


// admMenuItems = this.authService.Admin;
// acdMenuItems = this.authService.Academic;
// regMenuItems = this.authService.Registration;
// clsMenuItems = this.authService.Class;
