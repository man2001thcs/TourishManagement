import { HttpClient } from "@angular/common/http";
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
import { ServiceComment } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";
import { environment } from "src/environments/environment";
import { FileModel } from "../image_avatar_service/imageUpload.component.model";
import { TokenStorageService } from "../user_service/token.service";
import { StarRatingColor } from "../star-rating/star-rating.component";

@Component({
  selector: "app-service-comment-section",
  templateUrl: "./comment-section.component.html",
  styleUrls: ["./comment-section.component.css"],
})
export class ServiceCommentSectionComponent implements OnInit, OnChanges {
  @Input()
  serviceId: string = "";
  @Input()
  serviceType: number = 1;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  rating: number = 3;
  starCount: number = 5;

  setServiceForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  editorContent = "";

  isLoading = false;
  isSending = false;
  canLoadMore = true;

  page = 1;

  blobContainerName = "service-comment-container";

  serviceCommentList: ServiceComment[] = [];
  length = 0;

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes["serviceId"]) {
      this.editorContent = "";

      this.isLoading = false;
      this.isSending = false;
      this.canLoadMore = true;
      this.isSubmit = false;
      this.serviceCommentList = [];

      this.getServiceComment();
    }
  }

  ngOnInit() {
    this.setServiceForm = this.fb.group({
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
  }

  getServiceComment() {
    this.serviceCommentList = [];
    this.canLoadMore = true;
    this.page = 1;
    const params = {
      page: this.page,
      serviceId: this.serviceId,
      serviceType: this.serviceType,
      pageSize: 6,
    };

    this.isLoading = true;
    this.http
      .get("/api/GetServiceComment/service", { params: params })
      .subscribe((response: any) => {
        if (response) {
          this.isLoading = false;
          this.serviceCommentList = [
            ...this.serviceCommentList,
            ...response.data,
          ];
          this.length = response.count;

          if (this.serviceCommentList.length >= this.length)
            this.canLoadMore = false;
        }
      });
  }

  getMoreServiceComment() {
    this.page++;
    const params = {
      page: this.page,
      serviceId: this.serviceId,
      serviceType: this.serviceType,
      pageSize: 6,
    };

    this.isLoading = true;
    this.http
      .get("/api/GetServiceComment/service", { params: params })
      .subscribe((response: any) => {
        if (response) {
          this.isLoading = false;
          this.serviceCommentList = [
            ...this.serviceCommentList,
            ...response.data,
          ];
          this.length = response.count;

          if (this.serviceCommentList.length >= this.length)
            this.canLoadMore = false;
        }
      });
  }

  sendComment() {
    const userId = this.tokenStorageService.getUser().Id;
    const name = this.tokenStorageService.getUser().UserName;

    if (this.editorContent.length <= 0) {
      this.messageService.openFailNotifyDialog(
        "Vui lòng nhập nội dung bình luận"
      );
    } else {
      let payload: any = {
        content: this.editorContent,
        userId: userId,
      };

      if (this.serviceType === 1) {
        payload.movingScheduleId = this.serviceId;
      } else if (this.serviceType === 2) {
        payload.stayingScheduleId = this.serviceId;
      }

      this.isSending = true;

      this.http
        .post("/api/AddServiceComment", payload)
        .subscribe((response: any) => {
          if (response) {
            this.isSending = false;
            this.editorContent = "";
            this.messageService.closeAllDialog();
            this.messageService.openMessageNotifyDialog(response.messageCode);

            var newData = response.data;
            newData.userName = name;
            this.serviceCommentList = [newData, ...this.serviceCommentList];
          }
        });
    }
  }

  isUserLogin() {
    if (this.tokenStorageService.getUserRole() === "User") return true;
    else return false;
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

  onRatingChanged($event: any) {}

  deleteComment($event: string) {
    this.getServiceComment();
  }

  isUserComment(userIdInput: string) {
    const userId = this.tokenStorageService.getUser().Id;
    if (userId === userIdInput) return true;
    else return false;
  }
}
