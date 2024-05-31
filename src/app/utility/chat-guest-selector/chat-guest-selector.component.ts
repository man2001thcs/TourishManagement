import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  GuestMessage,
  GuestMessageConHistory,
  Notification,
  SaveFile,
} from "src/app/model/baseModel";
import { TokenStorageService } from "../user_service/token.service";
import { getViNotifyMessagePhase } from "../config/notificationCode";
import { SignalRService } from "../user_service/signalr.service";
import { Subscription } from "rxjs";
import { SwPush } from "@angular/service-worker";
import { environment } from "src/environments/environment";
import { messaging } from "src/conf/firebase.conf";
import { FileModel } from "../image_avatar_service/imageUpload.component.model";

@Component({
  selector: "app-chat-guest-selector",
  templateUrl: "./chat-guest-selector.component.html",
  styleUrls: ["./chat-guest-selector.component.css"],
})
export class ChatGuestSelectorComponent implements OnInit, OnChanges {
  @Input()
  guestMessageConHistory!: GuestMessageConHistory;

  @Input()
  lastChatInput: GuestMessage | null = null;

  @Input()
  isSelected = false;

  lastMessage!: GuestMessage;
  imageList: SaveFile[] = [];

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

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private tokenStorage: TokenStorageService,
    private http: HttpClient,
    private swPush: SwPush,
    private signalRService: SignalRService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["lastChatInput"]) {
      if (this.lastChatInput != null) this.lastMessage = this.lastChatInput;
    }
  }

  ngOnInit() {}

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
    } else contentPhase = notify.content;

    return contentPhase;
  }

  getCreator(notify: Notification): string {
    let creatorName = "";
    if (notify?.creatorFullName != undefined) {
      if (notify?.creatorFullName.length > 0) {
        creatorName = notify.creatorFullName;
      }
    } else creatorName = "Anonymus";
    return creatorName + "";
  }

  getTime(input: string) {
    if (input === "") return "";
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

  getUserName() {
    if (this.guestMessageConHistory.guestMessageCon != null) {
      return this.guestMessageConHistory.guestMessageCon.guestName;
    } else return "Anonymus";
  }

  getLastMessage() {
    if (this.guestMessageConHistory.guestMessageCon.guestMessages != null) {
      if (this.guestMessageConHistory.guestMessageCon.guestMessages.length > 0)
        this.lastMessage =
          this.guestMessageConHistory.guestMessageCon.guestMessages[0];
    }
  }

  getLastContent() {
    this.getLastMessage();
    if (this.lastMessage) {
      if (this.lastMessage.content) return this.lastMessage.content;
    }
    return "";
  }

  getLastTime() {
    this.getLastMessage();
    if (this.lastMessage) {
      if (this.lastMessage.createDate)
        return this.getTime(this.lastMessage.createDate);
    }
    return this.getTime("");
  }
}
