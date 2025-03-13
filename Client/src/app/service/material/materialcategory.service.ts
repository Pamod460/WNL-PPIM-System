import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {Materialcategory} from "../../entity/Materialcategory";
import {environment} from "../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class MaterialcategoryService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/materialcategories`;

  constructor(private http: HttpClient) { }

  delete(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(entity: Materialcategory): Observable<Materialcategory> {
    return this.http.put<Materialcategory>(`${this.baseUrl}`, entity);
  }

  getAll(query: string ) {
    return this.http.get<Materialcategory[]>(`${this.baseUrl}` + query);
  }

  add(entity: Materialcategory): Observable<Materialcategory> {
    return this.http.post<Materialcategory>(`${this.baseUrl}`, entity);
  }
}
