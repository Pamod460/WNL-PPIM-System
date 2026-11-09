import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Usrtype} from "../../entity/usrtype";

@Injectable({
  providedIn: 'root'
})

export class UsrtypeService {

  constructor(private http: HttpClient) {  }

   getAllList(){

   return  this.http.get<Usrtype[]>(environment.api_url + '/usrtypes/list');

  }

}


