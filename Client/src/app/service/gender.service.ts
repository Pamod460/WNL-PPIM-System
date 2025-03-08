import {Gender} from "../entity/gender";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class GenderService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Gender[]> {

    const genders = await this.http.get<Gender[]>('http://localhost:8080/genders/list').toPromise();
    if(genders == undefined){
      return [];
    }
    return genders;
  }

}


