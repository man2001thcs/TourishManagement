import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class HotelListStoreService {
  constructor(private http: HttpClient) {}

  getHotelList(payload: any): Observable<any> {
    return this.http.get("/api/GetHotel", {params: payload});
  }

  deleteHotel(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteHotel/" + payload.id, payload);
  }
}
