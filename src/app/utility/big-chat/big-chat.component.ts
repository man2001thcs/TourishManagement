import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Route } from "@angular/router";
import { SignalRService } from "../user_service/signalr.service";
import { GuestMessage, GuestMessageConHistory } from "src/app/model/baseModel";
import { Subscription } from "rxjs";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-big-chat",
  templateUrl: "./big-chat.component.html",
  styleUrls: ["./big-chat.component.css"],
})
export class BigChatComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private signalRService: SignalRService,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) {}
  messFb!: FormGroup;
  isSubmitted = false;
  connectionId = "";
  subscriptions: Subscription[] = [];
  messageList: GuestMessage[] = [];

  guestConHistoryList: GuestMessageConHistory[] = [];
  currentGuestConHis!: GuestMessageConHistory;
  guestConLength = 0;

  ngOnInit(): void {
    this.connectionId =
      this.route.snapshot.queryParamMap.get("connectionId") ?? "";

    this.messFb = this.fb.group({
      message: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.signalRService.ClientFeedObservable.subscribe(
        (mess: GuestMessage) => {
          if (mess) {
            console.log("Here i am: ", mess);

            let index = this.messageList.findIndex((res) => res.id === mess.id);

            if (index > -1) {
              this.messageList[index] = mess;
            } else this.messageList = [mess, ...this.messageList];
          }
        }
      )
    );
  }

  showEmojiPicker = false;
  message = "";

  toggleEmojiPicker() {
    console.log(this.showEmojiPicker);
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    this.messFb.controls["message"].setValue(
      this.messFb.controls["message"].value + event.emoji.native
    );
    // this.showEmojiPicker = false;
  }

  getTime(input: string) {
    const sendTime = new Date(input);
    const nowTime = new Date();
    const timeChanges = (nowTime.valueOf() - sendTime.valueOf()) / 1000;

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

  sendMessage() {
    const userId = this.tokenStorageService.getUser().Id;

    const guestMessage: GuestMessage = {
      content: this.message,
    };

    this.signalRService.invokeTwoInfoFeed(
      "SendMessageToUser",
      userId,
      this.connectionId,
      guestMessage
    );
  }

  signalRNotification() {
    const queryParameters = {
      adminId: "123",
      guestEmail: this.messFb.controls["guestEmail"].value,
      guestName: this.messFb.controls["guestName"].value,
      guestPhoneNumber: this.messFb.controls["guestPhoneNumber"].value,
    };

    this.signalRService
      .startConnectionWithParam("/api/guest/message", queryParameters)
      .then(() => {
        // 2 - register for ALL relay
        this.signalRService.listenToClientFeeds("SendMessageToUser");
      });
  }

  getMessageConList() {
    const params = {
      page: 1,
      pageSize: 6,
    };

    this.http
      .get("/api/GuestMessageConHistory/admin", { params: params })
      .subscribe((response: any) => {
        this.guestConHistoryList = response.data;
        console.log(response);
        this.guestConLength = response.count;
      });
  }

  getMessageCon() {
    if (this.connectionId.length > 0) {
      const params = {
        connectionId: this.connectionId,
      };

      this.http
        .get("/api/GuestMessageConHistory/guest-connection", { params: params })
        .subscribe((response: any) => {
          this.currentGuestConHis = response.data;
        });
    }
  }
}
