import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Paymentstatus} from "../../entity/paymentstatus";

@Injectable({
  providedIn: 'root'
})
export class PaymentstatusService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/paymentstatuses`;
  constructor(private http: HttpClient) {
  }

  getAllList(): Observable<Paymentstatus[]> {
    return this.http.get<Paymentstatus[]>(this.baseUrl);
  }
}
