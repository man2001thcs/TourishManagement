import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-big-chat",
  templateUrl: "./big-chat.component.html",
  styleUrls: ["./big-chat.component.css"],
})
export class BigChatComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  messFb!: FormGroup;
  isSubmitted = false;
  ngOnInit(): void {
    this.messFb = this.fb.group({
      message: ["", Validators.compose([Validators.required])],
    });
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
}
