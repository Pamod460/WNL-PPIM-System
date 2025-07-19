import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperGrnStatus} from "../../entity/PaperGrnStatus";

@Injectable({
  providedIn: 'root'
})
export class PaperGrnStatusService {

  readonly API_URL = environment.api_url+"/papergrnstatuses"
  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<PaperGrnStatus[]>(`${this.API_URL}`);
  }
}
