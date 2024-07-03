import { HttpClient } from "@angular/common/http";
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
import { TourishComment } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";
import { environment } from "src/environments/environment";
import { FileModel } from "../image_avatar_service/imageUpload.component.model";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-comment-tour-single",
  templateUrl: "./comment-tour-single.component.html",
  styleUrls: ["./comment-tour-single.component.css"],
})
export class CommentTourSingleComponent implements OnInit {
  @Input()
  senderName: string = "";
  @Input()
  isUserComment = false;
  @Input()
  sendTime: string = "";
  @Input()
  blobContainerName: string = "";
  @Input()
  blobName: string = "";
  @Input()
  userId: string = "";

  @Output() delete = new EventEmitter<string>();

  avatarLink = "";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private dialog: MatDialog,
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.getAvatar();
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

  onDeleteComment() {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn xóa bình luận này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        if (this.blobContainerName.includes("tourish-comment")) {
          this.http
            .delete("/api/DeleteTourComment/" + this.blobName)
            .subscribe((response: any) => {
              if (response) {
                this.messageService.closeAllDialog();
                this.messageService.openMessageNotifyDialog(
                  response.messageCode
                );

                this.delete.emit(this.blobContainerName);
              }
            });
        } else if (this.blobContainerName.includes("service-comment")) {
          this.http
            .delete("/api/DeleteServiceComment/" + this.blobName)
            .subscribe((response: any) => {
              if (response) {
                this.messageService.closeAllDialog();
                this.messageService.openMessageNotifyDialog(
                  response.messageCode
                );

                this.delete.emit(this.blobContainerName);
              }
            });
        }
      }
    });
  }

  getAvatar() {
    const payload = {
      resourceId: this.userId,
      resourceType: 0,
    };

    let avatarLink =
      environment.backend.blobURL + "/0-container/0_anonymus.png";

    if (this.userId.length === 0) this.avatarLink = avatarLink;

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          if (state.data?.length > 0) {
            this.avatarLink = this.generateUrl(state.data[0]);
          }
        }
      });

    this.avatarLink = avatarLink;
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
