import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {VehicleStatus} from "../../entity/vehiclestatus";
const API_URL = environment.api_url + '/vehiclestatuses';

@Injectable({
  providedIn: 'root'
})
export class VehiclestatusService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VehicleStatus[]>(API_URL);
  }
}
