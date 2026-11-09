import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Operation} from "../../entity/operation";

@Injectable({
  providedIn: 'root'
})

export class OperationService {

  constructor(private http: HttpClient) {
  }


  getAll(query: string) {
    return this.http.get<Operation[]>(environment.api_url + '/operations' + query);

  }


   getAllListByModule(id: number) {

   return  this.http.get<Array<Operation>>(environment.api_url + '/operations/list/' + id);

  }
}


