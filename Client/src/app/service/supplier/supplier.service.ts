import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Unittype} from "../../entity/Unittype";
import {StandardResponse} from "../../entity/standardresponse";
import {User} from "../../entity/user";
import {Supplier} from "../../entity/Supplier";

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/suppliers`;

  constructor(private http: HttpClient) {
  }

  getAll(query = ''): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.baseUrl}` + query);
  }


  delete(id: number) {
    return this.http.delete<StandardResponse>(`${this.baseUrl}/` + id);
  }

  update(supplier: Supplier) {

    return this.http.put<StandardResponse>(`${this.baseUrl}`, supplier);
  }

  getAllList() {
    return this.http.get<Supplier[]>(`${this.baseUrl}/list` );
  }

  add(supplier: Supplier) {
    return this.http.post<StandardResponse>(`${this.baseUrl}`, supplier);
  }

  getLastSupCode() {
    return this.http.get<{code:string}>(`${this.baseUrl}/last`);
  }
}
