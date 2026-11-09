import {environment} from "../../../environments/environment";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})

export class RegexService {

  constructor(private http: HttpClient) {
  }

  get(type: string) {

    return this.http.get<[]>(environment.api_url + '/regexes/' + type);

  }

}


