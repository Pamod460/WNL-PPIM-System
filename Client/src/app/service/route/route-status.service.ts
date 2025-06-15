import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RouteStatus} from "../../entity/RouteStatus'";

@Injectable({
  providedIn: 'root'
})
export class RouteStatusService {
  readonly API_URL = environment.api_url
  private baseUrl = `${this.API_URL}/route-statuses`;

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<RouteStatus[]>(`${this.baseUrl}/list`);
  }
}
