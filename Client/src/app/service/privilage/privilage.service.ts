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

    return this.http.delete<StandardResponse>('http://localhost:8080/privileges/' + id);
  }

   update(privilage: Privilege){
    return this.http.put<StandardResponse>('http://localhost:8080/privileges', privilage);
  }


   getAll(query:string) {
 return   this.http.get<Privilege[]>('http://localhost:8080/privileges'+query);

  }


   add(privilege: Privilege){
    return this.http.post<StandardResponse>('http://localhost:8080/privileges', privilege);
  }




}


