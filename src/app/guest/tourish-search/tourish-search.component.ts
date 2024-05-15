import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PriceRange, TourishCategory } from "src/app/model/baseModel";

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

  priceRange: PriceRange[] = [
    { startPrice: 0, endPrice: 20000000 },
    { startPrice: 20000000, endPrice: 50000000 },
    { startPrice: 50000000, endPrice: 100000000 },
    { startPrice: 100000000, endPrice: 0 },
  ];

  subscriptions: Subscription[] = [];

  startingDate = "";
  startingPoint = "";
  endPoint = "";
  priceTo = 20000000;
  priceFrom = 0;
  categoryString = "";
  search = "";

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private _route: ActivatedRoute
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
      pageSize: 6,
    };

    this.http
      .get("/api/GetTourCategory", { params: params })
      .subscribe((response: any) => {
        this.categoryList = response.data;
        console.log(response);
        this.length = response.count;
      });
  }

  priceRangeChange($event: any) {
    if ($event) {
      console.log($event.options[0].value);
      this.priceFrom = $event.options[0].value.startPrice;
      this.priceTo = $event.options[0].value.endPrice;
    }
  }

  categoryChange($event: any) {
    if ($event) {
      console.log($event.source._value);
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
}