import {environment} from "../../environments/environment";
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

    const countbydesignations = await this.http.get<CountByDesignation[]>(environment.api_url + '/reports/countbydesignation').toPromise();
    if (countbydesignations == undefined) {
      return [];
    }
    return countbydesignations;
  }

  countByDistrict() {

    return this.http.get<CountByDistrict[]>(environment.api_url + '/reports/countbydistrict');
  }

  agentCoutbyOrders(query: string) {
    return this.http.get<AgentCoutByorders[]>(environment.api_url + '/reports/agentcoutbyorders' + query);
  }

  purchaseOrderCount(query: string) {
    return this.http.get<PurchaseOrderCount[]>(environment.api_url + '/reports/purchaseordercount' + query);
  }

  getPaperpurchaseOrdersummry(query: string) {
    return this.http.get<[{ supplier: string, totalExpectedCost: number, orderCount: number }]>(environment.api_url + '/reports/paperpordersummry' + query);

  }

  getMaterialInventory(query:string) {
    return this.http.get<ReportInventoryItem[]>(environment.api_url + '/reports/material' + query);

  }
}


