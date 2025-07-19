import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StandardResponse} from "../../entity/standardresponse";
import {Supplierpayment} from "../../entity/supplierpayment";

@Injectable({
  providedIn: 'root'
})
export class SupplierpaymentService {


  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/supplierpayments`;

  constructor(private http: HttpClient) {
  }

  getAll(query = ''): Observable<Supplierpayment[]> {
    return this.http.get<Supplierpayment[]>(`${this.baseUrl}` + query);
  }


  delete(id: number) {
    return this.http.delete<StandardResponse>(`${this.baseUrl}/` + id);
  }

  update(supplierpayment: Supplierpayment) {

    return this.http.put<StandardResponse>(`${this.baseUrl}`, supplierpayment);
  }

  add(supplierpayment: Supplierpayment) {
    return this.http.post<StandardResponse>(`${this.baseUrl}`, supplierpayment);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.baseUrl}/next`);

  }
}
