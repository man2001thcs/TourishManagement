import { HttpClient } from "@angular/common/http";
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { Subscription, catchError, filter, of } from "rxjs";
import { SaveFile, TourishSchedule, User } from "src/app/model/baseModel";
import { MessageService } from "src/app/utility/user_service/message.service";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { environment } from "src/environments/environment";
declare let tinymce: any;

@Component({
  selector: "app-schedule-detail",
  templateUrl: "./schedule-detail.component.html",
  styleUrls: ["./schedule-detail.component.css"],
})
export class ScheduleDetailComponent implements OnInit, OnDestroy {
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
  isShipPresent = false;
  isLocalTransportPresent = false;

  schedule?: any;

  tourImage: SaveFile[] = [];

  @ViewChild(EditorComponent) editor!: EditorComponent;

  tinyMceSetting!: any;
  ratingAverage = 3;
  ratingArr: number[] = [];
  scheduleType = "0";
  subscriptions: Subscription[] = [];

  currentUrl = "";

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.currentUrl = this.router.url;
          }
        })
    );

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
        this.scrollToTop();
        this.getScheduleImage();
        this.getSchedule();
        this.getAccount();
      })
    );
  }

  slides: any[] = [];

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getDuration() {
    if ((this.schedule?.serviceScheduleList ?? []).length > 0) {
      const startDateObj = new Date(
        (this.schedule?.serviceScheduleList ?? [])[0].startDate
      );
      const endDateObj = new Date(
        (this.schedule?.serviceScheduleList ?? [])[0].endDate
      );

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
    }

    return "Trong ngày";
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
      getScheduleUrl = "/api/GetMovingSchedule/client/";
    } else if (this.scheduleType == "2") {
      getScheduleUrl = "/api/GetStayingSchedule/client/";
    }

    this.http
      .get(getScheduleUrl + this.scheduleId)
      .subscribe((response: any) => {
        this.schedule = response.data;

        this.tourDescription = this.schedule?.description ?? "";

        if (this.schedule) {
          if ((this.schedule.serviceScheduleList ?? []).length > 0) {
            const scheduleList = this.schedule
              .serviceScheduleList as TourishSchedule[];
            const index = scheduleList.findIndex(
              (entity) => entity.remainTicket ?? 0 > 0
            );
            this.setTourForm.controls["serviceScheduleId"].setValue(
              this.schedule.serviceScheduleList[index].id
            );
          }

          if (this.schedule?.vehicleType !== undefined) {
            if (this.schedule?.vehicleType === 0) {
              this.isMovingContactPresent = true;
            } else if (this.schedule?.vehicleType === 1) {
              this.isPlanePresent = true;
            } else if (this.schedule?.vehicleType === 2) {
              this.isTrainPresent = true;
            }
          }
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
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        this.tourImage = response.data;

        if (this.tourImage.length > 0) {
          this.pushImageToList();
        }
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
        } else if (this.schedule.vehicleType === 3) {
          this.isShipPresent = true;
        } else if (this.schedule.vehicleType === 4) {
          this.isLocalTransportPresent = true;
        }
      }
    }
  }

  register() {
    if (this.tokenStorageService.getUserRole() != "User") {
      this.messageService
        .openFailNotifyDialog("Vui lòng đăng nhập để thanh toán!")
        .subscribe(() =>
          this.router.navigate(["/guest/login"], {
            queryParams: {
              "redirect-url": this.currentUrl.replace("guest", "user"),
            },
          })
        );
    } else {
      let payload: any = {
        guestName: this.setTourForm.value.name,
        email: this.setTourForm.value.email,
        phoneNumber: this.setTourForm.value.phoneNumber,
        totalTicket: this.setTourForm.value.totalTicket,
        totalChildTicket: this.setTourForm.value.totalChildTicket,
        serviceScheduleId: this.setTourForm.value.serviceScheduleId,
      };

      if (this.scheduleType === "1") payload.movingScheduleId = this.scheduleId;
      else if (this.scheduleType === "2")
        payload.stayingScheduleId = this.scheduleId;

      this.messageService.openLoadingDialog();
      this.http
        .post("/api/AddReceipt/client", payload)
        .pipe(
          catchError((error) => {
            this.messageService.openFailNotifyDialog(
              "Hệ thống đang gặp lỗi, vui lòng thử lại"
            );
            return of(null); // Return a null observable in case of error
          })
        )
        .subscribe((response: any) => {
          if (response) {
            this.messageService.closeAllDialog();
            if (response.messageCode == "I511") {
              this.messageService.openNotifyDialog(
                "Đã gửi yêu cầu thành công, vui lòng chờ hóa đơn được xác nhận để thanh toán"
              );
            } else
              this.messageService.openMessageNotifyDialog(response.messageCode);
          }
        });
    }
  }

  callPayment(orderId: string) {
    const payload = {
      orderCode: parseInt(orderId),
    };

    this.messageService.openLoadingDialog();
    this.http
      .post("/api/CallPayment/service/request", payload)
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        if (response) {
          this.messageService.closeLoadingDialog();
          if (response.code == "00") {
            window.open(response.data.checkoutUrl);
          } else if (response.code == "231") {
            this.messageService.openFailNotifyDialog(
              "Link thanh toán đã tồn tại"
            );
          }
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
    if (this.schedule?.instructionList == undefined) return [];
    return this.schedule?.instructionList?.filter(
      (entity: any) => entity.instructionType == 1
    );
  }

  getPriceInstruction() {
    if (this.schedule?.instructionList == undefined) return [];
    return this.schedule?.instructionList?.filter(
      (entity: any) => entity.instructionType == 0
    );
  }

  isScheduleAvailable() {
    if ((this.schedule?.serviceScheduleList ?? []).length > 0) return true;
    else return false;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  isTicketAvailable(tourishSchedule: any) {
    if (tourishSchedule?.remainTicket ?? 0 > 0) return true;
    return false;
  }

  getScheduleType() {
    return parseInt(this.scheduleType);
  }
}
