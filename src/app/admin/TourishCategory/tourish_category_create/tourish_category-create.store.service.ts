import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TourishCategoryCreateStoreService {
  constructor(private http: HttpClient) {}

  createTourishCategory(payload: any): Observable<any> {
    return this.http.post('/api/AddTourCategory', payload);
  }
}
