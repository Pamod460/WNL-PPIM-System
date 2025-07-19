import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {MaterialIssue} from "../../entity/MaterialIssue";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class MaterialissueService {
  readonly API_URL = environment.api_url + '/materialissues'

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<MaterialIssue[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    const res = this.http.get<MaterialIssue[]>(`${this.API_URL}` + query);
    console.log(res)
    return res;
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(materialIssue: MaterialIssue) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, materialIssue);
  }

  add(material: MaterialIssue) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, material);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/next`);

  }
}
