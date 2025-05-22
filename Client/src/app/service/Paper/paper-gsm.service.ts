import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperUnitType} from "../../entity/PaperUnitType";
import {PaperGsm} from "../../entity/PaperGsm";

@Injectable({
  providedIn: 'root'
})
export class PaperGsmService {
  readonly API_URL = environment.api_url+"/papergsms"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperGsm[]>(`${this.API_URL}/list`);
  }
}
