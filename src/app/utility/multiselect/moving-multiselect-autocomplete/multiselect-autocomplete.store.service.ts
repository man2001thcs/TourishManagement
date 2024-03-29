import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MultiSelectMovingListStoreService {
  constructor(private http: HttpClient) {}

  getMovingList(payload: any): Observable<any> {
    return this.http.get("/api/GetMovingContact", {params: payload});
  }
}
