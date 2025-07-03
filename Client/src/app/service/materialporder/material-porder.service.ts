import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MaterialPorder} from "../../entity/MaterialPorder";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class MaterialPorderService {

  readonly API_URL = environment.api_url+'/materialporders'

  constructor(private http:HttpClient) { }

  getAllList() {
    return this.http.get<MaterialPorder[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<MaterialPorder[]>(`${this.API_URL}`+query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(MaterialPorder: MaterialPorder) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, MaterialPorder);
  }
  add(material: MaterialPorder) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, material);
  }
}
