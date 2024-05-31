import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { HtmlSanitizerComponent } from "./utility/html-sanitizer/html-sanitizer.component";
import { NotificationSingleComponent } from "./utility/notification-single/notification-single.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TinyMceEditorComponent } from "./utility/tiny-mce-editor/tiny-mce-editor.component";
import {
  EditorComponent,
  EditorModule,
  TINYMCE_SCRIPT_SRC,
} from "@tinymce/tinymce-angular";
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ChatGuestSelectorComponent } from "./utility/chat-guest-selector/chat-guest-selector.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { CommentSectionComponent } from "./utility/comment-section/comment-section.component";
import { MatButtonModule } from "@angular/material/button";
import { CommentTourSingleComponent } from "./utility/comment-tour-single/comment-tour-single.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatList, MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatMenuModule } from "@angular/material/menu";
import { MatSortModule } from "@angular/material/sort";
import { MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { NotificationPackComponent } from "./utility/notification-pack/notification-pack.component";
import { ChatComponent } from "./utility/chat/chat.component";
import { TourishPlanCardComponent } from "./utility/tourish-card/tourish-card.component";
import { TourishDetailComponent } from "./guest/tourish-detail/tourish-detail.component";
import { TourishMainComponent } from "./guest/tourish-main/tourish-main.component";
import { TourishPackComponent } from "./utility/tourish-pack/tourish-pack.component";
import { StarRatingComponent } from "./utility/star-rating/star-rating.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { AvatarUploadComponent } from "./utility/image_avatar_service/imageUpload.component";
import { TourishSearchComponent } from "./guest/tourish-search/tourish-search.component";
import { TourishPlanSearchCardComponent } from "./utility/tourish-search-card/tourish-card.component";
import { TourishSearchPackComponent } from "./utility/tourish-search-pack/tourish-pack.component";
import { TourishPlanAutoSearchCardComponent } from "./utility/tourish-auto-search-card/tourish-card.component";
import { ScheduleCardComponent } from "./utility/schedule-card/schedule-card.component";
import { SchedulePackComponent } from "./utility/schedule-pack/schedule-pack.component";
import { ScheduleSearchComponent } from "./guest/schedule-search/schedule-search.component";
import { ScheduleSearchPackComponent } from "./utility/schedule-search-pack/schedule-pack.component";
import { SchedulePlanSearchCardComponent } from "./utility/schedule-search-card/schedule-card.component";
import { ScheduleDetailComponent } from "./guest/schedule-detail/schedule-detail.component";
import { MatSelectModule } from "@angular/material/select";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NotFoundComponent } from "./utility/not-found-page/404.component";
import { InViewportDirective } from "./utility/checkInsideDirective";
import {MatBadgeModule} from '@angular/material/badge';
import { ReceiveChatComponent } from "./utility/chat/receive-chat/chat.component";
import { SendChatComponent } from "./utility/chat/send-chat/chat.component";
import { ReceiveBigChatComponent } from "./utility/big-chat/receive-chat/chat.component";
import { SendBigChatComponent } from "./utility/big-chat/send-chat/chat.component";

@NgModule({
  declarations: [
    FooterComponent,
    OutsideClickDirective,
    InViewportDirective,
    ValidationComponent,
    ImageSliderComponent,
    HtmlSanitizerComponent,
    NotificationSingleComponent,
    TinyMceEditorComponent,
    ChatGuestSelectorComponent,
    CommentSectionComponent,
    CommentTourSingleComponent,
    NotificationPackComponent,
    ChatComponent,
    TourishPlanCardComponent,
    TourishDetailComponent,
    TourishMainComponent,
    TourishPackComponent,
    TourishSearchComponent,
    StarRatingComponent,
    AvatarUploadComponent,
    TourishPlanSearchCardComponent,
    TourishSearchPackComponent,
    TourishPlanAutoSearchCardComponent,
    NotFoundComponent,

    ScheduleCardComponent,
    SchedulePackComponent,
    ScheduleSearchComponent,
    ScheduleSearchPackComponent,
    SchedulePlanSearchCardComponent,
    ScheduleDetailComponent,

    ReceiveChatComponent,
    SendChatComponent,

    ReceiveBigChatComponent,
    SendBigChatComponent,
  ],
  imports: [
    MatBadgeModule,
    MatListModule,
    MatTabsModule,
    MatListModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    PickerModule,
    CommonModule,
    RouterModule,
    NgbNavModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    CarouselSlider,
    FontAwesomeModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    EditorModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatTooltipModule,
    MatSidenavModule,
  ],

  exports: [
    MatBadgeModule,
    PickerModule,
    MatListModule,
    MatTooltipModule,
    NotificationSingleComponent,
    MatListModule,
    MatTabsModule,
    MatListModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCardModule,
    MatExpansionModule,
    ImageSliderComponent,
    HtmlSanitizerComponent,
    CarouselSlider,
    FooterComponent,
    MatStepperModule,
    NgbCarouselModule,
    NgbNavModule,
    FormsModule,
    OutsideClickDirective,
    InViewportDirective,
    ValidationComponent,
    GoogleSigninButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule,
    TinyMceEditorComponent,
    ChatGuestSelectorComponent,
    MatProgressSpinnerModule,
    MatSidenavModule,
    CommentSectionComponent,
    CommentTourSingleComponent,
    NotificationPackComponent,

    ChatComponent,
    ReceiveChatComponent,
    SendChatComponent,
    
    ReceiveBigChatComponent,
    SendBigChatComponent,

    TourishPlanCardComponent,
    TourishDetailComponent,
    TourishMainComponent,
    TourishPackComponent,
    TourishSearchComponent,
    StarRatingComponent,
    MatSnackBarModule,
    AvatarUploadComponent,
    TourishPlanSearchCardComponent,
    TourishSearchPackComponent,
    TourishPlanAutoSearchCardComponent,

    ScheduleCardComponent,
    SchedulePackComponent,
    ScheduleSearchComponent,
    ScheduleDetailComponent,

    NotFoundComponent,
    ScheduleSearchPackComponent,
    SchedulePlanSearchCardComponent
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class SharedModule {}
