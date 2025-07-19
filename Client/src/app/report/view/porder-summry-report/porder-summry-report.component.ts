import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {CountByDesignation} from "../../entity/countbydesignation";
import {ReportService} from "../../reportservice";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-porder-summry-report',
  templateUrl: './porder-summry-report.component.html',
  styleUrls: ['./porder-summry-report.component.css']
})
export class PorderSummryReportComponent implements OnInit{
  purchaseOrders: any[] = [];

  filterForm: FormGroup;

  data!: MatTableDataSource<CountByDesignation>;

  columns: string[] = ['supplier','totalExpectedCost', 'orderCount'];
  headers: string[] = ['Full Name','Cost', 'Count'];
  binders: string[] = ['supplier','totalExpectedCost', 'orderCount'];

  @ViewChild('barchart', {static: false}) barchart: any;
  @ViewChild('piechart', {static: false}) piechart: any;
  @ViewChild('linechart', {static: false}) linechart: any;
  isLoaded = false;

  constructor(private rs: ReportService,private fb:FormBuilder,private datePipe: DatePipe) {
    this.filterForm=this.fb.group({
      startDate:new FormControl(null,[Validators.required]),
      endDate:new FormControl(null,[Validators.required])
    })
  }

  ngOnInit(): void {
    this.loadTable("")
  }

  loadTable(query: string): void {
    this.rs.getPaperpurchaseOrdersummry(query).subscribe(
      des => {
        this.purchaseOrders = des;
        this.isLoaded=true
      })
  }


  btnSearchMc() {
    const sserchdata = this.filterForm.getRawValue();

    const startDate = this.datePipe.transform(new Date(sserchdata.startDate), 'yyyy-MM-dd') ;
    const endDate = this.datePipe.transform(new Date(sserchdata.endDate), 'yyyy-MM-dd');

    let query = "";

    if (startDate != null && startDate.trim() != "") query = query + "&startDate=" + startDate;
    if (endDate != null && endDate.trim() != "") query = query + "&endDate=" + endDate;
    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);
  }

  resetForm() {
    this.filterForm.reset()
    this.loadTable("")
  }
}
