import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestHouseContactStoreService {
  constructor(private http: HttpClient) {}

  createRestHouseContact(payload: any): Observable<any> {
    return this.http.post('/api/AddRestHouseContact', payload);
  }
}
