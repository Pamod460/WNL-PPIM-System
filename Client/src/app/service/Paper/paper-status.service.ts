import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperStatus} from "../../entity/PaperStatus";

@Injectable({
  providedIn: 'root'
})
export class PaperStatusService {
  readonly API_URL = environment.api_url+"/paperstatuses"
  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<PaperStatus[]>(`${this.API_URL}/list`);
  }
}
