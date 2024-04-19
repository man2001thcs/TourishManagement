import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  constructor(private http: HttpClient) {}

  reclaimUser(payload: any): Observable<any> {
    return this.http.post('/api/User/' + payload.signInPhase, payload);
  }

  assignPassword(payload: any): Observable<any> {
    return this.http.post('/api/User/ReclaimPassword', payload);
  }
}
