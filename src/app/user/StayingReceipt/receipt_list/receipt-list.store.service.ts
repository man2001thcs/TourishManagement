import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ReceiptListStoreService {
  constructor(private http: HttpClient) {}

  getReceiptList(payload: any): Observable<any> {
    return this.http.get("/api/GetReceipt/user/schedule", {params: payload});
  }

  deleteReceipt(payload: any): Observable<any> {
    return this.http.delete("/api/DeleteReceipt/schedule" + payload.id, payload);
  }
}
