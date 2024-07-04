import { HttpClient } from "@angular/common/http";
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
import { Subscription } from "rxjs";
import { TourishPlan } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-search-pack",
  templateUrl: "./tourish-pack.component.html",
  styleUrls: ["./tourish-pack.component.css"],
})
export class TourishSearchPackComponent implements OnInit, OnChanges {
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
  isFirstSearch = true;
  isLoading = false;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  pageIndex = 0;
  pageSize = 6;
  totalPage = 1;
  pageArray: number[] = [1];

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  tourishPLanList: TourishPlan[] = [];
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
    this.isFirstSearch = true;
    this.tourishPLanList = [];
    
    this.http
      .get("/api/GetTourishPlan", { params: params })
      .subscribe((response: any) => {
        if (response) {
          this.isFirstSearch = false;
          this.tourishPLanList = response.data;
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

  getTotalPrice(tourishPlan: TourishPlan): number {
    let totalPrice = 0;

    tourishPlan.stayingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.eatSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.movingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    return totalPrice;
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
    this.tourishPLanList = [];
    this.isLoading = true;
    this.getTourPack();
  }
}
