import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Materialstatus } from "../../entity/Materialstatus";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MaterialstatusService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/materialstatuses`;

  constructor(private http: HttpClient) { }

  delete(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(entity: Materialstatus): Observable<Materialstatus> {
    return this.http.put<Materialstatus>(`${this.baseUrl}`, entity);
  }

  getAll(query: string ) {
    return this.http.get<Materialstatus[]>(`${this.baseUrl}` + query);
  }

  add(entity: Materialstatus): Observable<Materialstatus> {
    return this.http.post<Materialstatus>(`${this.baseUrl}`, entity);
  }
}
