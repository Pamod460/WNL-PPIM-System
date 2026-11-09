import {environment} from "../../../environments/environment";
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
    return this.http.delete<StandardResponse>(environment.api_url + '/users/' + username);
  }

  update(user: User) {

    return this.http.put<StandardResponse>(environment.api_url + '/users', user);
  }

  getAll(query: string) {
    return this.http.get<User[]>(environment.api_url + '/users/list' + query);
  }

  add(user: User) {
    return this.http.post<StandardResponse>(environment.api_url + '/users', user);
  }

  getEmployeeByUserName(username: string) {
    return this.http.get<Employee>(environment.api_url + '/users/empbyuser/' + username);

  }


  updatePassword(passwdChangeRequest: PasswdChangeRequest) {
    return this.http.put<any>(environment.api_url + '/users/user-passwd-update', passwdChangeRequest);
  }
}


