import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperPorderStatus} from "../../entity/PaperPorderStatus";

@Injectable({
  providedIn: 'root'
})
export class PaperPorderStatusService {

  readonly API_URL = environment.api_url+"/paperporderstatuses"
  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<PaperPorderStatus[]>(`${this.API_URL}`);
  }
}
