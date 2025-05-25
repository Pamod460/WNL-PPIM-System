import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {StandardResponse} from "../../entity/standardresponse";
import {Vehicle} from "../../entity/vehicle";
const API_URL = environment.api_url + '/vehicles';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private http: HttpClient) {}

  getAll(query:string) {
    return  this.http.get<Vehicle[]>(API_URL +query);
  }

  add(vehicle: Vehicle){
    return this.http.post<StandardResponse>(API_URL, vehicle);
  }

  update(vehicle: Vehicle){
    return this.http.put<StandardResponse>(API_URL, vehicle);
  }

  delete(id: number){
    return this.http.delete<StandardResponse>(API_URL+ '/' + id);
  }

  // getNextConnCode() {
  //   return this.http.get<StandardResponse>(`${this.API_URL}/connrequests/next`);
  // }
}
