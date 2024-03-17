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

@Component({
  selector: "app-tourish-pack",
  templateUrl: "./tourish-pack.component.html",
  styleUrls: ["./tourish-pack.component.css"],
})
export class TourishPackComponent implements OnInit, AfterViewInit {
  @Input()
  category: string = "Du lịch hành hương";
  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

  setTourForm!: FormGroup;
  isSubmit = false;
  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;

  tourishPLanList: TourishPlan[] = [];
  length = 0;

  color: ThemePalette = "primary";

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
      category: this.category,
      pageSize: 6
    };

    this.http.get("/api/GetTourishPlan", { params: params }).subscribe((response: any) => {
      this.tourishPLanList = response.data;
      console.log(response);
      this.length = response.count;
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
    return sentence.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
}
