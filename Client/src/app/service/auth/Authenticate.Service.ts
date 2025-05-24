import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  readonly API_URL=environment.api_url
  constructor(private http: HttpClient) {
  }

   post(username: string, password: string){
    return this.http.post<[]>(`${this.API_URL}/login`, {
      username: username,
      password: password,
    }, { observe: 'response' } );
  }

}
