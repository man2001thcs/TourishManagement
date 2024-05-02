import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectRestHouseContactListStoreService {
  constructor(private http: HttpClient) {}

  getRestHouseContactList(payload: any): Observable<any> {
    return this.http.get("/api/GetRestHouseContact", {params: payload});
  }
}
