import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OutsideClickDirective } from "./utility/clickDirective";
import { FooterComponent } from "./utility/footer/footer.component";
import { MatStepperModule } from "@angular/material/stepper";
import {
  NgbAlertModule,
  NgbCarouselModule,
  NgbNavModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ValidationComponent } from "./utility/validation/validation.component";
import { MatInputModule } from "@angular/material/input";
import { GoogleSigninButtonModule } from "@abacritt/angularx-social-login";
import { CarouselSlider } from "angular-carousel-slider";
import { ImageSliderComponent } from "./utility/image-slider/image-slider.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { HtmlSanitizerComponent } from "./utility/html-sanitizer/html-sanitizer.component";
import { NotificationSingleComponent } from "./utility/notification-single/notification-single.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
  declarations: [FooterComponent, OutsideClickDirective, ValidationComponent,ImageSliderComponent, HtmlSanitizerComponent, NotificationSingleComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbNavModule,
    FormsModule,
    MatInputModule,
    CarouselSlider,
    FontAwesomeModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
  ],

  exports: [
    NotificationSingleComponent,
    ImageSliderComponent,
    HtmlSanitizerComponent,
    CarouselSlider,
    FooterComponent,
    MatStepperModule,
    NgbCarouselModule,
    NgbNavModule,
    FormsModule,
    OutsideClickDirective,
    ValidationComponent,
    GoogleSigninButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule,
  ],
})

export class SharedModule {}
