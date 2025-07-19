import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StandardResponse} from "../../entity/standardresponse";
import {AgentOrder} from "../../entity/agentOrder";
import {Distribution} from "../../entity/distribution";

@Injectable({
  providedIn: 'root'
})
export class DistributionService {
  readonly API_URL=environment.api_url+"/distributions"
  constructor(private http: HttpClient) {  }

  delete(id: number){
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(agentorder: Distribution){
    return this.http.put<StandardResponse>(`${this.API_URL}/`, agentorder);
  }


  getAll(query:string) {
    return this.http.get<Distribution[]>(`${this.API_URL}` + query);
  }

  getAllListNameId() {
    return this.http.get<Distribution[]>(`${this.API_URL}/list`);
  }

  add(agentorder: Distribution){
    return this.http.post<StandardResponse>(`${this.API_URL}`, agentorder);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/next`);
  }
}
