import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PassengerCarListStoreService {
  constructor(private http: HttpClient) {}

  getPassengerCarList(payload: any): Observable<any> {
    return this.http.get("/api/GetMovingContact", {params: payload});
  }

  deletePassengerCar(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteMovingContact/" + payload.id, payload);
  }
}
