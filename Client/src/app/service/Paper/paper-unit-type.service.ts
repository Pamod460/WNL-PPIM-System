import { Injectable } from '@angular/core';
import {Material} from "../../entity/Material";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {PaperUnitType} from "../../entity/PaperUnitType";

@Injectable({
  providedIn: 'root'
})
export class PaperUnitTypeService {
  readonly API_URL = environment.api_url+"/paperunittypes"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperUnitType[]>(`${this.API_URL}/list`);
  }
}
