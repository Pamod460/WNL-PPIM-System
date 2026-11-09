import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Module} from "../../entity/module";

@Injectable({
  providedIn: 'root'
})

export class ModuleService {

  constructor(private http: HttpClient) {
  }

  getAllList() {
    return this.http.get<Module[]>(environment.api_url + '/modules/list');

  }

}


