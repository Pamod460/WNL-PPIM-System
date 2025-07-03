import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperPorder} from "../../entity/PaperPorder";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class PaperPorderService {

  readonly API_URL = environment.api_url+'/paperporders'

  constructor(private http:HttpClient) { }

  getAllList() {
    return this.http.get<PaperPorder[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<PaperPorder[]>(`${this.API_URL}`+query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(PaperPorder: PaperPorder) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, PaperPorder);
  }
  add(paper: PaperPorder) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, paper);
  }
}
