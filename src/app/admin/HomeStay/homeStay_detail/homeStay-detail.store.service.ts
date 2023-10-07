import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeStayStoreService {
  constructor(private http: HttpClient) {}

  getHomeStay(payload: any): Observable<any> {
    return this.http.get('/api/GetHomeStay/' + payload.id);
  }

  editHomeStay(payload: any): Observable<any> {
    console.log('ok');
    return this.http.put('/api/UpdateHomeStay/' + payload.id, payload);
  }
}
