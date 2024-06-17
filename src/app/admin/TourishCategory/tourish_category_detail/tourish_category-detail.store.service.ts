import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourishCategoryDetailStoreService {
  constructor(private http: HttpClient) {}

  getTourishCategory(payload: any): Observable<any> {
    return this.http.get('/api/GetTourCategory/' + payload.id);
  }

  editTourishCategory(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateTourCategory/' + payload.id, payload);
  }
}
