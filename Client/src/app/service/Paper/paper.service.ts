import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Paper} from "../../entity/Paper";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})
export class PaperService {
  readonly API_URL = environment.api_url + '/papers'

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<Paper[]>(`${this.API_URL}/list`);
  }


  getAll(query: string) {
    return this.http.get<Paper[]>(`${this.API_URL}` + query);
  }

  delete(id: number | undefined) {
    return this.http.delete<StandardResponse>(`${this.API_URL}/` + id);
  }

  update(paper: Paper) {
    return this.http.put<StandardResponse>(`${this.API_URL}`, paper);
  }

  add(material: Paper) {

    return this.http.post<StandardResponse>(`${this.API_URL}`, material);
  }

  getNextCode(textPart: string) {
    return this.http.get<{code:string}>(`${this.API_URL}/next?textPart=`+textPart);

  }
}
