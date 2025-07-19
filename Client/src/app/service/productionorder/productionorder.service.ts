import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../../entity/Product";
import {Productionorder} from "../../entity/productionorder";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class ProductionorderService {

  readonly API_URL = environment.api_url
  private baseUrl = `${this.API_URL}/productionorders`;

  constructor(private http: HttpClient) {
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.baseUrl}/${id}`);
  }

  update(entity: Productionorder){
    return this.http.put<StandardResponse>(`${this.baseUrl}`, entity);
  }

  getAll(query: string) {
    return this.http.get<Productionorder[]>(`${this.baseUrl}` + query);
  }

  add(entity: Productionorder) {
    return this.http.post<StandardResponse>(`${this.baseUrl}`, entity);
  }


  getNextProductionOrderCode() {
    return this.http.get<{code:string}>(`${this.baseUrl}` + '/next');

  }
}
