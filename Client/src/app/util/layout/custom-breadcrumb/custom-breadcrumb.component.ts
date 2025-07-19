import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";

import {filter} from 'rxjs/operators';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {CapitalizePipe} from "../pipe/capitalize.pipe";

@Component({
  selector: 'app-custom-breadcrumb',
  templateUrl: './custom-breadcrumb.component.html',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    DatePipe,
    MatIconModule,
    MatToolbarModule,
    RouterLink,
    CapitalizePipe,
  ],
  styleUrls: ['./custom-breadcrumb.component.css']
})
export class CustomBreadcrumbComponent implements OnInit {
  item: any[] = [];
  @Input() matchedNavItem='';
  public currentTime: Date = new Date();

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    // Listen for NavigationEnd events to update breadcrumbs when route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });

    // Initialize breadcrumbs on component load
    this.updateBreadcrumbs();
    this.loadTime();
  }

  loadTime() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // Update every 1 second
  }

  updateBreadcrumbs(): void {
    const currentUrl = this.router.url;
      this.route.url.subscribe(url => {
        this.item = currentUrl.split('/')

        if (this.matchedNavItem != '') {
          this.item[2] = this.matchedNavItem

        } else {
          this.matchedNavItem = url[0].path
        }
      })

  }
}
