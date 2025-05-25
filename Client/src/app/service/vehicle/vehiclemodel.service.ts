import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {VehicleModel} from "../../entity/vehiclemodel";
import {environment} from "../../../environments/environment";
const API_URL = environment.api_url + '/vehiclemodels';
@Injectable({
  providedIn: 'root'
})
export class VehiclemodelService {

  constructor(private http:HttpClient) { }

  getAll(){
    return this.http.get<VehicleModel[]>(API_URL);
  }
}
