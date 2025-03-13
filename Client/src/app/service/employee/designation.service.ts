import {Designation} from "../../entity/designation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class DesignationService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<Designation[]>(`${this.API_URL}/designations/list`);
  }

}


