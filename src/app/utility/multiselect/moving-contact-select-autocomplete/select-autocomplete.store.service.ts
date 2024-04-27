import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectMovingContactListStoreService {
  constructor(private http: HttpClient) {}

  getMovingContactList(payload: any): Observable<any> {
    return this.http.get("/api/GetMovingContact", {params: payload});
  }
}
