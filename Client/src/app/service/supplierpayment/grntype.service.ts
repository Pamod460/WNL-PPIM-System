import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "../../entity/country";
import {Grntype} from "../../entity/grntype";

@Injectable({
  providedIn: 'root'
})
export class GrntypeService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/grntypes`;
  constructor(private http: HttpClient) {
  }

  getAllList(): Observable<Grntype[]> {
    return this.http.get<Country[]>(this.baseUrl);
  }
}
