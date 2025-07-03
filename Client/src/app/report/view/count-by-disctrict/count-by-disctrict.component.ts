import {Component, OnInit, ViewChild} from '@angular/core';
import {CountByDistrict} from "../../entity/countbydistrict";
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
declare let google: { charts: { load: (arg0: string, arg1: { packages: string[]; }) => void; setOnLoadCallback: (arg0: () => void) => void; }; visualization: { DataTable: new () => any; BarChart: new (arg0: any) => any; PieChart: new (arg0: any) => any; LineChart: new (arg0: any) => any; }; };

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

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {
    //Define Interactive Panel with Needed Form Elements
  }

  ngOnInit(): void {

    this.rs.countByDistrict()
      .then((des: CountByDistrict[]) => {
        this.countbydistricts = des;
      }).finally(() => {
      this.loadTable();
      this.loadCharts();
    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbydistricts);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {

    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'District');
    barData.addColumn('number', 'Count');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'District');
    pieData.addColumn('number', 'Count');

    const lineData = new google.visualization.DataTable();
    lineData.addColumn('string', 'District');
    lineData.addColumn('number', 'Count');

    this.countbydistricts.forEach((des: CountByDistrict) => {
      barData.addRow([des.district, des.count]);
      pieData.addRow([des.district, des.count]);
      lineData.addRow([des.district, des.count]);
    });

    const barOptions = {
      title: 'District Count (Bar Chart)',
      subtitle: 'Count of Employees by District',
      bars: 'horizontal',
      height: 400,
      width: 600
    };

    const pieOptions = {
      title: 'District Count (Pie Chart)',
      height: 400,
      width: 550
    };

    const lineOptions = {
      title: 'District Count (Line Chart)',
      height: 400,
      width: 600
    };

    const barChart = new google.visualization.BarChart(this.barchart.nativeElement);
    barChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

    const lineChart = new google.visualization.LineChart(this.linechart.nativeElement);
    lineChart.draw(lineData, lineOptions);
  }
}
