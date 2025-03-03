import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Opetype} from "../entity/opetype";

@Injectable({
  providedIn: 'root'
})

export class Opetypeservice {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Opetype>> {

    const opetypes = await this.http.get<Array<Opetype>>('http://localhost:8080/opetypes/list').toPromise();
    if(opetypes == undefined){
      return [];
    }
    return opetypes;
  }

}


