import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ReportService} from "../../reportservice";
import {ReportInventoryItem} from "../../entity/ReportInventoryItem";
import {query} from "@angular/animations";

@Component({
  selector: 'app-stock-level-report',
  templateUrl: './stock-level-report.component.html',
  styleUrls: ['./stock-level-report.component.css']
})
export class StockLevelReportComponent implements OnInit {


  inventoryItems!: ReportInventoryItem[];
  data!: MatTableDataSource<ReportInventoryItem>;

  columns: string[] = ['materialCode', 'materialName', 'totalQuantity', 'unitPrice', 'status', 'unitType'];
  headers: string[] = ['Code', 'Name', 'Quantity', 'Unit Price', 'Status', 'Unit Type'];
  binders: string[] = ['materialCode', 'materialName', 'totalQuantity', 'unitPrice', 'status', 'unitType'];
  chartBinders: string[] = ['materialName', 'totalQuantity'];


  constructor(private rs: ReportService) {

  }

  ngOnInit(): void {



    this.loadTable("");

  }

  loadTable(query: string): void {
    this.rs.getMaterialInventory(query)
      .subscribe((des: ReportInventoryItem[]) => {
        this.inventoryItems = des;

      })
  }

}
