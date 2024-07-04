import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HashService } from "./hash.service";
@Injectable({
  providedIn: "root",
})
export class UserService {
  private urlCategory = "/api/Category";

  constructor(private http: HttpClient, private hash: HashService) {}

  searchBook(search: string): Observable<any> {
    let get_body = {
      page: 1,
      pageSize: 5,
      search: search
    };

    return this.http.get<any>("/api/GetBook", { params: get_body });
  }

  searchAuthor(search: string): Observable<any> {
    let get_body = {
      page: 1,
      pageSize: 5,
      search: search
    };

    return this.http.get<any>("/api/GetAuthor", { params: get_body });
  }

  getCategory(page_number: number, page_offset: number): Observable<any> {
    let get_body = {
      page: page_number,
      pageSize: page_offset,
    };

    return this.http.get<any>("/api/GetCategory", { params: get_body });
  }

  getAuthor(page_number: number, page_offset: number): Observable<any> {
    let get_body = {
      page: page_number,
      pageSize: page_offset,
    };

    return this.http.get<any>("/api/GetAuthor", { params: get_body });
  }

  getPublisher(page_number: number, page_offset: number): Observable<any> {
    let get_body = {
      page: page_number,
      pageSize: page_offset,
    };

    return this.http.get<any>("/api/GetPublisher", { params: get_body });
  }

  // var payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
}
