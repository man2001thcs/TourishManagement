import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import moment from "moment";
import { Subscription } from "rxjs";
import { SignalRService } from "../user_service/signalr.service";
import { GuestMessage, GuestMessageConHistory } from "src/app/model/baseModel";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent {
  @ViewChild("myChat")
  myChat!: ElementRef;

  isChatSet = false;
  adminId = "";
  subscriptions: Subscription[] = [];
  messageList: GuestMessage[] = [];
  conHis!: GuestMessageConHistory;

  @Output() checkChatOpen = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private signalRService: SignalRService
  ) {}
  messFb!: FormGroup;
  messRegister!: FormGroup;

  isSubmitted = false;

  ngOnInit(): void {
    this.messFb = this.fb.group({
      message: ["", Validators.compose([Validators.required])],
    });

    this.messRegister = this.fb.group({
      guestName: ["", Validators.compose([Validators.required])],
      guestEmail: ["", Validators.compose([Validators.required])],
      guestPhoneNumber: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.signalRService.ConnFeedObservable.subscribe((notify: any) => {
        console.log(notify);
        if (notify.adminId !== undefined) {         
          this.adminId = notify.adminId;
          this.conHis = notify.conHis;
          this.isChatSet = true;
          this.signalRService.listenToClientFeedsThree("SendMessageToUser");
        }
      })
    );

    this.subscriptions.push(
      this.signalRService.ClientFeedObservable.subscribe((res: any) => {
        console.log("Here i am: ", res);
        if (res) {
          console.log("Here i am: ", res.data3);

          if (res.data3 !== null && res.data3 !== undefined) {
            var insertMess = res.data3;
            if (res.data3.state === 1) {
              
              let index = this.messageList.findIndex(
                (mess) => mess.state === 0
              );
              this.messageList[index] = insertMess;

            } else {
              let index = this.messageList.findIndex(
                (mess) => mess.id === res.data3.id
              );
              insertMess.side = 2;

              if (index > -1) {
                this.messageList[index] = insertMess;
              } else this.messageList = [...this.messageList, insertMess];
            }
          }
        }
      })
    );
  }

  showEmojiPicker = false;
  message = "";
  isNavOpen = false;

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

  getState(input: number) {
    if (input === 0) return "Đang gửi";
    else if (input === 1) return "Đã gửi";
    else if (input === 2) return "Thất bại";
    return "";
  }

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

  openChat() {
    //this.myChat.nativeElement.style.display = "none";
    this.myChat.nativeElement.style.height = "400px";
    this.isNavOpen = true;
    this.checkChatOpen.emit(true);
  }

  closeChat() {
    //this.myChat.nativeElement.style.display = "block";
    this.myChat.nativeElement.style.height = "0px";
    this.isNavOpen = false;
    this.checkChatOpen.emit(false);
  }

  chatBoxInteract() {
    if (this.isNavOpen) this.closeChat();
    else this.openChat();
  }

  sendMessage() {
    const guestMessage: GuestMessage = {
      state: 0,
      side: 1,
      content: this.messFb.value.message,
      createDate: (new Date()).toISOString()
    };

    this.signalRService.invokeTwoInfoFeed(
      "SendMessageToAdmin",
      this.adminId,
      this.messRegister.value.guestEmail,
      guestMessage
    );

    this.messageList.push(guestMessage);
  }

  openSignalRHub() {
    const queryParameters = {
      guestEmail: this.messRegister.value.guestEmail,
      guestName: this.messRegister.value.guestName,
      guestPhoneNumber: this.messRegister.value.guestPhoneNumber,
    };

    if (!this.messRegister.invalid) {
      console.log("ok");
      this.signalRService
        .startConnectionWithParam("/api/guest/message", queryParameters)
        .then(() => {
          // 2 - register for ALL relay
          this.signalRService.listenToConnFeeds("NotifyNewCon");
        });
    }
  }
}
