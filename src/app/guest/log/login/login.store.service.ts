import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel } from './login.component.model';

@Injectable({
  providedIn: 'root'
})
export class BooklistStoreService {

  constructor(private http: HttpClient) { }

  login(payload: LoginModel) : Observable<any> {
    return this.http.post("/api/User/login", payload);
  }
}
