import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationStoreService {
  constructor(private http: HttpClient) {}

  getNotification(payload: any): Observable<any> {
    return this.http.get('/api/GetNotification/' + payload.id);
  }

  editNotification(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateNotification/' + payload.id, payload);
  }
}
