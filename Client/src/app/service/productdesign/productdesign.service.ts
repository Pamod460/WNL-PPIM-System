import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Productdesign} from "../../entity/productdesign";
import {StandardResponse} from "../../entity/standardresponse";
import {Distribution} from "../../entity/distribution";

@Injectable({
  providedIn: 'root'
})
export class ProductdesignService {
  readonly API_URL = environment.api_url
  private baseUrl = `${this.API_URL}/productdesigns`;

  constructor(private http: HttpClient) {
  }

  delete(id: number | undefined){
    return this.http.delete<StandardResponse>(`${this.baseUrl}/${id}`);
  }

  update(entity: Productdesign) {
    return this.http.put<StandardResponse>(`${this.baseUrl}`, entity);
  }

  getAll(query: string) {
    return this.http.get<Productdesign[]>(`${this.baseUrl}` + query);
  }

  add(entity: Productdesign) {
    return this.http.post<StandardResponse>(`${this.baseUrl}`, entity);
  }

  getAllListNameId() {
    return this.http.get<Productdesign[]>(`${this.baseUrl}/list`);
  }
  // getLastProductDesignCode() {
  //   return this.http.get<{code:string}>(`${this.baseUrl}` + '/last');
  //
  // }
}
