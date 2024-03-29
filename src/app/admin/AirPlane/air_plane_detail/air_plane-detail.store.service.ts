import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirPlaneDetailStoreService {
  constructor(private http: HttpClient) {}

  getAirPlane(payload: any): Observable<any> {
    return this.http.get('/api/GetMovingContact/' + payload.id);
  }

  editAirPlane(payload: any): Observable<any> {
    console.log('ok');
    return this.http.put('/api/UpdateMovingContact/' + payload.id, payload);
  }
}
