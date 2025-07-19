import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Agentstatus} from "../../entity/agentstatus";
import {Paymenttype} from "../../entity/paymenttype";

@Injectable({
  providedIn: 'root'
})
export class AgentpaymenttypeService {
  readonly API_URL=environment.api_url+"/agentpaymenttype"
  constructor(private http: HttpClient) {  }
  getAllList() {

    return this.http.get<Paymenttype[]>(`${this.API_URL}`);
  }
}
