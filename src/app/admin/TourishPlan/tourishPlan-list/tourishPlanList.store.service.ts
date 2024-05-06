import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TourishPlanListStoreService {
  constructor(private http: HttpClient) {}

  getTourishPlanList(payload: any): Observable<any> {
    return this.http.get("/api/GetTourishPlan/with-authority", {params: payload});
  }

  deleteTourishPlan(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteTourishPlan/" + payload.id, payload);
  }
}
