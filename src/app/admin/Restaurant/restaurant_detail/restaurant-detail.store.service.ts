import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantStoreService {
  constructor(private http: HttpClient) {}

  getRestaurant(payload: any): Observable<any> {
    return this.http.get('/api/GetRestaurant/' + payload.id);
  }

  editRestaurant(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateRestaurant/' + payload.id, payload);
  }
}
