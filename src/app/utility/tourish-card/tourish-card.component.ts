import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { SaveFile } from "src/app/model/baseModel";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-tourish-card",
  templateUrl: "./tourish-card.component.html",
  styleUrls: ["./tourish-card.component.css"],
})
export class TourishPlanCardComponent implements OnInit {
  @Input()
  score = 4;
  @Input()
  id = "";
  @Input()
  judgeNumber = 0;
  @Input()
  tourName = "";
  @Input()
  tourPrice = 1400000;
  @Input()
  customerNumber = 19;
  tourImage: SaveFile[] = [];
  firstImageUrl: string = "";

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.getTourImage();
    this.getRatingForTour();
    this.getTotalTicketInMonthTour();
  }

  getRateString(input: number) {
    if (this.judgeNumber <= 0) return "Chưa có đánh giá";
    if (0 <= input && 2.5 > input) {
      return "Tệ";
    } else if (2.5 <= input && 4 > input) {
      return "Trung bình";
    } else if (4 <= input && 5 >= input) {
      return "Tuyệt vời";
    }
    return "";
  }

  getRatingForTour() {
    const payload = {
      tourishPlanId: this.id,
    };

    this.http
      .get("/api/GetTourRating/tourishplan", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          
          this.score = state.averagePoint;
          this.judgeNumber = state.count;
        }
      });
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
      resourceId: this.id,
      resourceType: 1,
    };

    this.http
      .get("/api/GetFile", { params: payload })
      .subscribe((response: any) => {
        this.tourImage = response.data;

        if (this.tourImage.length > 0) {
          this.pushImageToList(this.tourImage[0]);
        }

        
      });
  }

  pushImageToList(saveFile: SaveFile) {
    this.firstImageUrl =
      environment.backend.blobURL +
      "/1-container/" +
      "1" +
      "_" +
      saveFile.id +
      saveFile.fileType;
  }

  getTotalTicketInMonthTour() {
    const payload = {
      tourishPlanId: this.id,
    };

    this.http
      .get("/api/GetFullReceipt/total-ticket-of-tour", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          this.customerNumber = state.data.totalTicket;
        }
      });
  }


  navigateToDetail(): void {
    if (this.tokenStorageService.getUserRole() == "User") {
      this.router.navigate(["user/tour/" + this.id + "/detail"]);
    } else this.router.navigate(["guest/tour/" + this.id + "/detail"]);
  }

  getTourName(inputString: string) {
    if (inputString.length <= 32) {
      return inputString;
    } else {
      return inputString.substring(0, 32) + "...";
    }
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
}
