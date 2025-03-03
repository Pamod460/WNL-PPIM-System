import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Operation} from "../entity/operation";

@Injectable({
  providedIn: 'root'
})

export class Operationservice {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    // @ts-ignore
    return this.http.delete('http://localhost:8080/operations/' + id).toPromise();
  }

  async update(privilage: Operation): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/operations', privilage).toPromise();
  }


  async getAll(query:string): Promise<Array<Operation>> {
    const privilages = await this.http.get<Array<Operation>>('http://localhost:8080/operations'+query).toPromise();
    if(privilages == undefined){
      return [];
    }
    return privilages;
  }


  async add(operation: Operation): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/operations', operation).toPromise();
  }


  async getAllListByModule(id:number): Promise<Array<Operation>> {

    const operstions = await this.http.get<Array<Operation>>('http://localhost:8080/operations/list/' + id).toPromise();
    if(operstions == undefined){
      return [];
    }
    return operstions;
  }
}


