import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Productionorderstatus} from "../../entity/productionorderstatus";

@Injectable({
  providedIn: 'root'
})
export class ProductionorderstatusService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/productionorderstatuses`;

  constructor(private http: HttpClient) { }

  getAll( ) {
    return this.http.get<Productionorderstatus[]>(this.baseUrl);
  }
}
