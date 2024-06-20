import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Notification, SaveFile } from "src/app/model/baseModel";
import { TokenStorageService } from "../user_service/token.service";
import { getViNotifyMessagePhase } from "../config/notificationCode";
import { SignalRService } from "../user_service/signalr.service";
import { Subscription, debounceTime, fromEvent } from "rxjs";
import { SwPush } from "@angular/service-worker";
import { environment } from "src/environments/environment";
import { messaging } from "src/conf/firebase.conf";
import { FileModel } from "../image_avatar_service/imageUpload.component.model";
import { Router } from "@angular/router";

@Component({
  selector: "app-notification-single",
  templateUrl: "./notification-single.component.html",
  styleUrls: ["./notification-single.component.css"],
})
export class NotificationSingleComponent implements OnInit {
  @Input()
  notification!: Notification;
  @Input()
  viewChildPack!: ElementRef;
  @Input()
  isNotifyOpen = false;

  @Output()
  isInView = new EventEmitter();

  imageList: SaveFile[] = [];
  @ViewChild("singleNotify", { static: false }) singleNotify!: ElementRef;

  active = 1;
  avatarUrl = environment.backend.blobURL + "/0-container/0_anonymus.png";

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
  isFirstRead = true;

  color: ThemePalette = "primary";
  scrollSubscription!: Subscription;
  private checkTimer: any; // Variable to hold the timer ID

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private swPush: SwPush,
    private signalRService: SignalRService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterViewChecked() {
    this.checkIfInView();
  }

  ngOnDestroy() {
    // Hủy đăng ký Subscription khi component bị hủy
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
  }

  checkIfInView() {
    if (this.isFirstRead && this.isNotifyOpen) {
      const element = this.singleNotify.nativeElement;
      const isVisible = this.isElementInViewport(element);
      if (isVisible) {
        if (!this.notification.isRead && this.isFirstRead)
          this.isInView.emit(this.notification.id);
        this.isFirstRead = false;
      }
    }
  }

  isElementInViewport(el: any) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
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
    }

    if (notify.contentCode !== null) {
      contentPhase =
        getViNotifyMessagePhase(notify.contentCode ?? "") + objectName;

      if ((notify.contentCode ?? "").length <= 0) {
        contentPhase = " " + notify.content;
      }
    } else contentPhase = " " + notify.content;

    return contentPhase;
  }

  getCreator(notify: Notification): string {
    let creatorName = "";
    if (notify?.creatorFullName != undefined) {
      if (notify?.creatorFullName.length > 0) {
        creatorName = notify.creatorFullName;
      }
    } else creatorName = "Anonymus";

    if (notify.userCreateId == this.tokenStorage.getUser().Id)
      creatorName = "Bạn";

    if (this.tokenStorage.getUserRole() == "AdminManager" || this.tokenStorage.getUserRole() == "Admin")
      creatorName = "Admin " + creatorName;

    return creatorName + "";
  }

  getImageList() {
    const payload = {
      resourceId: this.notification.userCreateId,
      resourceType: 0,
    };

    return this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((state: any) => {
        if (state.data?.length > 0) {
          this.avatarUrl = this.generateUrl(state.data[0]);
        }
        if (
          state.data == undefined ||
          state.data == null ||
          state.data.length == 0
        ) {
          this.avatarUrl =
            environment.backend.blobURL + "/0-container/0_anonymus.png";
        }
      });
  }

  generateUrl(image: FileModel) {
    return (
      environment.backend.blobURL +
      "/0-container/" +
      "0" +
      "_" +
      image.id +
      image.fileType
    );
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

  onClickRedirect(notify: Notification) {
    if (notify.contentCode?.includes("I41"))
      this.router.navigate([
        "admin/tourish-plan/detail/" +
          this.notification.tourishPlan?.id +
          "/edit",
      ]);
    if (notify.content.includes("Hệ thống nhận được yêu cầu tư vấn mới"))
      this.router.navigate([
        "admin/chat/display/" + this.notification.connectionId,
      ]);
  }
}
