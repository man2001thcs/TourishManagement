import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-main",
  templateUrl: "./tourish-main.component.html",
  styleUrls: ["./tourish-main.component.css"],
})
export class TourishMainComponent implements OnInit {
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
