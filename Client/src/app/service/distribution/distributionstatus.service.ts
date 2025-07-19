import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Agentstatus} from "../../entity/agentstatus";

@Injectable({
  providedIn: 'root'
})
export class DistributionStatusService {

  readonly API_URL=environment.api_url+"/distributionstatuses"
  constructor(private http: HttpClient) {  }
  getAllList() {

    return this.http.get<Agentstatus[]>(this.API_URL);
  }
}
