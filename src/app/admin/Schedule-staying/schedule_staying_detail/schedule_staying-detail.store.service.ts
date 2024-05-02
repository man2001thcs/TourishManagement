import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StayingScheduleStoreService {
  constructor(private http: HttpClient) {}

  getStayingSchedule(payload: any): Observable<any> {
    return this.http.get('/api/GetStayingSchedule/' + payload.id);
  }

  editStayingSchedule(payload: any): Observable<any> {
    return this.http.put('/api/UpdateStayingSchedule/' + payload.id, payload);
  }
}
