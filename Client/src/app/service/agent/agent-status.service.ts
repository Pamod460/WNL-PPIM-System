import { Injectable } from '@angular/core';

import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AgentStatus} from "../../entity/AgentStatus";

@Injectable({
  providedIn: 'root'
})
export class AgentStatusService {
  readonly API_URL=environment.api_url+"/agentstatuses"
  constructor(private http: HttpClient) {  }
  getAllList() {

    return this.http.get<AgentStatus[]>(`${this.API_URL}/list`);
  }
}
