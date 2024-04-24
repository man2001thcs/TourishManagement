import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovingScheduleStoreService {
  constructor(private http: HttpClient) {}

  createMovingSchedule(payload: any): Observable<any> {
    return this.http.post('/api/AddMovingContact', payload);
  }
}
