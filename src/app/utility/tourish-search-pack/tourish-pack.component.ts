import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { TourishPlan } from "src/app/model/baseModel";
import { messaging } from "src/conf/firebase.conf";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-tourish-search-pack",
  templateUrl: "./tourish-pack.component.html",
  styleUrls: ["./tourish-pack.component.css"],
})
export class TourishSearchPackComponent implements OnInit {
  @Input()
  category: string = "Du lịch hành hương";
  @Input()
  description: string = "Tìm Về Chốn Thiêng, Lòng Người An Bình";

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  pageIndex = 0;
  pageSize = 10;
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

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      description: [
        "",
        Validators.compose([Validators.required, Validators.minLength(3)]),
      ],
    });

    this.getTourPack();
  }

  getTourPack() {
    const params = {
      page: 1,
      category: this.category,
      pageSize: 6,
    };

    this.http
      .get("/api/GetTourishPlan", { params: params })
      .subscribe((response: any) => {
        this.tourishPLanList = response.data;
        this.length = response.count;

        this.totalPage = Math.ceil(this.length / this.pageSize);

        this.pageArray = [];
        for (let i = 1; i <= this.totalPage; i++) {
          this.pageArray.push(i);
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
    console.log(index);
  }
}
