import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Materialstatus} from "../../entity/Materialstatus";

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/productcategories`;

  constructor(private http: HttpClient) { }



  getAll( ) {
    return this.http.get<Materialstatus[]>(`${this.baseUrl}/list`);
  }
}
