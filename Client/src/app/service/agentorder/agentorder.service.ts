import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StandardResponse} from "../../entity/standardresponse";
import {AgentOrder} from "../../entity/agentOrder";

@Injectable({
  providedIn: 'root'
})
export class AgentorderService {

  readonly API_URL=environment.api_url+"/agentorders"
  constructor(private http: HttpClient) {  }

  delete(id: number){
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(agentorder: AgentOrder){
    return this.http.put<StandardResponse>(`${this.API_URL}/`, agentorder);
  }


  getAll(query:string) {
    return this.http.get<AgentOrder[]>(`${this.API_URL}` + query);
  }

  getAllListNameId() {
    return this.http.get<AgentOrder[]>(`${this.API_URL}/list`);
  }

  add(agentorder: AgentOrder){
    return this.http.post<StandardResponse>(`${this.API_URL}`, agentorder);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/next`);
  }
}
