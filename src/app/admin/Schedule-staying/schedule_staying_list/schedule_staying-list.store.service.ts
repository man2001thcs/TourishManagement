import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class StayingScheduleListStoreService {
  constructor(private http: HttpClient) {}

  getStayingScheduleList(payload: any): Observable<any> {
    return this.http.get("/api/GetStayingSchedule", {params: payload});
  }

  deleteStayingSchedule(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteStayingSchedule/" + payload.id, payload);
  }
}
