import {Designation} from "../entity/designation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class DesignationService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Designation[]> {

    const designations = await this.http.get<Designation[]>('http://localhost:8080/designations/list').toPromise();
    if(designations == undefined){
      return [];
    }
    return designations;
  }

}


