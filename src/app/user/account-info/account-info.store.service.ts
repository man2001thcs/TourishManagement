import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AccountStoreService {
  constructor(private http: HttpClient) {}

  getAccount(payload: any): Observable<any> {
    return this.http.post("/api/User/GetUser", null, {
      params: payload,
    });
  }

  editAccount(payload: any): Observable<any> {
    console.log("ok");
    return this.http.post("/api/User/Update" + payload.phase, payload);
  }
}
