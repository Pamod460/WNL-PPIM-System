import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {MaterialCategory} from "../../entity/MaterialCategory";
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

  update(entity: MaterialCategory): Observable<MaterialCategory> {
    return this.http.put<MaterialCategory>(`${this.baseUrl}`, entity);
  }

  getAll(query: string ) {
    return this.http.get<MaterialCategory[]>(`${this.baseUrl}` + query);
  }

  add(entity: MaterialCategory): Observable<MaterialCategory> {
    return this.http.post<MaterialCategory>(`${this.baseUrl}`, entity);
  }
}
