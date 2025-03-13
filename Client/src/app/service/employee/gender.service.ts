import {Gender} from "../../entity/gender";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class GenderService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {
  }

  getAllList()  {
    return this.http.get<Gender[]>(`${this.API_URL}/genders/list`);

  }

}


