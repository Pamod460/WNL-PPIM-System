import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByDistrict} from "./entity/countbydistrict";
import {AgentCoutByorders} from "./entity/AgentCoutByorders";
import {PurchaseOrderCount} from "./entity/PurchaseOrderCout";
import {ReportInventoryItem} from "./entity/ReportInventoryItem";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {
  }

  async countByDesignation(): Promise<CountByDesignation[]> {

    const countbydesignations = await this.http.get<CountByDesignation[]>('http://localhost:8080/reports/countbydesignation').toPromise();
    if (countbydesignations == undefined) {
      return [];
    }
    return countbydesignations;
  }

  countByDistrict() {

    return this.http.get<CountByDistrict[]>('http://localhost:8080/reports/countbydistrict');
  }

  agentCoutbyOrders(query: string) {
    return this.http.get<AgentCoutByorders[]>('http://localhost:8080/reports/agentcoutbyorders' + query);
  }

  purchaseOrderCount(query: string) {
    return this.http.get<PurchaseOrderCount[]>('http://localhost:8080/reports/purchaseordercount' + query);
  }

  getPaperpurchaseOrdersummry(query: string) {
    return this.http.get<[{ supplier: string, totalExpectedCost: number, orderCount: number }]>('http://localhost:8080/reports/paperpordersummry' + query);

  }

  getMaterialInventory(query:string) {
    return this.http.get<ReportInventoryItem[]>('http://localhost:8080/reports/material' + query);

  }
}


