import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Productdesignstatus} from "../../entity/productdesignstatus";

@Injectable({
  providedIn: 'root'
})
export class ProductdesignstatusService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/productdesignstatuses`;

  constructor(private http: HttpClient) { }

  getAll( ) {
    return this.http.get<Productdesignstatus[]>(this.baseUrl);
  }
}
