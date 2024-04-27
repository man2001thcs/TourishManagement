import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { Subscription } from "rxjs";
import { MovingSchedule, StayingSchedule } from "src/app/model/baseModel";
import { messaging } from "src/conf/firebase.conf";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-schedule-search-pack",
  templateUrl: "./schedule-pack.component.html",
  styleUrls: ["./schedule-pack.component.css"],
})
export class ScheduleSearchPackComponent implements OnInit, OnChanges {
  @Input()
  scheduleType = 1;
  @Input()
  startingDate = "";
  @Input()
  startingPoint = "";
  @Input()
  endPoint = "";
  @Input()
  priceFrom = 0;
  @Input()
  priceTo = 2000000;
  @Input()
  categoryString = "";

  activePage = 1;
  isLoading = false;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  pageIndex = 0;
  pageSize = 2;
  totalPage = 1;
  pageArray: number[] = [1];

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  movingScheduleList: MovingSchedule[] = [];
  stayingScheduleList: StayingSchedule[] = [];

  length = 0;

  color: ThemePalette = "primary";
  ratingAverage: any;

  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private http: HttpClient,
    private _route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.pageIndex = 0;
    this.getTourPack();
  }

  ngOnInit() {
    this.pageIndex = 0;
    this.getTourPack();
  }

  getTourPack() {
    const params = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
      categoryString: this.categoryString,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
      startingDate: this.startingDate,
      startingPoint: this.startingPoint,
      endPoint: this.endPoint,
    };

    if (this.scheduleType == 1) {
      this.http
        .get("/api/GetMovingSchedule", { params: params })
        .subscribe((response: any) => {
          if (response) {
            this.movingScheduleList = response.data;
            this.length = response.count;
            this.isLoading = false;
            this.totalPage = Math.ceil(this.length / this.pageSize);

            this.pageArray = [];
            for (let i = 1; i <= this.totalPage; i++) {
              this.pageArray.push(i);
            }
          }
        });
    } else if (this.scheduleType == 2) {
      this.http
        .get("/api/GetMovingSchedule", { params: params })
        .subscribe((response: any) => {
          if (response) {
            this.stayingScheduleList = response.data;
            this.length = response.count;
            this.isLoading = false;
            this.totalPage = Math.ceil(this.length / this.pageSize);

            this.pageArray = [];
            for (let i = 1; i <= this.totalPage; i++) {
              this.pageArray.push(i);
            }
          }
        });
    }
  }

  capitalizeFirstLetter(sentence: string): string {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  changePage(index: number) {
    this.pageIndex = index;
    this.activePage = index + 1;
    this.movingScheduleList = [];
    this.stayingScheduleList = [];
    this.isLoading = true;
    this.getTourPack();
  }
}
