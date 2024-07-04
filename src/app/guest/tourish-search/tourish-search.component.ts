import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription, catchError, of } from "rxjs";
import { PriceRange, TourishCategory } from "src/app/model/baseModel";
import { MessageService } from "src/app/utility/user_service/message.service";

@Component({
  selector: "app-tourish-search",
  templateUrl: "./tourish-search.component.html",
  styleUrls: ["./tourish-search.component.css"],
})
export class TourishSearchComponent implements OnInit {
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

  categoryArray: string[] = [];

  defaultPriceRange: PriceRange = 
    { startPrice: 0, endPrice: 100000000 }
  ;

  priceRange: PriceRange[] = [
    { startPrice: 0, endPrice: 5000000 },
    { startPrice: 5000000, endPrice: 10000000 },
    { startPrice: 10000000, endPrice: 200000000 },
    { startPrice: 200000000, endPrice: 0 },
  ];

  subscriptions: Subscription[] = [];

  startingDate = "";
  startingPoint = "";
  endPoint = "";
  priceTo = 100000000;
  priceFrom = 0;
  categoryString = "";
  search = "";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      startingDate: [""],
      startingPoint: [""],
      endPoint: [""],
    });

    this.subscriptions.push(
      this._route.queryParamMap.subscribe((query) => {
        if (query.get("search")) {
          this.search = query.get("search") ?? "";
        }

        if (query.get("category")) {
          this.categoryArray = [query.get("category") ?? ""];
          this.categoryString = JSON.stringify(this.categoryArray);
        }

        if (query.get("startingPoint")) {
          const startingPoint = query.get("startingPoint") ?? "";
          this.startingPoint = startingPoint;
          this.setTourForm.controls["startingPoint"].setValue(startingPoint);
        }

        if (query.get("endPoint")) {
          const endpoint = query.get("endPoint") ?? "";
          this.endPoint = endpoint;
          this.setTourForm.controls["endPoint"].setValue(endpoint);
        }

        if (query.get("priceFrom")) {
          const priceFrom = query.get("priceFrom") ?? "";
          this.priceFrom = parseInt(priceFrom);
          this.setTourForm.controls["priceFrom"].setValue(priceFrom);
        }

        if (query.get("priceTo")) {
          const priceTo = query.get("priceTo") ?? "";
          this.priceTo = parseInt(priceTo);
          this.setTourForm.controls["priceTo"].setValue(priceTo);
        }

        if (query.get("startingDate")) {
          const startingDate = query.get("startingDate") ?? "";
          this.startingDate = startingDate;
          this.setTourForm.controls["startingDate"].setValue(startingDate);
        }
      })
    );

    this.getCategory();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getCategory() {
    const params = {
      page: 1,
      pageSize: 20,
    };

    this.http
      .get("/api/GetTourCategory", { params: params }).pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        this.categoryList = response.data;
        
        this.length = response.count;
      });
  }

  priceRangeChange($event: any) {
    if ($event) {
      this.priceFrom = $event.options[0].value.startPrice;
      this.priceTo = $event.options[0].value.endPrice;
    }
  }

  categoryChange($event: any) {
    if ($event) {
      if ($event.source._value.length == 0) this.categoryString = "";
      else {
        this.categoryString = JSON.stringify($event.source._value);
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
