import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReceiptStoreService {
  constructor(private http: HttpClient) {}

  createReceipt(payload: any): Observable<any> {
    return this.http.post('/api/AddReceipt', payload);
  }
}
