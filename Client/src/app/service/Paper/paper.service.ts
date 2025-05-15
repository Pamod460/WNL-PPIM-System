import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Paper} from "../../entity/Paper";

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  readonly API_URL = environment.api_url

  constructor(private http:HttpClient) { }

  getAllList() {
    return this.http.get<Paper[]>(`${this.API_URL}/papers/list`);
  }


}
