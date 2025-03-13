import {Employee} from "../../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {StandardResponse} from "../../entity/standardresponse";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {  }

   delete(id: number){
    return this.http.delete<StandardResponse>(`${this.API_URL}/employees/` + id);
  }

   update(employee: Employee){
    return this.http.put<StandardResponse>(`${this.API_URL}/employees`, employee);
  }


   getAll(query:string) {
     return this.http.get<Employee[]>(`${this.API_URL}/employees` + query);
  }

   getAllListNameId() {

    return this.http.get<Employee[]>(`${this.API_URL}/employees/list`);
  }

   add(employee: Employee){
    return this.http.post<StandardResponse>(`${this.API_URL}/employees`, employee);
  }

  getLastEmpCode() {
    return this.http.get<{code:string}>(`${this.API_URL}/employees/last`);
  }
}


