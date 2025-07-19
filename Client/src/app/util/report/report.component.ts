import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ChartData, ChartOptions} from "chart.js";
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
import {MatGridListModule} from "@angular/material/grid-list";
import {CustomBreadcrumbComponent} from "../layout/custom-breadcrumb/custom-breadcrumb.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {NgChartsModule} from "ng2-charts";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  standalone: true,
  imports: [
    MatGridListModule,
    CustomBreadcrumbComponent,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    NgChartsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnChanges {

  @Input() title = '';
  @Input() matchedNavItem: string = '';
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() headers: string[] = [];
  @Input() binders: string[] = [];
  @Input() chartBinders: string[] = [];

  @Input() isStaticReport = true;

  dataSource!: MatTableDataSource<any>;

  chartType: 'pie' = 'pie';
  barChartType: 'bar' = 'bar';
  lineChartType: 'line' = 'line';

  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: this.title,
      },
      legend:{
        position:'right'
      }
    }
  };

  barchartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: this.title,
      }
    },
    scales: {
      x: {stacked: true},
      y: {stacked: true}
    }
  };

  linechartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: this.title,
      }
    },
    scales: {
      x: {stacked: true},
      y: {stacked: true}
    }
  };

  chartData!: ChartData<'pie'>;
  barChartData!: ChartData<'bar'>;
  lineChartData!: ChartData<'line'>;

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.prepareCharts();
  }

  prepareCharts() {
    if (this.chartBinders.length == 0) this.chartBinders = this.binders
    const labels = this.data.map(d => d[this.chartBinders[0]]);
    const values = this.data.map(d => d[this.chartBinders[1]]);
    const colors = this.getColors(this.data.length);

    this.chartData = {
      labels,
      datasets: [{label: 'Count', data: values, backgroundColor: colors}]
    };

    this.barChartData = {
      labels,
      datasets: [{label: 'Count', data: values, backgroundColor: colors}]
    };

    this.lineChartData = {
      labels,
      datasets: [{label: 'Count', data: values, backgroundColor: colors}]
    };
  }

  getColors(count: number): string[] {
    const colors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b'];
    return Array.from({length: count}, (_, i) => colors[i % colors.length]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['binders']) {
      this.dataSource = new MatTableDataSource(this.data);
      this.prepareCharts();
    }
  }

  downloadPDF() {
    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0.5,
        filename: 'report.pdf',
        image: {type: 'jpeg', quality: 1},
        html2canvas: {scale: 2},
        jsPDF: {unit: 'in', format: 'a3', orientation: 'landscape'},
        pagebreak: {mode: ['avoid-all', 'css', 'legacy']}
      };
      html2pdf().set(opt).from(element).save();
    }
  }
}
