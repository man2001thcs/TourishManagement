import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MultiSelectHotelListStoreService {
  constructor(private http: HttpClient) {}

  getHotelList(payload: any): Observable<any> {
    return this.http.get("/api/GetHotel", {params: payload});
  }

  getHomeStayList(payload: any): Observable<any> {
    return this.http.get("/api/GetHomeStay", {params: payload});
  }
}
