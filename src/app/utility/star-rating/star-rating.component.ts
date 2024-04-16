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
  @Output() ratingUpdated = new EventEmitter();

  showRating = 3;
  showColor = "#F5C000";

  @ViewChild("ratingButton") buttonRef!: ElementRef;

  ratingList: any[] = [];
  ratingNumber = 0;

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
    this.getRating();
    this.getRatingForTour();
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
    this.showColor = "#F5C000";
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

  getRating() {
    const userId = this.tokenServiceStorage.getUser().Id;
    const payload = {
      tourishPlanId: this.tourishPlanId,
      userId: userId,
    };

    this.http
      .get("/api/GetTourRating/user", { params: payload })
      .subscribe((state: any) => {
        if (state) {
          if (state.data?.rating !== undefined) {
            this.showRating = state.data.rating;
          } else {
            this.showRating = 3;
            this.showColor = "#F7F29A";
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
      .subscribe((state: any) => {
        if (state) {
          console.log("abc", state);
          this.ratingList = state.data;
          this.ratingNumber = state.count;
        }
      });
  }

  caculateRating() {
    let totalPoint = 0;
    this.ratingList.forEach((entity) => {
      totalPoint += entity.rating;
    });

    return this.ratingNumber != 0 ? totalPoint / this.ratingNumber : 0;
  }
}
export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn",
}
