import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {AuthorizationManager} from "../../service/auth/authorizationmanager";
import {MatMenuTrigger} from "@angular/material/menu";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-mainwindow',
  templateUrl: './mainwindow.component.html',
  styleUrls: ['./mainwindow.component.css']
})
export class MainwindowComponent implements OnInit, OnDestroy {

  opened = true;
  isNavigationActive = false;
  menuGroup: any[] = [];


  userImage = 'assets/default.png'
  activeRole = "";
  activePanel: number | null = null;

  @ViewChild('sidenav', { static: false }) sidenav!: ElementRef;

  // Auto-scroll properties
  private scrollInterval: any;
  private scrollSpeed = 3; // Increased for better visibility
  private scrollDelay = 30; // Decreased for smoother scrolling
  private closeTimeout: any;

  constructor(private router: Router, public authorizationManager: AuthorizationManager) {
  }

  logout(): void {
    this.authorizationManager.logout();
  }

  openPanel(index: number) {
    this.activePanel = index;
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
    this.activeRole = this.authorizationManager.getRoles()[0].name;

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.setActivePanelFromRoute());

    // Initial panel on page load
    this.setActivePanelFromRoute();
  }


  openMenu(menuTrigger: MatMenuTrigger): void {
    this.cancelCloseMenu();
    menuTrigger.openMenu();
  }

  scheduleCloseMenu(): void {
    this.closeTimeout = setTimeout(() => {
      this.closeActiveMenu();
    }, 300);
  }

  cancelCloseMenu(): void {
    clearTimeout(this.closeTimeout);
  }

  private closeActiveMenu(): void {
    const activeMenu = document.querySelector('.mat-menu-panel.mat-menu-open');
    if (activeMenu) {
      const menuInstance = activeMenu.getAttribute('aria-controls');
      const menuElement = document.getElementById(menuInstance || '');
      if (menuElement) {
        menuElement.dispatchEvent(new Event('mouseleave'));
      }
    }
  }

  onMouseMove(event: MouseEvent) {
    if (!this.sidenav || !this.sidenav.nativeElement) {
      return;
    }

    const sidenavElement = this.sidenav.nativeElement;
    const rect = sidenavElement.getBoundingClientRect();
    const mouseY = event.clientY;
    const elementTop = rect.top;
    const elementBottom = rect.bottom;
    const elementHeight = rect.height;

    // Define scroll zones (top 15% and bottom 15% of the sidenav)
    const scrollZoneHeight = elementHeight * 0.15;
    const topZone = elementTop + scrollZoneHeight;
    const bottomZone = elementBottom - scrollZoneHeight;

    // Clear any existing scroll interval
    this.clearScrollInterval();

    // Check if mouse is within sidenav bounds
    if (mouseY >= elementTop && mouseY <= elementBottom) {
      if (mouseY < topZone) {
        // Mouse in top zone - scroll up
        this.startScrolling('up');
      } else if (mouseY > bottomZone) {
        // Mouse in bottom zone - scroll down
        this.startScrolling('down');
      }
    }
  }

  onMouseLeave() {
    this.clearScrollInterval();
  }

  private startScrolling(direction: 'up' | 'down') {
    if (!this.sidenav || !this.sidenav.nativeElement) {
      return;
    }

    this.scrollInterval = setInterval(() => {
      const sidenavElement = this.sidenav.nativeElement;

      // Check scroll boundaries
      const isAtTop = sidenavElement.scrollTop <= 0;
      const isAtBottom = sidenavElement.scrollTop >= (sidenavElement.scrollHeight - sidenavElement.clientHeight);

      // Stop scrolling if we've reached the boundary
      if ((direction === 'up' && isAtTop) || (direction === 'down' && isAtBottom)) {
        this.clearScrollInterval();
        return;
      }

      const scrollAmount = direction === 'up' ? -this.scrollSpeed : this.scrollSpeed;
      sidenavElement.scrollTop += scrollAmount;
    }, this.scrollDelay);
  }

  private clearScrollInterval() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }

  ngOnDestroy() {
    this.clearScrollInterval();
    this.cancelCloseMenu();
  }

  toggleMenu(): void {
    this.isNavigationActive = !this.isNavigationActive;
  }

  checkIsAdmin() {
    return localStorage.getItem("username") != "Admin";
  }

  closePanel(index: number) {
    const currentUrl = this.router.url;
    const menuItem = this.menuGroup[index];
    const hasActiveSubmenu = menuItem.MenuItems?.some(
      (sub: { routerLink: string }) => currentUrl.includes(sub.routerLink)
    );

    if (this.activePanel === index && !hasActiveSubmenu) {
      this.activePanel = null;
    }
  }

  togglePanel(index: number) {
    this.activePanel = this.activePanel === index ? null : index;
  }
   setActivePanelFromRoute() {
    const currentUrl = this.router.url;
    let foundActivePanel = false;

    this.menuGroup.forEach((menuItem, index) => {
      const hasActiveSubmenu = menuItem.MenuItems?.some(
        (sub: { routerLink: string }) => currentUrl.includes(sub.routerLink)
      );
      if (hasActiveSubmenu) {
        this.activePanel = index;
        foundActivePanel = true;
      }
    });
    if (!foundActivePanel) {
      this.activePanel = null;
    }
  }
}
