import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { Notification } from "src/app/model/baseModel";
import { TokenStorageService } from "../user_service/token.service";
import { getViNotifyMessagePhase } from "../config/notificationCode";
import { SignalRService } from "../user_service/signalr.service";
import { Subscription } from "rxjs";
import { SwPush } from "@angular/service-worker";

@Component({
  selector: "app-notification-pack",
  templateUrl: "./notification-pack.component.html",
  styleUrls: ["./notification-pack.component.css"],
})
export class NotificationPackComponent implements OnInit {
  @Input()
  category: string = "Du lịch hành hương";
  @Input()
  description: string = "Tìm Về Chốn Thiêng, Lòng Người An Bình";

  active = 1;

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

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private swPush: SwPush,
    private signalRService: SignalRService
  ) {}

  ngOnInit() {
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

    this.getTourPack();
    this. signalRNotification();

    this.subscriptions.push(
      this.signalRService.ClientFeedObservable.subscribe((notification: Notification) => {
        if (notification){
          let index = this.notificationList.findIndex(res => res.id === notification.id);

          if (index > -1){
            this.notificationList[index] = notification;
          } else this.notificationList = [notification, ...this.notificationList];
        }

        this.showNotification("Cập nhật từ Roxanne", this.getContent(notification));
      })
    );
  }

  signalRNotification(){
    this.signalRService.startConnection("/api/user/notify").then(() => {
      // 2 - register for ALL relay
      this.signalRService.listenToClientFeeds("SendOffersToUser");
    });
  }

  getTourPack() {
    const user = this.tokenStorage.getUser();

    const params = {
      page: 1,
      pageSize: 6,
      receiverId: user.Id,
    };

    this.http
      .get("/api/GetNotification/receiver", { params: params })
      .subscribe((response: any) => {
        this.notificationList = response.data;
        console.log(response);
        this.length = response.count;
        this.firstLoading = false;
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
    let tourName = "";

    if (notify.tourName != null && notify.tourName.length > 0){
      tourName = notify.tourName;
    } else tourName = notify.tourishPlan?.tourName ?? "";

    if (notify.contentCode !== null) {
      contentPhase =
        getViNotifyMessagePhase(notify.contentCode ?? "") +
        tourName;
    } else contentPhase = notify.content;

    return contentPhase;
  }

  getCreator(notify: Notification): string {
    let creatorName  = "";
    if (notify.creatorFullName != null && notify.creatorFullName.length > 0){
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

    let timeChanges = (isoDate.valueOf() - sendTime.valueOf()) / 1000;

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
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, { body: body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(async permission => {
        if (permission === 'granted') {
          // await this.swPush.requestSubscription({ serverPublicKey: 'your-server-public-key' });
          new Notification(title, { body: body });
        }
      });
    }
  }

  public async subscribeToNotifications() {
    try {
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: 'your-vapid-public-key' // Replace with your VAPID public key
      });
      console.log('Push notification subscription:', subscription);
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  }

  public async sendNotification(message: string) {
    try {
      const options = {
        body: message,
        icon: '/assets/notification-icon.png'
      };
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}
