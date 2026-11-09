import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Role} from "../../entity/role";

@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<Role[]>(environment.api_url + '/roles/list');
  }

}


