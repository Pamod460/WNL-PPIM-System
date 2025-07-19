import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CheqStatus} from "../../entity/cheqstatus";

@Injectable({
  providedIn: 'root'
})
export class CheqstatusService {
  readonly API_URL=environment.api_url+"/cheqstatus"
  constructor(private http: HttpClient) {  }
  getAllList() {

    return this.http.get<CheqStatus[]>(`${this.API_URL}`);
  }
}
