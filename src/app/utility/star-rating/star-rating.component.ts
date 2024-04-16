import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TokenStorageService } from "../user_service/token.service";
import { HttpClient } from "@angular/common/http";
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  switchMap,
} from "rxjs";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.css"],
})
export class StarRatingComponent implements OnInit, OnDestroy {
  @Input("tourishPlanId") tourishPlanId: string = "";
  @Input("rating") rating: number = 3;
  @Input("starCount") starCount: number = 5;
  @Input("color") color: string = "accent";
  @Output() ratingUpdated = new EventEmitter();

  showRating = 3;

  @ViewChild("ratingButton") buttonRef!: ElementRef;

  snackBarDuration: number = 2000;
  ratingArr: number[] = [];
  currentRating = 3;
  private clickSubject = new Subject<any>();
  private clickSubscription!: Subscription;

  private subscriptions: Subscription[] = [];

  constructor(
    private tokenServiceStorage: TokenStorageService,
    private http: HttpClient
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit() {
    this.showRating = this.rating;
    this.subscriptions.push(
      this.clickSubject
        .pipe(debounceTime(2000), distinctUntilChanged())
        .subscribe((response: number) => {
          if (response) this.sendRating(response);
        })
    );

    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  showIcon(index: number) {
    if (this.showRating >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }

  onClickRating(rating: number) {
    this.currentRating = rating;
    this.showRating = rating;
    console.log(rating);
    this.clickSubject.next(rating);
  }

  sendRating(rating: number) {
    const userId = this.tokenServiceStorage.getUser().Id;
    const payload = {
      tourishPlanId: this.tourishPlanId,
      rating: rating,
      userId: userId,
    };

    this.http
      .post("/api/SendTourRating", payload)
      .subscribe((response: any) => {
        if (response) {
          // this.snackBar.open(
          //   "Bạn đã đánh giá " + rating + " / " + this.starCount,
          //   "",
          //   {
          //     duration: this.snackBarDuration,
          //   }
          // );
          this.ratingUpdated.emit(rating);
        }
      });
  }
}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn",
}
