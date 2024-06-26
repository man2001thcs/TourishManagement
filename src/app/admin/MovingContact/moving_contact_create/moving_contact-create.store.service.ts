import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovingContactStoreService {
  constructor(private http: HttpClient) {}

  createMovingContact(payload: any): Observable<any> {
    return this.http.post('/api/AddMovingContact', payload);
  }
}
