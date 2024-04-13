import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-tourish-card",
  templateUrl: "./tourish-card.component.html",
  styleUrls: ["./tourish-card.component.css"],
})
export class TourishPlanCardComponent {
  @Input()
  score = 10;
  @Input()
  id = "";
  @Input()
  judgeNumber = 19;
  @Input()
  tourName = "";
  @Input()
  tourPrice = 1400000;
  @Input()
  customerNumber = 19;

  constructor(private router: Router) {}

  getRateString(input: number) {
    if (0 <= input && 5 > input) {
      return "Tệ";
    } else if (5 <= input && 8 > input) {
      return "Trung bình";
    } else if (8 <= input && 10 >= input) {
      return "Tuyệt vời";
    }
    return "";
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

  navigateToDetail(): void {
    this.router.navigate(["guest/tour/" + this.id + "/detail"]);
  }

  getTourName(inputString: string) {
    if (inputString.length <= 32) {
      return inputString;
    } else {
      return inputString.substring(0, 32) + "...";
    }
  }
}
