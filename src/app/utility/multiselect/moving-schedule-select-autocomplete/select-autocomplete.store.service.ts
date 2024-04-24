import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MultiSelectMovingScheduleListStoreService {
  constructor(private http: HttpClient) {}

  getMovingScheduleList(payload: any): Observable<any> {
    return this.http.get("/api/MovingSchedule/GetMovingScheduleList", {params: payload});
  }
}
