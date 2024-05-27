import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { Subscription } from "rxjs";
import {
  MovingSchedule,
  SaveFile,
  StayingSchedule,
  User,
} from "src/app/model/baseModel";
import { MessageService } from "src/app/utility/user_service/message.service";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { environment } from "src/environments/environment";
declare let tinymce: any;

@Component({
  selector: "app-schedule-detail",
  templateUrl: "./schedule-detail.component.html",
  styleUrls: ["./schedule-detail.component.css"],
})
export class ScheduleDetailComponent implements OnInit {
  @Input()
  data!: string;

  active = 1;

  setTourForm!: FormGroup;
  user!: User;

  isSubmit = false;
  scheduleId = "";
  tourDescription = "";

  isMovingContactPresent = false;
  isTrainPresent = false;
  isPlanePresent = false;

  schedule?: any;

  tourImage: SaveFile[] = [];

  @ViewChild(EditorComponent) editor!: EditorComponent;

  tinyMceSetting!: any;
  ratingAverage = 3;
  ratingArr: number[] = [];
  scheduleType = "0";
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private rendered2: Renderer2,
    private messageService: MessageService,
    private elementRef: ElementRef,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    // this.scheduleId = this._route.snapshot.paramMap.get("id") ?? "";

    this.scheduleType =
      this._route.snapshot.queryParamMap.get("schedule-type") ?? "";

    for (let index = 0; index < 5; index++) {
      this.ratingArr.push(index);
    }
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [
        1,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      totalChildTicket: [
        0,
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      serviceScheduleId: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this._route.paramMap.subscribe((params) => {
        this.scheduleId = params.get("id") ?? "";
        this.getScheduleImage();
        this.getSchedule();
        this.getAccount();
      })
    );

    
  }

  slides: any[] = [];

  getDuration() {
    if (this.schedule?.startDate && this.schedule?.endDate) {
      const startDateObj = new Date(this.schedule?.startDate);
      const endDateObj = new Date(this.schedule?.endDate);

      const timeDiff = endDateObj.getTime() - startDateObj.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff === 1) {
        return "1 ngày";
      } else if (daysDiff > 1) {
        const nightsDiff = daysDiff - 1;

        // Check if end date is on the next day after start date
        if (endDateObj.getDate() !== startDateObj.getDate() + 1) {
          // If not, reduce the nights difference by 1
          return `${daysDiff} ngày ${nightsDiff} đêm`;
        } else {
          return `${daysDiff} ngày ${nightsDiff + 1} đêm`;
        }
      } else {
        return "Trong ngày";
      }
    } else {
      return "Trong ngày";
    }
  }

  getSanitizedContent(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  getAccount() {
    if (this.tokenStorageService.getUserRole() == "User") {
      const user = this.tokenStorageService.getUser();
      const payload = {
        id: user.Id,
      };

      this.http
        .post("/api/User/SelfGetUser", null, {
          params: payload,
        })
        .subscribe((response: any) => {
          if (response) {
            this.user = response.data;

            this.setTourForm.controls["phoneNumber"].setValue(
              this.user.phoneNumber
            );
            this.setTourForm.controls["email"].setValue(this.user.email);
            this.setTourForm.controls["address"].setValue(this.user.address);
            this.setTourForm.controls["name"].setValue(this.user.fullName);
          }
        });
    }
  }

  getSchedule() {
    var getScheduleUrl = "";
    if (this.scheduleType == "1") {
      getScheduleUrl = "/api/GetMovingSchedule/";
    } else if (this.scheduleType == "2") {
      getScheduleUrl = "/api/GetStayingSchedule/";
    }

    this.http
      .get(getScheduleUrl + this.scheduleId)
      .subscribe((response: any) => {
        this.schedule = response.data;

        this.tourDescription = this.schedule?.description ?? "";

        if (this.schedule){
          if ((this.schedule.serviceScheduleList ?? []).length > 0)
          this.setTourForm.controls["serviceScheduleId"].setValue(
            this.schedule.serviceScheduleList[0].id
          );
        }
          
      });
  }

  getScheduleImage() {
    const payload = {
      resourceId: this.scheduleId,
      resourceType: parseInt(this.scheduleType) + 2,
    };

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((response: any) => {
        this.tourImage = response.data;

        if (this.tourImage.length > 0) {
          this.pushImageToList();
        }

        console.log(response);
      });
  }

  pushImageToList() {
    let index = 0;
    this.tourImage.forEach((saveFile) => {
      index++;
      this.slides = [
        ...this.slides,
        {
          url:
            environment.backend.blobURL +
            "/" +
            this.scheduleType +
            "-container/" +
            this.scheduleType +
            "_" +
            saveFile.id +
            saveFile.fileType,
          title: "slide: " + index,
          description: "This is the slide " + index,
        },
      ];
    });
  }

  getTotalPrice(): number {
    return this.schedule?.singlePrice ?? 0;
  }

  getVehicleFlag() {
    if (this.schedule !== undefined) {
      if ("vehicleType" in this.schedule) {
        if (this.schedule.vehicleType === 0) {
          this.isMovingContactPresent = true;
        } else if (this.schedule.vehicleType === 1) {
          this.isPlanePresent = true;
        } else if (this.schedule.vehicleType === 2) {
          this.isTrainPresent = true;
        }
      }
    }
  }

  register() {
    let payload: any = {
      guestName: this.setTourForm.value.name,
      email: this.setTourForm.value.email,
      phoneNumber: this.setTourForm.value.phoneNumber,
      totalTicket: this.setTourForm.value.totalTicket,
      totalChildTicket: this.setTourForm.value.totalChildTicket,
      serviceScheduleId: this.setTourForm.value.serviceScheduleId,
    };

    if (this.scheduleType === "1") payload.movingScheduleId = this.scheduleId;
    else if (this.scheduleType === "2") payload.stayingScheduleId = this.scheduleId;

    this.messageService.openLoadingDialog();
    this.http
      .post("/api/AddReceipt/client", payload)
      .subscribe((response: any) => {
        if (response) {
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(response.messageCode);
        }
      });
  }

  showIcon(index: number) {
    if (this.ratingAverage >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }

  getDateFormat(date: Date) {
    const isoDateString = date != null ? date.toString() ?? "" : "";
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = ngayThang.getFullYear();
    const hour = ngayThang.getHours();
    const minute = ngayThang.getHours();

    const chuoiNgayThang = `Ngày ${day} tháng ${month}`;

    return chuoiNgayThang;
  }

  getContainerName() {
    if (parseInt(this.scheduleType) === 0)
      return "eatschedule-content-container";
    else if (parseInt(this.scheduleType) === 1)
      return "movingschedule-content-container";
    else if (parseInt(this.scheduleType) === 2)
      return "stayingschedule-content-container";
    return "";
  }

  getStatusPhase(statusNumber: string): string {
    switch (parseInt(statusNumber)) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Xác nhận thông tin";
      case 2:
        return "Đang diễn ra";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Hủy bỏ";
      default:
        return "Không xác định";
    }
  }

  getCautionInstruction() {
    if (this.schedule?.serviceScheduleList == undefined) return [];
    return this.schedule?.serviceScheduleList?.filter(
      (entity: any) => entity.instructionType == 1
    );
  }

  getPriceInstruction() {
    if (this.schedule?.serviceScheduleList == undefined) return [];
    return this.schedule?.serviceScheduleList?.filter(
      (entity: any) => entity.instructionType == 0
    );
  }
}
