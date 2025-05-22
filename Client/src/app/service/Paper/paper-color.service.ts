import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperUnitType} from "../../entity/PaperUnitType";
import {PaperColor} from "../../entity/PaperColor";

@Injectable({
  providedIn: 'root'
})
export class PaperColorService {
  readonly API_URL = environment.api_url+"/papercolors"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperColor[]>(`${this.API_URL}/list`);
  }
}
