import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RestHouseContactListStoreService {
  constructor(private http: HttpClient) {}

  getRestHouseContactList(payload: any): Observable<any> {
    return this.http.get("/api/GetRestHouseContact", {params: payload});
  }

  deleteRestHouseContact(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteRestHouseContact/" + payload.id, payload);
  }
}
