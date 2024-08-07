import { HttpClient, HttpParams } from "@angular/common/http";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, catchError, of } from "rxjs";
import { MovingSchedule, StayingSchedule } from "src/app/model/baseModel";
import { MessageService } from "../user_service/message.service";
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
  objectType = 0;

  isFirstSearch = true;
  activePage = 1;
  isLoading = false;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  pageIndex = 0;
  pageSize = 4;
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
    private messageService: MessageService,
    private _route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.pageIndex = 0;
    this.isFirstSearch = true;
    this.getTourPack();
  }

  ngOnInit() {
    this.pageIndex = 0;
    this.getTourPack();
  }

  getTourPack() {
    let params: any = {
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
      priceFrom: this.priceFrom,
      priceTo: this.priceTo,
      startingDate: this.startingDate,
      startingPoint: this.startingPoint,
      endPoint: this.endPoint,
    };

    if (this.objectType > -1) params.type = this.objectType;

    this.isFirstSearch = true;

    this.stayingScheduleList = [];
    this.movingScheduleList = [];

    if (this.scheduleType == 1) {
      this.movingScheduleList = [];
      this.stayingScheduleList = [];

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
          if (response) {
            this.isFirstSearch = false;
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
      this.movingScheduleList = [];
      this.stayingScheduleList = [];

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
          if (response) {
            this.isFirstSearch = false;
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

  getDateString(date: Date | undefined) {
    return date != null ? date.toString() ?? "" : "";
  }
}
