import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Userstatus} from "../../entity/userstatus";

@Injectable({
  providedIn: 'root'
})

export class UserstatusService {

  constructor(private http: HttpClient) {
  }

  getAllList() {

    return this.http.get<Userstatus[]>(environment.api_url + '/userstatuses/list')

  }

}


