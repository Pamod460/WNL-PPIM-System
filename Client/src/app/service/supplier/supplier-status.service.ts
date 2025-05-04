import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Unittype} from "../../entity/Unittype";

@Injectable({
  providedIn: 'root'
})
export class SupplierStatusService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/supplierstatuss`;

  constructor(private http: HttpClient) {
  }

  getAllList(): Observable<Unittype[]> {
    return this.http.get<Unittype[]>(`${this.baseUrl}/list`);
  }
}
