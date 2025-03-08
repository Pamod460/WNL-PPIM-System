import {Employee} from "../entity/employee";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../entity/user";

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) {  }

  async delete(username: string): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/users/' + username).toPromise();
  }

  async update(user: User): Promise<[]|undefined>{
    //console.log("Employee Updating-"+employee.id);
    return this.http.put<[]>('http://localhost:8080/users', user).toPromise();
  }

  async getAll(query:string): Promise<Array<User>> {
    const users = await this.http.get<Array<User>>('http://localhost:8080/users/list'+query).toPromise();
    if(users == undefined){
      return [];
    }
    return users;
  }

  async add(user: User): Promise<[]|undefined>{
    // console.log("aaaa");
    console.log(user);
    return this.http.post<[]>('http://localhost:8080/users', user).toPromise();
  }

  async getEmployeeByUserName(username: string): Promise<Array<Employee>>{
    const employees = await this.http.get<Array<Employee>>('http://localhost:8080/users/empbyuser/'+username).toPromise();
    if (employees == undefined){
      return [];
    }
    return employees;
  }


}


