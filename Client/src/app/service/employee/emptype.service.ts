import {Empstatus} from "../../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../../entity/emptype";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class EmptypeService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {  }

   getAllList() {
    return  this.http.get<Emptype[]>(`${this.API_URL}/empolyeestypes/list`);

  }

}


