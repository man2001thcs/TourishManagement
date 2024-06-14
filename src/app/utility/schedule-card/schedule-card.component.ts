import { Component, Input, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { SaveFile, TourishSchedule } from "src/app/model/baseModel";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-schedule-card",
  templateUrl: "./schedule-card.component.html",
  styleUrls: ["./schedule-card.component.css"],
})
export class ScheduleCardComponent implements OnInit {
  @Input()
  scheduleType = 1;
  @Input()
  id = "";
  @Input()
  contactId = "";
  @Input()
  scheduleName = "";
  @Input()
  schedulePrice = 1400000;
  @Input()
  startingPlace = "";
  @Input()
  headingPlace = "";

  @Input()
  address = "";

  @Input()
  serviceScheduleList: TourishSchedule[] = [];

  @Input()
  customerNumber = 19;

  firstImageUrl = "";
  scheduleImage: SaveFile[] = [];
  ratingAverage: any;
  cardWidth = 48;

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.getTourImage();
  }

  getRateColor(input: number) {
    if (0 <= input && 2.5 > input) {
      return "#d31818";
    } else if (2.5 <= input && 4 > input) {
      return "#F79321";
    } else if (4 <= input && 5 >= input) {
      return "#9fc43a";
    }
    return "";
  }

  getTourImage() {
    const payload = {
      resourceId: this.contactId,
      resourceType: this.scheduleType + 2,
    };

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((response: any) => {
        this.scheduleImage = response.data;

        if (this.scheduleImage.length > 0) {
          this.pushImageToList(this.scheduleImage[0]);
        } else {
          const blankSaveFile: SaveFile = {
            id: "anonymus",
            accessSourceId: "",
            resourceType: this.scheduleType,
            fileType: ".png",
          };
          this.pushImageToList(blankSaveFile);
        }
      });
  }

  pushImageToList(saveFile: SaveFile) {
    this.firstImageUrl =
      environment.backend.blobURL +
      "/" +
      (this.scheduleType + 2) +
      "-container/" +
      (this.scheduleType + 2) +
      "_" +
      saveFile.id +
      saveFile.fileType;
  }

  navigateToDetail(): void {
    let navigationExtras: NavigationExtras = {
      queryParams: { "schedule-type": this.scheduleType }, // Replace 'key' and 'value' with your actual query parameters
    };

    if (this.tokenStorageService.getUserRole() == "User") {
      this.router.navigate(
        ["user/service/" + this.id + "/detail"],
        navigationExtras
      );
    } else
      this.router.navigate(
        ["guest/service/" + this.id + "/detail"],
        navigationExtras
      );
  }

  getTourName(inputString: string) {
    if (inputString.length <= 100) {
      return inputString;
    } else {
      return inputString.substring(0, 100) + "...";
    }
  }

  getDateFormat(isoDateString: string) {
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = ngayThang.getFullYear();
    const hour = ngayThang.getHours();
    const minute = ngayThang.getHours();

    // Tạo chuỗi kết quả
    const minuteString = minute !== 0 ? minute + " phút" : "";
    const chuoiNgayThang =
      `Ngày ${day} tháng ${month}, ${hour} giờ ` + minuteString;

    return chuoiNgayThang;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
}
