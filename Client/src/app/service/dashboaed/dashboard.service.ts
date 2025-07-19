import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Dashboard} from "../../entity/dashboard";
import {InventoryItem} from "../../entity/InventoryItem";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  readonly API_URL=environment.api_url+"/dashboard"
  constructor(private http: HttpClient) {  }
  getAllList() {

    return this.http.get<Dashboard>(`${this.API_URL}`);
  }

  getInventoryRopChartData() {
    return this.http.get<InventoryItem[]>(`${this.API_URL}/material-inventory`);
  }

  getPaperInventoryRopChartData() {
    return this.http.get<InventoryItem[]>(`${this.API_URL}/paper-inventory`);
  }
}
