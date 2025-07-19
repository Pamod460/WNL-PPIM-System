import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../reportservice';
import { CountByDesignation } from '../../entity/countbydesignation';
import {MatTableDataSource} from "@angular/material/table";

declare let google: { charts: { load: (arg0: string, arg1: { packages: string[]; }) => void; setOnLoadCallback: (arg0: () => void) => void; }; visualization: { DataTable: new () => any; BarChart: new (arg0: any) => any; PieChart: new (arg0: any) => any; LineChart: new (arg0: any) => any; }; };

@Component({
  selector: 'app-designation',
  templateUrl: './countbydesignation.component.html',
  styleUrls: ['./countbydesignation.component.css']
})
export class CountByDesignationComponent implements OnInit {

  countbydesignations!: CountByDesignation[];
  data!: MatTableDataSource<CountByDesignation>;

  columns: string[] = ['designation', 'count', 'percentage'];
  headers: string[] = ['Designation', 'Count', 'Percentage'];
  binders: string[] = ['designation', 'count', 'percentage'];

  @ViewChild('barchart', { static: false }) barchart: any;
  @ViewChild('piechart', { static: false }) piechart: any;
  @ViewChild('linechart', { static: false }) linechart: any;

  constructor(private rs: ReportService) {

  }

  ngOnInit(): void {

    this.rs.countByDesignation()
      .then((des: CountByDesignation[]) => {
        this.countbydesignations = des;
        }).finally(() => {
      this.loadTable();
    });

  }

  loadTable() : void{
    this.data = new MatTableDataSource(this.countbydesignations);
  }



}
