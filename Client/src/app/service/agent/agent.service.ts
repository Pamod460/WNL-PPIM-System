import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StandardResponse} from "../../entity/standardresponse";
import {Agent} from "../../entity/agent";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  readonly API_URL=environment.api_url+"/agents"
  constructor(private http: HttpClient) {  }

  delete(id: number){
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(agent: Agent){
    return this.http.put<StandardResponse>(`${this.API_URL}/`, agent);
  }


  getAll(query:string) {
    return this.http.get<Agent[]>(`${this.API_URL}` + query);
  }

  getAllListNameId() {

    return this.http.get<Agent[]>(`${this.API_URL}/list`);
  }

  add(agent: Agent){
    return this.http.post<StandardResponse>(`${this.API_URL}`, agent);
  }

  getLastAgentCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/last`);
  }
}
