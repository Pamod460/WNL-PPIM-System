import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(private http: HttpClient) {
  }

  async post(username: string, password: string): Promise<any>{
    return this.http.post<[]>('http://localhost:8080/login', {
      username: username,
      password: password,
    }, { observe: 'response' } ).toPromise();
  }

}
