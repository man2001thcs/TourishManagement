import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Route } from "@angular/router";
import { SignalRService } from "../user_service/signalr.service";
import { GuestMessage, GuestMessageConHistory } from "src/app/model/baseModel";
import { Subscription, catchError, of } from "rxjs";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { MessageService } from "../user_service/message.service";

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
    private messageService: MessageService,
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
  isOpen = false;
  isSending = false;

  newMessage: GuestMessage | null = null;

  ngOnInit(): void {
    this.connectionId = this.route.snapshot.paramMap.get("id") ?? "";
    this.getMessageConList();

    this.messFb = this.fb.group({
      message: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.signalRService.ClientFeedObservable.subscribe((res: any) => {
        if (res) {
          if (res.data3 !== null && res.data3 !== undefined) {
            var insertMess = res.data3;

            if (insertMess.isClosed) {
              this.isOpen = false;
            }

            const guestMessage: GuestMessage = {
              id: res.data3.id,
              state: res.data3.state,
              content: res.data3.content,
              side: 1,
              createDate: res.data3.createDate,
            };
            if (
              parseInt(insertMess.state) === 1 ||
              parseInt(insertMess.state) === 3
            ) {
              let index = this.messageList.findIndex(
                (mess) => mess.state === 0
              );

              if (index > -1) {
                this.messageList[index] = guestMessage;
                this.isSending = false;

                this.messFb.controls["message"].setValue("");
              }
            } else if (parseInt(insertMess.state) === 2) {
              let index = this.messageList.findIndex(
                (mess) => mess.id === res.data3.id
              );
              guestMessage.side = 2;

              this.newMessage = guestMessage;

              if (index > -1) {
                this.messageList[index] = guestMessage;
              } else this.messageList = [...this.messageList, guestMessage];
            }
          }
        }
      })
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
      this.messFb.value.message + event.emoji.native
    );
    // this.showEmojiPicker = false;
  }

  checkUserRole() {
    return this.tokenStorageService.getUserRole() === "User";
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

  getState(input: number) {
    if (input === 0) return "Đang gửi";
    else if (input === 1) return "Đã gửi";
    else if (input === 2) return "Đã gửi";
    else if (input === 3) return "Thất bại";
    return "";
  }

  sendMessage() {
    const userId = this.tokenStorageService.getUser().Id;

    const guestMessage: GuestMessage = {
      id: undefined,
      state: 0,
      content: this.messFb.value.message,
      side: 1,
      createDate: new Date().toISOString(),
    };

    this.isSending = true;
    this.signalRService.invokeTwoInfoFeed(
      "SendMessageToUser",
      userId,
      this.currentGuestConHis.guestMessageCon.guestEmail,
      guestMessage
    );

    this.messageList = [...this.messageList, guestMessage];
  }

  signalRNotification() {
    const adminId = this.tokenStorageService.getUser().Id;
    const queryParameters = {
      adminId: adminId,
      guestEmail: this.currentGuestConHis.guestMessageCon.guestEmail,
      guestName: this.currentGuestConHis.guestMessageCon.guestName,
      guestPhoneNumber:
        this.currentGuestConHis.guestMessageCon.guestPhoneNumber,
      token: this.tokenStorageService.getToken(),
    };

    this.signalRService
      .startConnectionWithParam("/api/guest/message", queryParameters)
      .then(() => {
        // 2 - register for ALL relay
        this.signalRService.listenToClientFeedsThree("SendMessageToAdmin");
      });
  }

  getMessageConList() {
    const params = {
      page: 1,
      pageSize: 6,
    };

    this.messageService.openLoadingDialog();
    this.http
      .get("/api/GetGuestMessageConHistory/admin", { params: params })
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        this.messageService.closeAllDialog();
        if (response) {
          this.guestConHistoryList = response.data;

          this.guestConLength = response.count;

          this.getMessageCon();
        }
      });
  }

  getMessageCon() {
    if (this.connectionId.length > 0) {
      const params = {
        connectionId: this.connectionId,
      };

      this.messageService.openLoadingDialog();
      this.http
        .get("/api/GetGuestMessageConHistory/guest-connection", {
          params: params,
        })
        .subscribe((response: any) => {
          this.messageService.closeAllDialog();
          if (response) {
            this.currentGuestConHis = response.data;

            var existIndex = this.guestConHistoryList.findIndex(
              (conHis) => conHis.id === this.currentGuestConHis.id
            );

            if (existIndex > -1) {
              this.guestConHistoryList[existIndex] = this.currentGuestConHis;
            } else {
              this.guestConHistoryList = [
                this.currentGuestConHis,
                ...this.guestConHistoryList,
              ];
            }

            this.messageList = this.currentGuestConHis.guestMessages ?? [];

            if (this.currentGuestConHis.guestMessageCon.connected) {
              this.signalRNotification();
              this.isOpen = true;
            } else {
              this.isOpen = false;
            }
          }
        });
    }
  }

  onClickHistory(id: string) {
    this.connectionId = id;
    this.getMessageCon();
  }
}
