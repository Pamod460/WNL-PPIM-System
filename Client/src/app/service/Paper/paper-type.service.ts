import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperType} from "../../entity/PaperType";

@Injectable({
  providedIn: 'root'
})
export class PaperTypeService {
  readonly API_URL = environment.api_url+"/papertypes"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperType[]>(`${this.API_URL}/list`);
  }
}
