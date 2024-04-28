import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { SaveFile } from "src/app/model/baseModel";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-schedule-card",
  templateUrl: "./schedule-card.component.html",
  styleUrls: ["./schedule-card.component.css"],
})
export class ScheduleCardComponent implements OnInit {
  @Input()
  id = "";
  @Input()
  contactId = "";
  @Input()
  scheduleType = 0;
  @Input()
  scheduleName = "";
  @Input()
  schedulePrice = 1400000;
  @Input()
  customerNumber = 19;
  @Input()
  type = "";
  tourImage: SaveFile[] = [];
  firstImageUrl: string = "";

  constructor(
    private router: Router,
    private tokenStorageService: TokenStorageService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    this.getTourImage();
  }

  getRateColor(input: number) {
    if (0 <= input && 5 > input) {
      return "#d31818";
    } else if (5 <= input && 8 > input) {
      return "#F79321";
    } else if (8 <= input && 10 >= input) {
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
        this.tourImage = response.data;

        if (this.tourImage.length > 0) {
          this.pushImageToList(this.tourImage[0]);
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
}
