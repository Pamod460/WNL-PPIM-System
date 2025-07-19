import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MaterialPorderStatus} from "../../entity/MaterialPorderStatus";

@Injectable({
  providedIn: 'root'
})
export class MaterialPorderStatusService {

  readonly API_URL = environment.api_url+"/materialporderstatus"
  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<MaterialPorderStatus[]>(`${this.API_URL}`);
  }
}
