import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourishPlanStoreService {
  constructor(private http: HttpClient) {}

  getTourishPlan(payload: any): Observable<any> {
    return this.http.get('/api/GetTourishPlan/' + payload.id);
  }

  editTourishPlan(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateTourishPlan/' + payload.id, payload);
  }
}
