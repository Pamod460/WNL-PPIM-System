import {Empstatus} from "../../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class EmpstatusService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {  }

   getAllList() {
    return  this.http.get<Empstatus[]>(`${this.API_URL}/employeestatuses/list`);
  }

}


