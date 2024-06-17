import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestHouseContactStoreService {
  constructor(private http: HttpClient) {}

  getRestHouseContact(payload: any): Observable<any> {
    return this.http.get('/api/GetRestHouseContact/' + payload.id);
  }

  editRestHouseContact(payload: any): Observable<any> {
    
    return this.http.put('/api/UpdateRestHouseContact/' + payload.id, payload);
  }
}
