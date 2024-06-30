import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PriceRange, TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-schedule-search",
  templateUrl: "./schedule-search.component.html",
  styleUrls: ["./schedule-search.component.css"],
})
export class ScheduleSearchComponent implements OnInit {
  @Input()
  data!: string;
  @ViewChild("picker") eatingPicker: any;

  active = 1;
  categoryList: TourishCategory[] = [];
  length = 5;

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  color: ThemePalette = "primary";

  defaultPriceRange: PriceRange = { startPrice: 0, endPrice: 100000000 };

  priceRange: PriceRange[] = [
    { startPrice: 0, endPrice: 2000000 },
    { startPrice: 2000000, endPrice: 5000000 },
    { startPrice: 5000000, endPrice: 10000000 },
    { startPrice: 10000000, endPrice: 0 },
  ];

  subscriptions: Subscription[] = [];

  startingDate = "";
  startingPoint = "";
  endPoint = "";
  priceTo = 100000000;
  priceFrom = 0;
  categoryString = "";
  scheduleType = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      startingDate: [null],
      startingPoint: [""],
      endPoint: [""],
    });

    this.subscriptions.push(
      this._route.queryParamMap.subscribe((query) => {
        if (query.get("serviceType")) {
          const serviceType = query.get("serviceType") ?? "";

          if (serviceType == "moving") this.scheduleType = 1;
          else if (serviceType == "staying") this.scheduleType = 2;
        }

        if (query.get("startingPoint")) {
          const startingPoint = query.get("startingPoint") ?? "";
          this.setTourForm.controls["startingPoint"].setValue(startingPoint);
        }

        if (query.get("endpoint")) {
          const endpoint = query.get("endpoint") ?? "";

          this.setTourForm.controls["endpoint"].setValue(endpoint);
        }

        if (query.get("priceFrom")) {
          const priceFrom = query.get("priceFrom") ?? "";

          this.setTourForm.controls["priceFrom"].setValue(priceFrom);
        }

        if (query.get("priceTo")) {
          const priceTo = query.get("priceTo") ?? "";

          this.setTourForm.controls["priceTo"].setValue(priceTo);
        }

        if (query.get("startingDate")) {
          const startingDate = query.get("startingDate") ?? "";
          this.startingDate = query.get("startingDate") ?? "";

          this.setTourForm.controls["startingDate"].setValue(startingDate);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  priceRangeChange($event: any) {
    if ($event) {
      this.priceFrom = $event.options[0].value.startPrice;
      this.priceTo = $event.options[0].value.endPrice;
    }
  }

  serviceChange($event: any) {
    if ($event) {
      if ($event.source._value.length == 0) this.scheduleType = 0;
      else {
        this.scheduleType = parseInt($event.options[0].value);
      }
    }
  }

  onSearch() {
    this.startingDate = this.setTourForm.value.startingDate;
    this.startingPoint = this.setTourForm.value.startingPoint;
    this.endPoint = this.setTourForm.value.endPoint;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }

  getDateFormat(isoDateString: string) {
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = ngayThang.getFullYear();
    const hour = ngayThang.getHours();
    const minute = ngayThang.getHours();

    const chuoiNgayThang = `Ngày ${day} tháng ${month}`;

    return chuoiNgayThang;
  }
}
