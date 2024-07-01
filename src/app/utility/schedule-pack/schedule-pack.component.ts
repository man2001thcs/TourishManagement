import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { catchError, of } from "rxjs";
import { MovingSchedule, StayingSchedule } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";
import { NavigationExtras, Router } from "@angular/router";
import { TokenStorageService } from "../user_service/token.service";

@Component({
  selector: "app-schedule-pack",
  templateUrl: "./schedule-pack.component.html",
  styleUrls: ["./schedule-pack.component.css"],
})
export class SchedulePackComponent implements OnInit, AfterViewInit {
  @Input()
  scheduleType = 1;

  @Input()
  objectType = 0;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  movingScheduleList: MovingSchedule[] = [];
  stayingScheduleList: StayingSchedule[] = [];
  length = 0;

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getSchedulePack();
  }

  ngAfterViewInit() {
    this.adjustSize();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.adjustSize();
      }
    });

    // Observe the childDiv element for size changes
    resizeObserver.observe(this.packContainer.nativeElement);
  }

  adjustSize() {
    let childWidth = parseInt(this.packContainer.nativeElement.offsetWidth, 0);
    // Example logic, you can adjust this according to your needs
    if (childWidth >= 1700) {
      // this.packContainer.nativeElement.style["border-right"] = "30px 18% 30px";
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 18% 30px"
      );
    } else if (childWidth < 1700 && childWidth >= 1500) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 13% 30px"
      );
    } else if (childWidth < 1500 && childWidth >= 1200) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else if (childWidth < 1200 && childWidth >= 900) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 10% 30px"
      );
    }
  }

  getSchedulePack() {
    const params = {
      page: 1,
      pageSize: 4,
      type: this.objectType,
    };

    if (this.scheduleType == 1) {
      this.http
        .get("/api/GetMovingSchedule", { params: params })
        .pipe(
          catchError((error) => {
            this.messageService.openFailNotifyDialog(
              "Hệ thống đang gặp lỗi, vui lòng thử lại"
            );
            return of(null); // Return a null observable in case of error
          })
        )
        .subscribe((response: any) => {
          this.movingScheduleList = response.data;

          this.length = response.count;
        });
    } else if (this.scheduleType == 2) {
      this.http
        .get("/api/GetStayingSchedule", { params: params })
        .pipe(
          catchError((error) => {
            this.messageService.openFailNotifyDialog(
              "Hệ thống đang gặp lỗi, vui lòng thử lại"
            );
            return of(null); // Return a null observable in case of error
          })
        )
        .subscribe((response: any) => {
          this.stayingScheduleList = response.data;

          this.length = response.count;
        });
    }
  }

  capitalizeFirstLetter(sentence: string): string {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  getDateString(date: Date | undefined) {
    return date != null ? date.toString() ?? "" : "";
  }

  getTitle() {
    if (this.scheduleType == 1) {
      if (this.objectType == 1) return "Đặt vé máy bay";
      if (this.objectType == 0) return "Đặt vé xe khách";
    } else if (this.scheduleType == 2) {
      if (this.objectType == 1) return "Đặt trước khách sạn";
      if (this.objectType == 0) return "Đặt Homestay";
    }
    return "Dịch vụ ";
  }

  async navigateCategoryUrl(url: string, scheduleType: number) {
    let schedulePhase = "moving";
    if (scheduleType == 1) schedulePhase = "moving";
    else if (scheduleType == 2) schedulePhase = "staying";
    let navigationExtras: NavigationExtras = {
      queryParams: { serviceType: schedulePhase }, // Replace 'key' and 'value' with your actual query parameters
    };
    if (this.tokenStorageService.getUserRole() == "User") {
      this.router.navigate(["user/" + url], navigationExtras);
    } else this.router.navigate(["guest/" + url], navigationExtras);
  }
}
