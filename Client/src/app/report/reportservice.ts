import {CountByDesignation} from "./entity/countbydesignation";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CountByDistrict} from "./entity/countbydistrict";

@Injectable({
  providedIn: 'root'
})

export class ReportService {

  constructor(private http: HttpClient) {  }

  async countByDesignation(): Promise<CountByDesignation[]> {

    const countbydesignations = await this.http.get<CountByDesignation[]>('http://localhost:8080/reports/countbydesignation').toPromise();
    if(countbydesignations == undefined){
      return [];
    }
    return countbydesignations;
  }
  async countByDistrict(): Promise<CountByDistrict[]> {

    const countbydisricts = await this.http.get<CountByDistrict[]>('http://localhost:8080/reports/countbydistrict').toPromise();
    if(countbydisricts == undefined){
      return [];
    }
    return countbydisricts;
  }

}


