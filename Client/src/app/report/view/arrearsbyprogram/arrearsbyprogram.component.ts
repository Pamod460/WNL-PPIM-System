import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ArrearsByProgram} from "../../entity/arrearsbyprogram";


declare let google: { charts: { load: (arg0: string, arg1: { packages: string[]; }) => void; setOnLoadCallback: (arg0: () => void) => void; }; visualization: { DataTable: new () => any; ColumnChart: new (arg0: any) => any; PieChart: new (arg0: any) => any; }; };

@Component({
  selector: 'app-designation',
  templateUrl: './arrearsbyprogram.component.html',
  styleUrls: ['./arrearsbyprogram.component.css'],
  })

export class ArrearsByProgramComponent implements OnInit {

  arrearsbyprograms!:ArrearsByProgram[]
  data!: MatTableDataSource<ArrearsByProgram>;

  columns: string[] = ['no','count', 'expected', 'paid','due','arrears','percentage'];
  headers: string[] = ['No','Count', 'Expected', 'Paid','Due','Arrears','Percentage'];
  binders: string[] = ['no','count', 'expected', 'paid','due','arrears','percentage'];

  total!:number[];
  ftext:string = "Total Counts"


  @ViewChild('columnchart', { static: false }) columnchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;


  ngOnInit(): void {

   let bit:ArrearsByProgram = new ArrearsByProgram("BIT",1,10,450000,135000,315000,94500,30);
   let bitfulltime:ArrearsByProgram = new ArrearsByProgram("Fulltime",2,5,225000,67500,157500,47250,30);
   let bitproject:ArrearsByProgram = new ArrearsByProgram("Project",3,6,240000,72000,168000,50400,30);
   let fit:ArrearsByProgram = new ArrearsByProgram("FIT",4,8,160000,48000,112000,33600,30);

   const texpected = bit.expected+bitproject.expected+bitfulltime.expected+fit.expected;
   const tpaid = bit.paid+bitproject.paid+bitfulltime.paid+fit.paid;
   let tdue = bit.due+bitproject.due+bitfulltime.due+fit.due;
   let tarrears = bit.arrears+bitproject.arrears+bitfulltime.arrears+fit.arrears;

   this.total = [texpected,tpaid,tdue,tarrears];
   this.arrearsbyprograms  =[bit,bitfulltime,bitproject,fit]

    this.loadTable();
    this.loadCharts();

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.arrearsbyprograms);
  }

  loadCharts() : void{
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawCharts.bind(this));
  }


  drawCharts() {
    const barData = new google.visualization.DataTable();
    barData.addColumn('string', 'program');
    barData.addColumn('number', 'count');
    barData.addColumn('number', 'expected');
    barData.addColumn('number', 'paid');
    barData.addColumn('number', 'due');
    barData.addColumn('number', 'arrears');
    barData.addColumn('number', 'percentage');

    const pieData = new google.visualization.DataTable();
    pieData.addColumn('string', 'program');
    pieData.addColumn('number', 'count');
    pieData.addColumn('number', 'expected');
    pieData.addColumn('number', 'paid');
    pieData.addColumn('number', 'due');
    pieData.addColumn('number', 'arrears');
    pieData.addColumn('number', 'percentage');

    this.arrearsbyprograms.forEach((abp: ArrearsByProgram) => {
      barData.addRow([abp.program,abp.count, abp.expected,abp.paid,abp.due,abp.arrears,abp.percentage]);
      pieData.addRow([abp.program, abp.count, abp.expected, abp.paid, abp.due, abp.arrears, abp.percentage]);
    });

    const barOptions = {
      title: 'Designation Count (Bar Chart)',
      subtitle: 'Count of Employees by Designation',
      bars: 'vertical',
      height: 400,
      width: 600,
    };

    const pieOptions = {
      title: 'Designation Count (Pie Chart)',
      height: 400,
      width: 550,
    };

    const columnChart = new google.visualization.ColumnChart(this.columnchart.nativeElement);
    columnChart.draw(barData, barOptions);

    const pieChart = new google.visualization.PieChart(this.piechart.nativeElement);
    pieChart.draw(pieData, pieOptions);

  }


}
