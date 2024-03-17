import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MultiSelectTourishCategoryListStoreService {
  constructor(private http: HttpClient) {}

  getTourishCategoryList(payload: any): Observable<any> {
    return this.http.get("/api/GetTourCategory", {params: payload});
  }
}
