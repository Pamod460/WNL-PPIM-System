import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperUnitType} from "../../entity/PaperUnitType";
import {PaperType} from "../../entity/PaperType";
import {PaperSize} from "../../entity/PaperSize";

@Injectable({
  providedIn: 'root'
})
export class PaperSizeService {
  readonly API_URL = environment.api_url+"/papersizes"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperSize[]>(`${this.API_URL}/list`);
  }
}
