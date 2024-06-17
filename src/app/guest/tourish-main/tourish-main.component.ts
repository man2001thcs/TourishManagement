import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ThemePalette } from "@angular/material/core";
import { Router } from "@angular/router";
import { TourishCategory } from "src/app/model/baseModel";
import { TokenStorageService } from "src/app/utility/user_service/token.service";

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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit() {
    this.setTourForm = this.fb.group({
      endPoint: [""],
      startingDate: [""],
      startingPoint: [""],
    });

    this.getCategory();
  }

  getCategory() {
    const params = {
      page: 1,
      pageSize: 6,
    };

    this.http
      .get("/api/GetTourCategory/client", { params: params })
      .subscribe((response: any) => {
        this.categoryList = response.data;
        
        this.length = response.count;
      });
  }

  navigateToSearch() {
    const params = {
      startingPoint: this.setTourForm.value.startingPoint,
      endPoint: this.setTourForm.value.endPoint,
      startingDate: this.setTourForm.value.startingDate,
    };
    if (this.tokenStorageService.getUserRole() === "User") {
      this.router.navigate(["user/search-page"], { queryParams: params });
    }
    this.router.navigate(["guest/search-page"], { queryParams: params });
  }
}
