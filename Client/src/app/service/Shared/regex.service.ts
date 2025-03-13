import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})

export class RegexService {

  constructor(private http: HttpClient) {
  }

  get(type: string) {

    return this.http.get<[]>('http://localhost:8080/regexes/' + type);

  }

}


