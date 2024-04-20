import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
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

  priceRange: PriceRange[] = [{ startPrice: 0, endPrice: 20000000 }, { startPrice: 20000000 , endPrice: 50000000 }, { startPrice: 50000000 , endPrice: 100000000 }, { startPrice: 100000000 , endPrice: 0 }];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      name: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      startingPlace: ["", Validators.compose([Validators.required])],
    });

    this.getCategory();
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
}
