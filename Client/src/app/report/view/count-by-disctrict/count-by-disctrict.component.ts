import {Component, OnInit} from '@angular/core';
import {CountByDistrict} from "../../entity/countbydistrict";
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {ChartData, ChartOptions} from "chart.js";
// @ts-ignore
import * as html2pdf from 'html2pdf.js';
@Component({
  selector: 'app-count-by-disctrict',
  templateUrl: './count-by-disctrict.component.html',
  styleUrls: ['./count-by-disctrict.component.css']
})
export class CountByDisctrictComponent implements OnInit{

  countbydistricts!: CountByDistrict[];
  data!: MatTableDataSource<CountByDistrict>;

  columns: string[] = ['district', 'count', 'percentage'];
  headers: string[] = ['District', 'Count', 'Percentage'];
  binders: string[] = ['district', 'count', 'percentage'];
  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  chartType: 'pie' = 'pie';
  chartData?: ChartData<'pie'>;
  rawData: CountByDistrict[] = [];
  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Agents By District',
      }
    },
    scales: {
      x: {stacked: true},
      y: {stacked: true}
    }
  };

  barChartData: any;
  barChartType: 'bar' = 'bar';
  barchartOptions: ChartOptions<'bar'> = {
    // indexAxis: 'y',
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Agents By District',
      }
    },
    scales: {
      x: {stacked: true},
      y: {stacked: true}
    }
  };
  lineChartData: any;
  lineChartType: 'line'='line';
  linechartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Agents By District',
      }
    },
    scales: {
      x: {stacked: true},
      y: {stacked: true}
    }
  };
  matchedNavItem = "Agent Count By District";

  ngOnInit(): void {

    this.rs.countByDistrict()
      .subscribe((des: CountByDistrict[]) => {
        this.countbydistricts = des;
        this.rawData = des;
        this.loadTable();
        this.loadCharts();
      });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbydistricts);
  }

  loadCharts() : void{
    this.chartData = {
      labels: this.rawData.map(item => item.district),

      datasets: [
        {
          label: 'Agent Count',
          data: this.rawData.map(item => item.count),
          backgroundColor: this.getColors(this.rawData.length),
        }
      ]

    }
    this.barChartData = {
      labels: this.rawData.map(item => item.district),

      datasets: [
        {
          label: 'Agent Count',
          data: this.rawData.map(item => item.count),
          backgroundColor: this.getColors(this.rawData.length),
        }
      ]

    }

    this.lineChartData = {
      labels: this.rawData.map(item => item.district),

      datasets: [
        {
          label: 'Agent Count',
          data: this.rawData.map(item => item.count),
          backgroundColor: this.getColors(this.rawData.length),
        }
      ]

    }
  }




  getColors(count: number): string[] {
    const colors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b'];
    return Array.from({length: count}, (_, i) => colors[i % colors.length]);
  }
  downloadPDF() {
    const element = document.getElementById('pdfContent');
    if (element) {
      const opt = {
        margin: 0.5,
        filename: 'document.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a3', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      html2pdf().set(opt).from(element).save();
    }
  }
}
