import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { SaveFile } from "src/app/model/baseModel";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-schedule-search-card",
  templateUrl: "./schedule-card.component.html",
  styleUrls: ["./schedule-card.component.css"],
})
export class SchedulePlanSearchCardComponent implements OnInit{
  @Input()
  scheduleType = 1;
  @Input()
  score = 4;
  @Input()
  id = "";
  @Input()
  contactId = "";
  @Input()
  judgeNumber = 0;
  @Input()
  scheduleName = "";
  @Input()
  schedulePrice = 1400000;
  @Input()
  customerNumber = 19;

  firstImageUrl = "";
  scheduleImage: SaveFile[] = [];
  ratingAverage: any;

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.getTourImage();
    this.getRatingForTour();
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
        }

        console.log(response);
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

  getRatingForTour() {
    const payload = {
      schedulePlanId: this.id,
    };

    this.http
      .get("/api/GetTourRating/scheduleplan", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          console.log("abc", state);
          this.score = state.averagePoint;
          this.judgeNumber = state.count;
        }
      });
  }

  navigateToDetail(): void {
    if (this.tokenStorageService.getUserRole() == "User") {
      this.router.navigate(["user/schedule/" + this.id + "/detail"]);
    } else this.router.navigate(["guest/schedule/" + this.id + "/detail"]);
  }

  getTourName(inputString: string) {
    if (inputString.length <= 100) {
      return inputString;
    } else {
      return inputString.substring(0, 100) + "...";
    }
  }
}
