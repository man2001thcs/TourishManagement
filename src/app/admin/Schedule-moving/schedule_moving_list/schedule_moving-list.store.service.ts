import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MovingScheduleListStoreService {
  constructor(private http: HttpClient) {}

  getMovingScheduleList(payload: any): Observable<any> {
    return this.http.get("/api/GetMovingSchedule", {params: payload});
  }

  deleteMovingSchedule(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteMovingSchedule/" + payload.id, payload);
  }
}
