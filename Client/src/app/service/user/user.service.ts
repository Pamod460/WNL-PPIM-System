import {Employee} from "../../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../../entity/user";
import {StandardResponse} from "../../entity/standardresponse";
import {PasswdChangeRequest} from "../../entity/PasswdChangeRequest";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {
  }

  delete(username: string) {
    return this.http.delete<StandardResponse>('http://localhost:8080/users/' + username);
  }

  update(user: User) {

    return this.http.put<StandardResponse>('http://localhost:8080/users', user);
  }

  getAll(query: string) {
    return this.http.get<User[]>('http://localhost:8080/users/list' + query);
  }

  add(user: User) {
    return this.http.post<StandardResponse>('http://localhost:8080/users', user);
  }

  getEmployeeByUserName(username: string) {
    return this.http.get<Employee>('http://localhost:8080/users/empbyuser/' + username);

  }


  updatePassword(passwdChangeRequest: PasswdChangeRequest) {
    return this.http.put<any>('http://localhost:8080/users/user-passwd-update', passwdChangeRequest);
  }
}


