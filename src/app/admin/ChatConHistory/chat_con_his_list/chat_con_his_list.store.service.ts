import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GuestMessageConHistoryListStoreService {
  constructor(private http: HttpClient) {}

  getGuestMessageConHistoryList(payload: any): Observable<any> {
    return this.http.get("/api/GetGuestMessageConHistory", {params: payload});
  }
}
