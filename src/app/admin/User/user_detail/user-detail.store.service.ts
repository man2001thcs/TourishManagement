import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserStoreService {
  constructor(private http: HttpClient) {}

  getUser(payload: any): Observable<any> {
    return this.http.get("/api/User/GetUser", {
      params: payload,
    });
  }

  editUser(payload: any): Observable<any> {
    
    return this.http.post("/api/User/Update", payload);
  }
}
