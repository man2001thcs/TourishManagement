import { UserService } from '../../utility/user_service/user.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, } from 'rxjs';
import { HashService } from '../../utility/user_service/hash.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private http: HttpClient,
    private userService: UserService,
    private hashService: HashService
  ) {}
  private url = '/api/controller/book/list_admin.php';
  private single_url = '/api/controller/book/find_book_admin.php';
  private password_key = 'admin_get';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(JSON.stringify(error)); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
