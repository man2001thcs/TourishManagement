import { HttpClient } from "@angular/common/http";
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
import { TourishComment } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";
import { environment } from "src/environments/environment";
import { FileModel } from "../image_avatar_service/imageUpload.component.model";

@Component({
  selector: "app-comment-section",
  templateUrl: "./comment-section.component.html",
  styleUrls: ["./comment-section.component.css"],
})
export class CommentSectionComponent implements OnInit {
  @Input()
  tourishPlanId: string = "";

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  editorContent = "";

  isLoading = false;
  isSending = false;
  canLoadMore = true;

  tourishPLanCommentList: TourishComment[] = [];
  length = 0;

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private http: HttpClient,
    private messageService: MessageService
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

    this.getTourComment();
  }

  getTourComment() {
    const params = {
      page: 1,
      tourishPlanId: this.tourishPlanId,
      pageSize: 6,
    };

    this.isLoading = true;
    this.http
      .get("/api/GetTourComment/tourishplan", { params: params })
      .subscribe((response: any) => {
        if (response) {
          this.isLoading = false;
          this.tourishPLanCommentList = [
            ...this.tourishPLanCommentList,
            ...response.data,
          ];
          this.length = response.count;

          if (this.tourishPLanCommentList.length >= this.length)
            this.canLoadMore = false;
        }
      });
  }

  sendComment() {
    const payload = {
      tourishPlanId: this.tourishPlanId,
      content: this.editorContent,
      userId: "",
    };

    this.isSending = true;
    this.http
      .post("/api/AddTourishComment", payload)
      .subscribe((response: any) => {
        if (response) {
          this.isSending = false;
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(response.messageCode);
        }
      });
  }

  getTinyMceResult($event: any) {
    this.editorContent = $event.data;
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

  getAvatar(userId: string): string {
    const payload = {
      resourceId: userId,
      resourceType: 0,
    };

    let avatarLink =
      environment.backend.blobURL + "/0-container/0_anonymus.png";

    if (userId.length === 0) return avatarLink;

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          if (state.data?.length > 0) {
            avatarLink = this.generateUrl(state.data[0]);
          }
        }
      });

    return avatarLink;
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
}
