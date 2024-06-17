import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptStoreService {
  constructor(private http: HttpClient) {}

  getReceipt(payload: any): Observable<any> {
    return this.http.get('/api/GetFullReceipt/schedule/' + payload.id);
  }

  editReceipt(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateReceipt/' + payload.fullReceiptId, payload);
  }
}
