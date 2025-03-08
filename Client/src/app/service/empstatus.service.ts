import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class EmpstatusService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Empstatus[]> {

    const employeestatuss = await this.http.get<Empstatus[]>('http://localhost:8080/employeestatuses/list').toPromise();
    if(employeestatuss == undefined){
      return [];
    }
    return employeestatuss;
  }

}


