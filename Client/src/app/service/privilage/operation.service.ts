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
    return this.http.get<Operation[]>('http://localhost:8080/operations' + query);

  }


   getAllListByModule(id: number) {

   return  this.http.get<Array<Operation>>('http://localhost:8080/operations/list/' + id);

  }
}


