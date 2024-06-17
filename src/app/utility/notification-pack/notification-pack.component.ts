import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { Notification } from "src/app/model/baseModel";
import { TokenStorageService } from "../user_service/token.service";
import { getViNotifyMessagePhase } from "../config/notificationCode";
import { SignalRService } from "../user_service/signalr.service";
import { Subscription, catchError, of } from "rxjs";
import { environment } from "src/environments/environment";
import { messaging } from "src/conf/firebase.conf";
import { MessageService } from "../user_service/message.service";

@Component({
  selector: "app-notification-pack",
  templateUrl: "./notification-pack.component.html",
  styleUrls: ["./notification-pack.component.css"],
})
export class NotificationPackComponent implements OnInit, OnDestroy {
  @Input()
  isNotifyOpen = false;

  @Output() notifyUnreadNumber: EventEmitter<number> =
    new EventEmitter<number>();

  @ViewChild("singleNotify") singleNotifyContainer!: ElementRef;
  @ViewChild("notifyPack") notifyPackContainer!: ElementRef;

  active = 1;
  avatarUrl = environment.backend.blobURL + "/0-container/0_anonymus.png";
  signleNotifyWidth = "350px";

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;
  firstLoading = true;

  notificationList: Notification[] = [];
  subscriptions: Subscription[] = [];
  length = 0;
  pageSize = 20;

  color: ThemePalette = "primary";
  isNotRead: number = 0;
  scrollSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private messageService: MessageService,
    private signalRService: SignalRService
  ) {}
  ngOnDestroy(): void {
    this.signalRService.stopConnect();
  }

  ngOnInit() {
    this.requestPermission();
    this.listen();
    this.signalRNotification();

    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.getNotifyPack();

    this.subscriptions.push(
      this.signalRService.NotifyFeedObservable.subscribe(
        (notification: Notification) => {
          if (notification) {
            let index = this.notificationList.findIndex(
              (res) => res.id === notification.id
            );

            if (index > -1) {
              this.notificationList[index] = notification;
            } else {
              this.notificationList = [notification, ...this.notificationList];
              this.isNotRead++;
              this.notifyUnreadNumber.emit(this.isNotRead);
            }
          }
        }
      )
    );

    this.subscriptions.push(
      this.signalRService.IsNotifyReadObservable.subscribe((res: any) => {
        if (res) {
          if (res.isRead) {
            const index = this.notificationList.findIndex(
              (entity) => entity.id === res.id
            );
            if (index > -1) {
              if (!this.notificationList[index].isRead) {
                this.notificationList[index].isRead = true;
                this.isNotRead--;
                this.notifyUnreadNumber.emit(this.isNotRead);
              }
            }
          }
        }
      })
    );
  }

  ngAfterViewInit(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.adjustSize();
      }
    });

    // Observe the childDiv element for size changes
    resizeObserver.observe(this.notifyPackContainer.nativeElement);
    this.adjustSize();
  }

  signalRNotification() {
    const queryParameters = {
      token: this.tokenStorage.getToken(),
    };

    this.signalRService
      .startConnectionWithParam("/api/user/notify", queryParameters)
      .then(() => {
        // 2 - register for ALL relay
        this.signalRService.listenToNotifyFeeds("SendOffersToUser");
        this.signalRService.listenToIsNotifyReadFeeds("ChangeNotifyToRead");
      });
  }

  getNotifyPack() {
    const user = this.tokenStorage.getUser();

    const params = {
      page: 1,
      pageSize: this.pageSize,
      receiverId: user.Id,
      sortBy: "createDate",
      sortDirection: "desc",
    };

    this.http
      .get("/api/GetNotification/receiver", { params: params })
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        if (response) {
          this.notificationList = response.data;
          this.length = response.count;
          this.firstLoading = false;

          this.isNotRead = this.notificationList.filter(
            (entity) => !entity.isRead
          ).length;

          this.notifyUnreadNumber.emit(this.isNotRead);
        }
      });
  }

  capitalizeFirstLetter(sentence: string): string {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  getContent(notify: Notification): string {
    let contentPhase = "";
    let objectName = "";

    if (notify.objectName != null && notify.objectName.length > 0) {
      objectName = notify.objectName;
    } else objectName = notify.tourishPlan?.tourName ?? "";

    if (notify.contentCode !== null) {
      contentPhase =
        getViNotifyMessagePhase(notify.contentCode ?? "") + objectName;
    } else contentPhase = notify.content;

    return contentPhase;
  }

  getCreator(notify: Notification): string {
    let creatorName = "";
    if (notify.creatorFullName != null && notify.creatorFullName.length > 0) {
      creatorName = notify.creatorFullName;
    } else creatorName = notify.userCreator?.fullName ?? "Anonymus";
    return creatorName + "";
  }

  getTime(input: string) {
    if (input === "") return "Gần 1 phút trước";
    const sendTime = new Date(input);

    const now = new Date(); // Get current date and time

    // Calculate the time difference between local timezone and GMT+0 in milliseconds
    const offset = now.getTimezoneOffset() * 60000; // getTimezoneOffset returns minutes, so convert to milliseconds

    // Adjust to GMT+0
    now.setTime(now.getTime() + offset);

    let isoDate = new Date(now.toISOString());

    let timeChanges = (now.valueOf() - sendTime.valueOf()) / 1000;

    if (timeChanges < 60) {
      return "Gần 1 phút trước";
    } else if (timeChanges >= 60 && timeChanges < 3600) {
      return (timeChanges / 60).toFixed(0) + " phút trước";
    } else if (timeChanges >= 3600 && timeChanges < 86400) {
      return (timeChanges / 3600).toFixed(0) + " tiếng trước";
    } else if (timeChanges >= 86400 && timeChanges < 2592000) {
      return (timeChanges / 86400).toFixed(0) + " ngày trước";
    } else if (timeChanges >= 2592000) {
      return (timeChanges / 2592000).toFixed(0) + " tháng trước";
    }
    return (timeChanges / 2592000).toFixed(0) + " tháng trước";
  }

  async showNotification(title: string, body: string): Promise<void> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      new Notification(title, { body: body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(async (permission) => {
        if (permission === "granted") {
          // await this.swPush.requestSubscription({ serverPublicKey: 'your-server-public-key' });
          // new Notification(title, { body: body });
        }
      });
    }
  }

  requestPermission() {
    messaging
      .getToken({ vapidKey: environment.firebaseConfig.vapidKey })
      .then((currentToken) => {
        if (currentToken) {

          const userId = this.tokenStorage.getUser().Id;
          const payload = {
            deviceToken: currentToken,
            userId: userId,
          };

          this.http
            .post("/api/SaveNotifyFcmToken", payload)
            .subscribe((response: any) => {
              
            });
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  listen() {
    messaging.onMessage((incomingMessage) => {
      console.log(incomingMessage);
    });
  }

  adjustSize() {
    let childWidth = parseInt(
      this.notifyPackContainer.nativeElement.offsetWidth,
      0
    );

    if (childWidth >= 1000) {
      this.signleNotifyWidth = "350px";
    } else {
      this.signleNotifyWidth = "100%";
    }
  }

  test($event: any, id: string) {
    console.log(id, $event);
    this.changeToReadState(id);
  }

  changeToReadState(notificationId: string) {
    const index = this.notificationList.findIndex(
      (entity) => entity.id === notificationId
    );
    if (index > -1) {
      if (!this.notificationList[index].isRead) {
        this.notificationList[index].isRead = true;
        this.isNotRead--;
        this.notifyUnreadNumber.emit(this.isNotRead);
      }
    }

    this.signalRService.invokeOneInfoFeeds(
      "ChangeNotifyToRead",
      notificationId,
      true
    );
  }
}
