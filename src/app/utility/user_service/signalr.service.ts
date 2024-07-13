import { Injectable } from "@angular/core";
import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  throwError,
} from "rxjs";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  private readonly url = environment.backend.baseURL;
  private hubConnection!: HubConnection;
  private $allFeed = new Subject<any>();
  private $notifyFeed = new Subject<any>();
  private $clientFeed = new Subject<any>();
  private $connFeed = new Subject<any>();
  private $botFeed = new Subject<any>();

  private $isNotifyReadFeed = new Subject<any>();
  private isRefreshing = false;

  private err401String =
    "Error: Failed to complete negotiation with the server: Error: : Status code '401'";
  constructor(
    private tokenService: TokenStorageService,
    private messageService: MessageService,
    private router: Router
  ) {}
  //private readonly url = "https://localhost:53985/api/";

  public startConnection(urlExtend: string) {
    //"user/notify"
    if (
      this.hubConnection?.state === HubConnectionState.Connected ||
      this.hubConnection?.state === HubConnectionState.Connecting
    ) {
      this.hubConnection.stop();
    }

    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.url + urlExtend, {
          accessTokenFactory: async () => this.tokenService.getToken(),
        })
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log(urlExtend + " connection established");
          return resolve(true);
        })
        .catch((err: any) => {
          if (err.toString() === this.err401String) this.handle401Error();
          reject(err);
        });
    });
  }

  public startConnectionWithParam(urlExtend: string, param: any) {
    //"user/notify"
    if (
      this.hubConnection?.state === HubConnectionState.Connected ||
      this.hubConnection?.state === HubConnectionState.Connecting
    ) {
      this.hubConnection.stop();
    }

    return new Promise((resolve, reject) => {
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(this.buildUrlWithParams(this.url + urlExtend, param), {
          accessTokenFactory: async () => this.tokenService.getToken(),
        })
        .configureLogging(LogLevel.Information)
        .build();

      this.hubConnection
        .start()
        .then(() => {
          console.log(urlExtend + " connection established");
          return resolve(true);
        })
        .catch((err: any) => {
          if (err.toString() === this.err401String) this.handle401Error();
          reject(err);
        });
    });
  }

  private buildUrlWithParams(baseUrl: string, params: any): string {
    let url = baseUrl;
    if (params) {
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");
      if (queryString) {
        url += "?" + queryString;
      }
    }
    return url;
  }

  public get AllFeedObservable(): Observable<any> {
    return this.$allFeed.asObservable().pipe(distinctUntilChanged());
  }

  public get NotifyFeedObservable(): Observable<any> {
    return this.$notifyFeed.asObservable().pipe(distinctUntilChanged());
  }

  public get ClientFeedObservable(): Observable<any> {
    return this.$clientFeed.asObservable().pipe(distinctUntilChanged());
  }

  public get ConnFeedObservable(): Observable<any> {
    return this.$connFeed.asObservable().pipe(distinctUntilChanged());
  }

  public get BotFeedObservable(): Observable<any> {
    return this.$botFeed.asObservable().pipe(distinctUntilChanged());
  }

  public get IsNotifyReadObservable(): Observable<any> {
    return this.$isNotifyReadFeed.asObservable().pipe(distinctUntilChanged());
  }

  public listenToAllFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(listenPort, (data: any) => {
      if (data) {
        this.$allFeed.next(data);
      }
    });
  }

  public listenToNotifyFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: any, data2: any) => {
        if (data1) {
          this.$notifyFeed.next(data2);
        }
      }
    );
  }

  public listenToClientFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: any, data2: any) => {
        if (data1) {
          this.$clientFeed.next(data2);
        }
      }
    );
  }


  public listenToClientFeedsThree(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: any, data2: any, data3: any) => {
        if (data1) {
          this.$clientFeed.next({ data1: data1, data2: data2, data3: data3 });
        }
      }
    );
  }

  public listenToConnFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: string, data2: any) => {
        if (data1) {
          this.$connFeed.next({ adminId: data1, connHis: data2 });
        }
      }
    );
  }

  public listenToIsNotifyReadFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: any, data2: any) => {
        if (data1) {
          this.$isNotifyReadFeed.next({ id: data1, isRead: data2 });
        }
      }
    );
  }

  public invokeTwoInfoFeed(
    listenMethod: string,
    info1: string,
    info2: string,
    data: any
  ) {
    (<HubConnection>this.hubConnection).invoke(
      listenMethod,
      info1,
      info2,
      data
    );
  }

  public invokeOneInfoFeeds(listenMethod: string, info1: string, data: any) {
    (<HubConnection>this.hubConnection).invoke(listenMethod, info1, data);
  }

  public stopConnect() {
    this.hubConnection.stop();
  }

  private handle401Error() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      const accessToken = this.tokenService.getToken();
      const refreshToken = this.tokenService.getRefreshToken();

      if (accessToken !== "" && refreshToken !== "") {
        this.tokenService
          .refreshToken(accessToken, refreshToken)
          .pipe(
            catchError((err) => {
              this.isRefreshing = false;

              this.messageService.closeAllDialog();
              this.tokenService.signOut();
              this.messageService
                .openFailNotifyDialog("Có lỗi xảy ra, vui lòng đăng nhập lại")
                .subscribe(() => {
                  setTimeout(() => {
                    this.router.navigate(["/guest/list"]);
                  }, 1000);
                });
              return throwError(() => err);
            })
          )
          .subscribe(async (token: any) => {
            this.isRefreshing = false;
            if (token.data) {
              this.tokenService.saveToken(token.data.accessToken);
              this.tokenService.saveRefreshToken(token.data.refreshToken);

              let urlExtend = this.hubConnection.baseUrl.replaceAll(
                this.url,
                ""
              );

              this.hubConnection.stop();
              await this.startConnection(urlExtend);
              return;
            } else {
              this.tokenService.signOut();

              this.messageService.closeAllDialog();
              this.messageService
                .openFailNotifyDialog("Phiên đăng nhập đã hết hiệu lực")
                .subscribe(() => {
                  setTimeout(() => {
                    this.router.navigate(["/guest/list"]);
                  }, 1000);
                });

              setTimeout(() => {
                this.router.navigate(["/guest/list"]);
              }, 1000);

              return;
            }
          });
      } else {
        this.isRefreshing = false;
        this.tokenService.signOut();

        this.messageService.closeAllDialog();
        this.messageService.openFailNotifyDialog(
          "Phiên đăng nhập đã hết hiệu lực"
        );

        setTimeout(() => {
          this.router.navigate(["/guest/list"]);
        }, 1000);
      }
    }
  }
}
