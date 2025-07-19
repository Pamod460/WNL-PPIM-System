import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaperIssue} from "../../entity/PaperIssue";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class PaperissueService {
  readonly API_URL = environment.api_url + '/paperissues';

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<PaperIssue[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<PaperIssue[]>(`${this.API_URL}` + query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(paperIssue: PaperIssue) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, paperIssue);
  }

  add(paper: PaperIssue) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, paper);
  }

  getNextCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/next`);

  }
}
