import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Unittype} from "../../entity/Unittype";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UnittypeService {
  readonly API_URL=environment.api_url
  private baseUrl = `${this.API_URL}/unittypes`;

  constructor(private http: HttpClient) {
  }

  getAll(query = ''): Observable<Unittype[]> {
    return this.http.get<Unittype[]>(`${this.baseUrl}` + query);
  }

}
