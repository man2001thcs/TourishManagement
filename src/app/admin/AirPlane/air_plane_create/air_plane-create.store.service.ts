import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AirPlaneCreateStoreService {
  constructor(private http: HttpClient) {}

  createAirPlane(payload: any): Observable<any> {
    return this.http.post('/api/AddMovingContact', payload);
  }
}
