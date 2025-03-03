import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";

@Injectable({
  providedIn: 'root'
})

export class Usrtypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Usrtype>> {

    const usertpes = await this.http.get<Array<Usrtype>>('http://localhost:8080/usrtypes/list').toPromise();
    if(usertpes == undefined){
      return [];
    }
    return usertpes;
  }

}


