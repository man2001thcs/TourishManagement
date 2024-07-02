import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NotificationListStoreService {
  constructor(private http: HttpClient) {}

  getNotificationList(payload: any): Observable<any> {
    return this.http.get("/api/GetNotification/creator", {params: payload});
  }

  deleteNotification(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteNotification/" + payload.id, payload);
  }
}
