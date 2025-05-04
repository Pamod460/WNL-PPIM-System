import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Material} from "../../entity/Material";
import {environment} from "../../../environments/environment";
import {StandardResponse} from "../../entity/standardresponse";

@Injectable({
    providedIn: 'root'
})
export class MaterialService {
    readonly API_URL = environment.api_url

    constructor(private http: HttpClient) {
    }

    delete(id: number | undefined) {
        return this.http.delete<StandardResponse>(`${this.API_URL}/materials/` + id);
    }

    update(employee: Material) {
        return this.http.put<StandardResponse>(`${this.API_URL}/materials`, employee);
    }

    getAll(query: string) {
        return this.http.get<Material[]>(`${this.API_URL}/materials/` + query);
    }
    getAllList() {
        return this.http.get<Material[]>(`${this.API_URL}/materials/list`);
    }

    add(material: Material) {

        return this.http.post<StandardResponse>(`${this.API_URL}/materials`, material);
    }


}
