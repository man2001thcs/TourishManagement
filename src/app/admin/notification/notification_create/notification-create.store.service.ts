import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationStoreService {
  constructor(private http: HttpClient) {}

  createNotification(payload: any): Observable<any> {
    return this.http.post('/api/AddNotification', payload);
  }
}
