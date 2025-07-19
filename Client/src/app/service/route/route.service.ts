import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

import {StandardResponse} from "../../entity/standardresponse";
import {Route} from "../../entity/Route";

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  readonly API_URL = environment.api_url + "/routes"

  constructor(private http: HttpClient) {
  }

  getAllList() {

    return this.http.get<Route[]>(`${this.API_URL}/list`);
  }

  getAll(query: string) {
    return this.http.get<Route[]>(`${this.API_URL}` + query);

  }

  update(route: Route) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, route);

  }

  delete(id: number) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/${id}`);

  }

  add(route: Route) {
    return this.http.post<StandardResponse>(`${this.API_URL}`, route);

  }

  getNextCode(name: string) {
    return this.http.get<{ code: string }>(`${this.API_URL}/nextcode/${name}`);
  }
}
