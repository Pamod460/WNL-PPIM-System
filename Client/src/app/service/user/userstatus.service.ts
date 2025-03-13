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

    return this.http.get<Userstatus[]>('http://localhost:8080/userstatuses/list')

  }

}


