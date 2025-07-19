import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperGrn} from "../../entity/PaperGrn";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class PaperGrnService {

  readonly API_URL = environment.api_url+'/papergrns'

  constructor(private http:HttpClient) { }

  getAllList() {
    return this.http.get<PaperGrn[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<PaperGrn[]>(`${this.API_URL}`+query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(PaperPorder: PaperGrn) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, PaperPorder);
  }
  add(papergrn: PaperGrn) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, papergrn);
  }

  getNextCode(textPart: string) {
    return this.http.get<{code:string}>(`${this.API_URL}/next?textPart=`+textPart);

  }
}
