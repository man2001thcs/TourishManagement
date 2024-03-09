import { Component, Input } from "@angular/core";

@Component({
  selector: "tourish-card",
  templateUrl: "./tourish-card.component.html",
  styleUrls: ["./tourish-card.component.css"],
})
export class TourishPlanCardComponent {
  @Input()
  data!: string;
  @Input()
  score = 10;
  @Input()
  judgeNumber = 19;
  @Input()
  tourName = "Tour ABC xyz tới GHZ";
  @Input()
  tourPrice = 1400000;
  @Input()
  customerNumber = 19;

  getRateString(input: number) {
    if (0 <= input && 5 > input) {
      return "Tệ";
    } else if (5 <= input && 8 > input) {
      return "Trung bình";
    } else if (8 <= input && 10 >= input) {
      return "Tuyệt vời";
    } return "";
  }

  getRateColor(input: number) {
    if (0 <= input && 5 > input) {
      return "#d31818";
    } else if (5 <= input && 8 > input) {
      return "#F79321";
    } else if (8 <= input && 10 >= input) {
      return "#9fc43a";
    } return "";
  }
}
