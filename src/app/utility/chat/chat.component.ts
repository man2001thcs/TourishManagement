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
import { GuestMessage } from "src/app/model/baseModel";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent {
  @ViewChild("myChat")
  myChat!: ElementRef;

  isChatSet = false;
  subscriptions: Subscription[] = [];
  messageList: GuestMessage[] = [];

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
  isNavOpen = false;

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

  signalRNotification() {
    const queryParameters = {
      adminId: "123",
      guestEmail: this.messFb.controls["guestEmail"].value,
      guestName: this.messFb.controls["guestName"].value,
      guestPhoneNumber: this.messFb.controls["guestPhoneNumber"].value,
    };

    this.signalRService.startConnectionWithParam("/api/guest/message", queryParameters).then(() => {
      // 2 - register for ALL relay
      this.signalRService.listenToClientFeeds("SendMessageToGuest");
    });
  }
}
