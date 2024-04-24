import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovingScheduleStoreService {
  constructor(private http: HttpClient) {}

  getMovingSchedule(payload: any): Observable<any> {
    return this.http.get('/api/GetMovingContact/' + payload.id);
  }

  editMovingSchedule(payload: any): Observable<any> {
    console.log('ok');
    return this.http.put('/api/UpdateMovingContact/' + payload.id, payload);
  }
}
