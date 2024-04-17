import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserListStoreService {
  constructor(private http: HttpClient) {}

  getUserList(payload: any): Observable<any> {
    return this.http.get("/api/User/GetUserList", {params: payload});
  }

  deleteUser(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteUser/" + payload.id, payload);
  }
}
