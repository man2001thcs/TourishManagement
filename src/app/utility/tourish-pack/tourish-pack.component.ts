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
import { NavigationExtras, Router } from "@angular/router";

import { NgbCarouselConfig } from "@ng-bootstrap/ng-bootstrap";
import { Slider } from "angular-carousel-slider/lib/angular-carousel-slider.component";
import { TourishPlan } from "src/app/model/baseModel";
import { messaging } from "src/conf/firebase.conf";
import { environment } from "src/environments/environment";
import { TokenStorageService } from "../user_service/token.service";
import { T } from "@angular/cdk/keycodes";
import { catchError, of } from "rxjs";
import { MessageService } from "../user_service/message.service";

@Component({
  selector: "app-tourish-pack",
  templateUrl: "./tourish-pack.component.html",
  styleUrls: ["./tourish-pack.component.css"],
})
export class TourishPackComponent implements OnInit, AfterViewInit {
  @Input()
  category: string = "Du lịch hành hương";
  @Input()
  description: string = "Tìm Về Chốn Thiêng, Lòng Người An Bình";

  @ViewChild("picker") eatingPicker: any;
  @ViewChild("packContainer") packContainer!: ElementRef;

  active = 1;

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
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    private tokenStorageService: TokenStorageService
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
      pageSize: 6,
    };

    this.http
      .get("/api/GetTourishPlan", { params: params })
      .pipe(
        catchError((error) => {
          this.messageService.openFailNotifyDialog(
            "Hệ thống đang gặp lỗi, vui lòng thử lại"
          );
          return of(null); // Return a null observable in case of error
        })
      )
      .subscribe((response: any) => {
        this.tourishPLanList = response.data;
        
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
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async navigateCategoryUrl(url: string, category: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { category: category }, // Replace 'key' and 'value' with your actual query parameters
    };
    if (this.tokenStorageService.getUserRole() == "User") {
      this.router.navigate(["user/" + url], navigationExtras);
    } else this.router.navigate(["guest/" + url], navigationExtras);
  }
}
