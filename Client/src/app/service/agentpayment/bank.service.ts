import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Bank} from "../../entity/bank";

@Injectable({
  providedIn: 'root'
})
export class BankService {
  readonly API_URL=environment.api_url+"/banks"
  constructor(private http: HttpClient) {  }
  getAllList() {
    return this.http.get<Bank[]>(`${this.API_URL}`);
  }
}
