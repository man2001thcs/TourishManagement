import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { TokenStorageService } from "./token.service";
import { UserService } from "./user.service";
import { MessageService } from "./message.service";

import { environment } from "src/environments/environment";

const TOKEN_HEADER_KEY = "Authorization";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  intercept(
    req: HttpRequest<any>,

    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let ok: string;
    //console.log("token: " ,this.tokenService.getToken());
    if (this.tokenService.getToken() != null) {
      let authReq = req;

      const token = this.tokenService.getToken();

      //console.log("token: " ,token);

      if (token != null) {
        authReq = this.addTokenHeader(req, token);
      }

      return next.handle(authReq).pipe(
        tap({
          next: (event) =>
            (ok = event instanceof HttpResponse ? "succeeded" : ""),
          error: (error) => {
            // if (error.status == 401) {
            //   localStorage.removeItem('token');
            //   this.router.navigateByUrl('/guest/list');
            // } else if (error.status == 403)
            //   this.router.navigateByUrl('/forbidden');

            if (
              error instanceof HttpErrorResponse &&
              !authReq.url.includes("user/login") &&
              error.status === 401
            ) {
              console.log("401");
              return this.handle401Error(authReq, next);
            }

            return throwError(() => error);
          },
        })
      );
    } else return next.handle(req.clone());
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const accessToken = this.tokenService.getToken();
      const refreshToken = this.tokenService.getRefreshToken();

      if (accessToken !== "" && refreshToken !== "") {
        this.tokenService
          .refreshToken(accessToken, refreshToken)
          .pipe(
            catchError((err) => {
              this.isRefreshing = false;

              this.tokenService.signOut();

              this.messageService.openFailNotifyDialog("Có lỗi xảy ra, vui lòng thử lại").subscribe(() => {
                setTimeout(() => {
                  this.router.navigate(["/guest/main-page"]);
                }, 1000);
              });
              return throwError(() => err);
            })
          )
          .subscribe((token: any) => {
            this.isRefreshing = false;       
            if (token.data) {
              this.tokenService.saveToken(token.data.accessToken);
              this.tokenService.saveRefreshToken(token.data.refreshToken);

              this.refreshTokenSubject.next(token.data.refreshToken);        
              
              return next.handle(
                this.addTokenHeader(request, this.tokenService.getToken())
              );
            } else {
              this.tokenService.signOut();
        
              this.messageService.closeAllDialog();
              this.refreshTokenSubject.next("");   

              this.messageService.openFailNotifyDialog("Phiên đăng nhập đã hết hiệu lực").subscribe(() => {
                setTimeout(() => {
                  this.router.navigate(["/guest/main-page"]);
                }, 1000);
              });

              return null;
            }

          });
      } else {
        this.isRefreshing = false;
        this.tokenService.signOut();
        this.refreshTokenSubject.next("");  

        this.messageService.closeAllDialog();
        this.messageService.openFailNotifyDialog("Phiên đăng nhập đã hết hiệu lực").subscribe(() => {
          setTimeout(() => {
            this.router.navigate(["/guest/login"]);
          }, 1000);
        });
      }
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    request.url
    return request.clone({
      url: environment.backend.baseURL + request.url,
      headers: request.headers.append(TOKEN_HEADER_KEY, "Bearer " + token),
    });
  }
}
