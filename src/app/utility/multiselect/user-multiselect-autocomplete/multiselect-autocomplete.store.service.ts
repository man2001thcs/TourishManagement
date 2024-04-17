import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MultiSelectUserListStoreService {
  constructor(private http: HttpClient) {}

  getUserList(payload: any): Observable<any> {
    return this.http.get("/api/User/GetUserList", {params: payload});
  }
}
