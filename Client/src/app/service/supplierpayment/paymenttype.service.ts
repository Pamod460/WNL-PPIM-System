import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "../../entity/country";
import {Paymenttype} from "../../entity/paymenttype";

@Injectable({
  providedIn: 'root'
})
export class PaymenttypeService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/paymenttypes`;
  constructor(private http: HttpClient) {
  }

  getAllList(): Observable<Paymenttype[]> {
    return this.http.get<Country[]>(this.baseUrl);
  }
}
