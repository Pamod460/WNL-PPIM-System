import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {filter} from "rxjs";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {CapitalizePipe} from "../pipe/capitalize.pipe";
import {CustomBreadcrumbComponent} from "../custom-breadcrumb/custom-breadcrumb.component";

@Component({
  selector: 'app-common-layout',
  standalone: true,
  imports: [CommonModule, MatGridListModule, MatCardModule, CapitalizePipe, CustomBreadcrumbComponent],
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.css']
})
export class CommonLayoutComponent implements OnInit {
  @Input() formCol: number = 4
  @Input() searchCol: number = 8
  @Input() viewCol: number = 8
  @Input() viewRow: number = 12
  @Input() searchRow: number = 2
  @Input() formRow: number = 12
  @Input() statusImageUrl:any="" ;

  title: any;
  public currentTime: Date = new Date();

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    // Listen for NavigationEnd events to update breadcrumbs when route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateTitle();
    });

    this.updateTitle();
    this.loadTime();
  }

  loadTime() {
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000); // Update every 1 second
  }

  updateTitle(): void {
    this.route.url.subscribe((x) => {
      this.title = x[0].path
    });
  }
}
