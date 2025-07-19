import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StandardResponse} from "../../entity/standardresponse";
import {AgentPayment} from "../../entity/agentpayment";


@Injectable({
  providedIn: 'root'
})
export class AgentPaymentService {


  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/agentpayments`;

  constructor(private http: HttpClient) {
  }

  getAll(query = ''): Observable<AgentPayment[]> {
    return this.http.get<AgentPayment[]>(`${this.baseUrl}` + query);
  }


  delete(id: number) {
    return this.http.delete<StandardResponse>(`${this.baseUrl}/` + id);
  }

  update(agentpayment: AgentPayment) {

    return this.http.put<StandardResponse>(`${this.baseUrl}`, agentpayment);
  }

  add(agentpayment: AgentPayment) {
    return this.http.post<StandardResponse>(`${this.baseUrl}`, agentpayment);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.baseUrl}/next`);

  }
}
