import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ProductFrequency} from "../../entity/ProductFrequency";

@Injectable({
  providedIn: 'root'
})
export class ProductFrequencyService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/productfrequencies`;

  constructor(private http: HttpClient) { }



  getAll( ) {
    return this.http.get<ProductFrequency[]>(`${this.baseUrl}/list`);
  }
}
