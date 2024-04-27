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
import { MovingSchedule, StayingSchedule } from "src/app/model/baseModel";
import { messaging } from "src/conf/firebase.conf";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-schedule-pack",
  templateUrl: "./schedule-pack.component.html",
  styleUrls: ["./schedule-pack.component.css"],
})
export class SchedulePackComponent implements OnInit, AfterViewInit {
  @Input()
  scheduleType = 1;

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  movingScheduleList: MovingSchedule[] = [];
  stayingScheduleList: StayingSchedule[] = [];
  length = 0;

  color: ThemePalette = "primary";

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2,
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.getTourPack();
  }

  ngAfterViewInit() {
    this.adjustSize();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.adjustSize();
      }
    });

    // Observe the childDiv element for size changes
    resizeObserver.observe(this.packContainer.nativeElement);
  }

  adjustSize() {
    let childWidth = parseInt(this.packContainer.nativeElement.offsetWidth, 0);
    // Example logic, you can adjust this according to your needs
    if (childWidth >= 1700) {
      console.log("here");
      // this.packContainer.nativeElement.style["border-right"] = "30px 18% 30px";
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 18% 30px"
      );
    } else if (childWidth < 1700 && childWidth >= 1500) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 13% 30px"
      );
    } else if (childWidth < 1500 && childWidth >= 1200) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else if (childWidth < 1200 && childWidth >= 900) {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 12% 30px"
      );
    } else {
      this.renderer.setStyle(
        this.packContainer.nativeElement,
        "padding",
        "30px 10% 30px"
      );
    }
  }

  getTourPack() {
    const params = {
      page: 1,
      pageSize: 6,
    };

    if (this.scheduleType == 1) {
      this.http
      .get("/api/GetMovingSchedule", { params: params })
      .subscribe((response: any) => {
        this.movingScheduleList = response.data;
        console.log(response);
        this.length = response.count;
      });
    } else if (this.scheduleType == 2) {
      this.http
      .get("/api/GetStayingSchedule", { params: params })
      .subscribe((response: any) => {
        this.stayingScheduleList = response.data;
        console.log(response);
        this.length = response.count;
      });
    }
    
  }

  capitalizeFirstLetter(sentence: string): string {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
