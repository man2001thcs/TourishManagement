import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import moment from "moment";
import { Subscription } from "rxjs";
import { GuestMessage, GuestMessageConHistory } from "src/app/model/baseModel";

@Component({
  selector: "app-receive-big-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ReceiveBigChatComponent {
  @ViewChild("myChat")
  myChat!: ElementRef;

  @Input() content = "";
  @Input() state = 0;
  @Input() sendTime = "";

  isChatSet = false;
  isWaitingForSet = false;
  adminId = "";
  subscriptions: Subscription[] = [];
  messageList: GuestMessage[] = [];
  conHis!: GuestMessageConHistory;

  isOpen = false;
  isSending = false;

  timeString = "";
  private intervalId: any;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {}
  messFb!: FormGroup;
  messRegister!: FormGroup;

  isSubmitted = false;

  ngOnInit(): void {
    this.timeString = this.getTime(this.sendTime);
    this.intervalId = setInterval(() => {
      this.timeString = this.getTime(this.sendTime);
    }, 60000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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

  getState(input: number) {
    if (input === 0) return "Đang gửi";
    else if (input === 1) return "Đã gửi";
    else if (input === 2) return "Đã gửi";
    else if (input === 3) return "Thất bại";
    return "";
  }
}
