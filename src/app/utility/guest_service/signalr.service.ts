import { Injectable } from "@angular/core";
import {
  Observable,
  Subject,
  catchError,
  throwError,
} from "rxjs";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import proxy_config from "../../proxy_config.json";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class GuestSignalRService {
  private readonly url = proxy_config["/api/*"].target;
  private hubConnection!: HubConnection;
  private $allFeed = new Subject<any>();
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
        .withUrl(this.url + urlExtend + "?adminId=value1")
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

  public get AllFeedObservable(): Observable<any> {
    return this.$allFeed.asObservable();
  }

  public listenToAllFeeds(listenPort: string) {
    (<HubConnection>this.hubConnection).on(listenPort, (data: any) => {
      if (data) {
        this.$allFeed.next(data);
      }
    });
  }

  public listenToAllFeedsTwo(listenPort: string) {
    (<HubConnection>this.hubConnection).on(
      listenPort,
      (data1: any, data2: any) => {
        if (data1) {
          this.$allFeed.next(data2);
        }
      }
    );
  }

  public invokeFeed(listenMethod: string, userSendId: string, userReceiveId: string, data: any) {
    (<HubConnection>this.hubConnection).invoke(listenMethod, userReceiveId, data);
  }

  public invokeAllFeeds(listenMethod: string, data: any) {
    (<HubConnection>this.hubConnection).invoke(listenMethod, data);
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
              this.messageService.openFailNotifyDialog(
                "Có lỗi xảy ra, vui lòng đăng nhập lại"
              ).subscribe(() => {
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