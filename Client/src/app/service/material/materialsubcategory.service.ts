import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { MaterialSubcategory } from "../../entity/MaterialSubcategory";
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

  update(entity: MaterialSubcategory): Observable<MaterialSubcategory> {
    return this.http.put<MaterialSubcategory>(`${this.baseUrl}`, entity);
  }

  getAll(query: string ): Observable<MaterialSubcategory[]> {
    return this.http.get<MaterialSubcategory[]>(`${this.baseUrl}` + query);
  }

  add(entity: MaterialSubcategory): Observable<MaterialSubcategory> {
    return this.http.post<MaterialSubcategory>(`${this.baseUrl}`, entity);
  }
}
