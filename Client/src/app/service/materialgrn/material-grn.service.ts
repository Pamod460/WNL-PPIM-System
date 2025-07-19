import { Injectable } from '@angular/core';
import {StandardResponse} from "../../entity/standardresponse";
import {MaterialGrn} from "../../entity/MaterialGrn";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MaterialGrnService {

  readonly API_URL = environment.api_url+'/materialgrns'

  constructor(private http:HttpClient) { }

  getAllList() {
    return this.http.get<MaterialGrn[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<MaterialGrn[]>(`${this.API_URL}`+query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(MaterialPorder: MaterialGrn) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, MaterialPorder);
  }
  add(materialgrn: MaterialGrn) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, materialgrn);
  }

  getNextCode(textPart: string) {
    return this.http.get<{code:string}>(`${this.API_URL}/next?textPart=`+textPart);

  }
}
