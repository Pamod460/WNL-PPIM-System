import {environment} from "../../../environments/environment";
import {Employee} from "../../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Gender} from "../../entity/gender";
import {Privilege} from "../../entity/privilege";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
  providedIn: 'root'
})

export class PrivilageService {

  constructor(private http: HttpClient) {  }

   delete(id: number){

    return this.http.delete<StandardResponse>(environment.api_url + '/privileges/' + id);
  }

   update(privilage: Privilege){
    return this.http.put<StandardResponse>(environment.api_url + '/privileges', privilage);
  }


   getAll(query:string) {
 return   this.http.get<Privilege[]>(environment.api_url + '/privileges'+query);

  }


   add(privilege: Privilege){
    return this.http.post<StandardResponse>(environment.api_url + '/privileges', privilege);
  }




}


