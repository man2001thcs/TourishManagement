import { HttpClient } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { Subscription, catchError, filter, of, scheduled } from "rxjs";
import {
  SaveFile,
  TourishPlan,
  TourishSchedule,
  User,
} from "src/app/model/baseModel";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { environment } from "src/environments/environment";
declare let tinymce: any;

@Component({
  selector: "app-tourish-detail",
  templateUrl: "./tourish-detail.component.html",
  styleUrls: ["./tourish-detail.component.css"],
})
export class TourishDetailComponent implements OnInit, OnDestroy {
  @Input()
  data!: string;

  active = 1;

  setTourForm!: FormGroup;
  user!: User;

  isSubmit = false;
  tourishPlanId = "";
  tourDescription = "";

  isMovingContactPresent = false;
  isTrainPresent = false;
  isPlanePresent = false;
  isShipPresent = false;
  isLocalTransportPresent = false;

  tourishPlan?: TourishPlan;
  tourImage: SaveFile[] = [];

  @ViewChild(EditorComponent) editor!: EditorComponent;

  tinyMceSetting!: any;
  ratingAverage = 3;
  ratingArr: number[] = [];

  subscriptions: Subscription[] = [];
  currentUrl: string = "";

  constructor(
    private fb: FormBuilder,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private rendered2: Renderer2,
    private messageService: MessageService,
    public dialog: MatDialog,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;

    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.currentUrl = this.router.url;
            console.log("test:" + this.currentUrl);
          }
        })
    );

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
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
      tourishScheduleId: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this._route.paramMap.subscribe((params) => {
        this.tourishPlanId = params.get("id") ?? "";
        this.scrollToTop();
        this.getRatingForTour();
        this.getTourImage();
        this.getTour();
        this.getAccount();
      })
    );

    // this.getRatingForTour();
    // this.getTourImage();
    // this.getTour();
    // this.getAccount();
  }

  slides: any[] = [];

  getDuration() {
    if ((this.tourishPlan?.tourishScheduleList ?? []).length > 0) {
      const startDateObj = new Date(
        (this.tourishPlan?.tourishScheduleList ?? [])[0].startDate
      );
      const endDateObj = new Date(
        (this.tourishPlan?.tourishScheduleList ?? [])[0].endDate
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

  getTour() {
    this.http
      .get("/api/GetTourishPlan/client/" + this.tourishPlanId)
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        this.tourishPlan = response.data;

        this.tourDescription = this.tourishPlan?.description ?? "";
        this.getVehicleFlag();
        if (this.tourishPlan?.tourishScheduleList) {
          this.tourishPlan.tourishScheduleList =
            this.tourishPlan?.tourishScheduleList ?? [];

          if (this.tourishPlan.tourishScheduleList.length > 0) {
            const index = this.tourishPlan.tourishScheduleList.findIndex(
              (entity) => entity.remainTicket ?? 0 > 0
            );
            if (index > -1)
              this.setTourForm.controls["tourishScheduleId"].setValue(
                this.tourishPlan?.tourishScheduleList[index].id ?? ""
              );
          }
        }       
      });
  }

  getTourImage() {
    this.slides = [];
    const payload = {
      resourceId: this.tourishPlanId,
      resourceType: 1,
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
            "/1-container/" +
            "1" +
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
    let totalPrice = 0;

    if (this.tourishPlan) {
      this.tourishPlan.stayingSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });

      this.tourishPlan.eatSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });

      this.tourishPlan.movingSchedules?.forEach((entity) => {
        totalPrice += entity.singlePrice ?? 0;
      });
    }

    return totalPrice;
  }

  getVehicleFlag() {
    if (this.tourishPlan) {
      this.tourishPlan.movingSchedules?.forEach((entity) => {
        if (entity.vehicleType === 0) {
          this.isMovingContactPresent = true;
        } else if (entity.vehicleType === 1) {
          this.isPlanePresent = true;
        } else if (entity.vehicleType === 2) {
          this.isTrainPresent = true;
        } else if (entity.vehicleType === 3) {
          this.isShipPresent = true;
        } else if (entity.vehicleType === 4) {
          this.isLocalTransportPresent = true;
        }
      });
    }
  }

  getVehicleList(vehicleType: number) {
    if (!this.tourishPlan || !this.tourishPlan.movingSchedules) {
      return [];
    }

    return this.tourishPlan.movingSchedules.filter(
      (entity) => entity.vehicleType === vehicleType
    );
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
      const payload = {
        guestName: this.setTourForm.value.name,
        email: this.setTourForm.value.email,
        phoneNumber: this.setTourForm.value.phoneNumber,
        totalTicket: this.setTourForm.value.totalTicket,
        totalChildTicket: this.setTourForm.value.totalChildTicket,
        tourishPlanId: this.tourishPlanId,
        tourishScheduleId: this.setTourForm.value.tourishScheduleId,
      };

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
            } else {
              this.messageService.openMessageNotifyDialog(response.messageCode);
            }
          }
        });
    }
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  callPayment(orderId: string) {
    const payload = {
      orderCode: parseInt(orderId),
    };

    this.messageService.openLoadingDialog();
    this.http
      .post("/api/CallPayment/tour/request", payload)
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

  getRatingForTour() {
    const payload = {
      tourishPlanId: this.tourishPlanId,
    };

    this.http
      .get("/api/GetTourRating/tourishplan", { params: payload })
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((state: any) => {
        if (state) {
          this.ratingAverage = state.averagePoint;
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

  getCautionInstruction() {
    if (this.tourishPlan?.instructionList == undefined) return [];
    return this.tourishPlan?.instructionList?.filter(
      (entity) => entity.instructionType == 1
    );
  }

  getPriceInstruction() {
    if (this.tourishPlan?.instructionList == undefined) return [];
    return this.tourishPlan?.instructionList?.filter(
      (entity) => entity.instructionType == 0
    );
  }

  isScheduleAvailable() {
    if ((this.tourishPlan?.tourishScheduleList ?? []).length > 0) return true;
    else return false;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  isTicketAvailable(tourishSchedule: TourishSchedule) {
    if (tourishSchedule.remainTicket ?? 0 > 0) return true;
    return false;
  }
}
