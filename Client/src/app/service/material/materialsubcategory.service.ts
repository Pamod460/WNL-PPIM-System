import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Materialsubcategory } from "../../entity/Materialsubcategory";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MaterialsubcategoryService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/materialsubcategories`;
  constructor(private http: HttpClient) { }

  delete(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(entity: Materialsubcategory): Observable<Materialsubcategory> {
    return this.http.put<Materialsubcategory>(`${this.baseUrl}`, entity);
  }

  getAll(query: string ): Observable<Materialsubcategory[]> {
    return this.http.get<Materialsubcategory[]>(`${this.baseUrl}` + query);
  }

  add(entity: Materialsubcategory): Observable<Materialsubcategory> {
    return this.http.post<Materialsubcategory>(`${this.baseUrl}`, entity);
  }
}
