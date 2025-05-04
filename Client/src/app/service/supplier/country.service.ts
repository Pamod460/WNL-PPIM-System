import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Country} from "../../entity/Country";


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/countries`;

  constructor(private http: HttpClient) {
  }

  getAllList(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/list`);
  }
}
