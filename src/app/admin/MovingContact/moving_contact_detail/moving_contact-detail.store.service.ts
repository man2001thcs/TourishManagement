import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovingContactStoreService {
  constructor(private http: HttpClient) {}

  getMovingContact(payload: any): Observable<any> {
    return this.http.get('/api/GetMovingContact/' + payload.id);
  }

  editMovingContact(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateMovingContact/' + payload.id, payload);
  }
}
