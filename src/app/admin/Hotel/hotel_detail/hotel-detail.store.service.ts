import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HotelStoreService {
  constructor(private http: HttpClient) {}

  getHotel(payload: any): Observable<any> {
    return this.http.get('/api/GetRestHouseContact/' + payload.id);
  }

  editHotel(payload: any): Observable<any> {
    console.log('ok');
    return this.http.put('/api/UpdateRestHouseContact/' + payload.id, payload);
  }
}
