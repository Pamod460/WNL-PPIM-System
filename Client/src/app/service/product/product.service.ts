import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../../entity/Product";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly API_URL = environment.api_url
  private baseUrl = `${this.API_URL}/products`;

  constructor(private http: HttpClient) {
  }

  delete(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  update(entity: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}`, entity);
  }

  getAll(query: string) {
    return this.http.get<Product[]>(`${this.baseUrl}` + query);
  }

  add(entity: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, entity);
  }


  getLastProductCode() {
    return this.http.get<{code:string}>(`${this.baseUrl}` + '/last');

  }
}
