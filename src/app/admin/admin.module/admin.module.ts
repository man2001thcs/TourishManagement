import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminMainComponent } from "../main/admin.main.component";
import { AdminRouter } from "./admin.router";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { HeaderAdminComponent } from "../header/header.admin.component";
import { MatMenuModule } from "@angular/material/menu";
import { FooterComponent } from "src/app/utility/footer/footer.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { storeKey as TourishCategoryAutocompleteStoreKey } from "src/app/utility/multiselect/tourishCategory-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as TourishCategoryAutocompleteReducer } from "src/app/utility/multiselect/tourishCategory-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as StayingAutocompleteStoreKey } from "src/app/utility/multiselect/staying-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as StayingAutocompleteReducer } from "src/app/utility/multiselect/staying-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as EatingAutocompleteStoreKey } from "src/app/utility/multiselect/eating-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as EatingAutocompleteReducer } from "src/app/utility/multiselect/eating-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as MovingAutocompleteStoreKey } from "src/app/utility/multiselect/moving-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as MovingAutocompleteReducer } from "src/app/utility/multiselect/moving-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as TourishPlanAutocompleteStoreKey } from "src/app/utility/multiselect/tourishPlan-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as TourishPlanAutocompleteReducer } from "src/app/utility/multiselect/tourishPlan-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as UserAutocompleteStoreKey } from "src/app/utility/multiselect/user-multiselect-autocomplete/multiselect-autocomplete.store.action";
import { reducer as UserAutocompleteReducer } from "src/app/utility/multiselect/user-multiselect-autocomplete/multiselect-autocomplete.store.reducer";

import { storeKey as ImageListStoreKey } from "../../utility/image_service/imageUpload.store.action";
import { reducer as ImageListReducer } from "../../utility/image_service/imageUpload.store.reducer";

import { OptionsScrollDirective } from "src/app/utility/config/multiselect-scroll.directive";
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbOffcanvasModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FileUploadComponent } from "src/app/utility/image_service/imageUpload.component";
import { NbChatModule, NbThemeModule } from "@nebular/theme";
import { MatCardModule } from "@angular/material/card";
import { ImageListEffects } from "src/app/utility/image_service/imageUpload.store.effect";

import { MovingContactCreateComponent } from "../MovingContact/moving_contact_create/moving_contact-create.component";
import { MovingContactDetailComponent } from "../MovingContact/moving_contact_detail/moving_contact-detail.component";
import { MovingContactListComponent } from "../MovingContact/moving_contact_list/moving_contact-list.component";

import { RestHouseContactCreateComponent } from "../RestHouseContact/rest-house-contact_create/rest-house-contact-create.component";
import { RestHouseContactDetailComponent } from "../RestHouseContact/rest-house-contact_detail/rest-house-contact-detail.component";
import { RestHouseContactListComponent } from "../RestHouseContact/rest-house-contact_list/rest-house-contact-list.component";

import { MovingContactCreateEffects } from "../MovingContact/moving_contact_create/moving_contact-create.store.effect";
import { MovingContactEffects } from "../MovingContact/moving_contact_detail/moving_contact-detail.store.effect";
import { MovingContactListEffects } from "../MovingContact/moving_contact_list/moving_contact-list.store.effect";

import { storeKey as MovingContactCreateStoreKey } from "../MovingContact/moving_contact_create/moving_contact-create.store.action";
import { reducer as MovingContactCreateReducer } from "../MovingContact/moving_contact_create/moving_contact-create.store.reducer";

import { storeKey as MovingContactListStoreKey } from "../MovingContact/moving_contact_list/moving_contact-list.store.action";
import { reducer as MovingContactListReducer } from "../MovingContact/moving_contact_list/moving_contact-list.store.reducer";

import { storeKey as MovingContactDetailStoreKey } from "../MovingContact/moving_contact_detail/moving_contact-detail.store.action";
import { reducer as MovingContactDetailReducer } from "../MovingContact/moving_contact_detail/moving_contact-detail.store.reducer";

import { storeKey as TourishPlanCreateStoreKey } from "../TourishPlan/tourishPlan-create/tourishPlan-create.store.action";
import { reducer as TourishPlanCreateReducer } from "../TourishPlan/tourishPlan-create/tourishPlan-create.store.reducer";

import { storeKey as TourishPlanListStoreKey } from "../TourishPlan/tourishPlan-list/tourishPlanList.store.action";
import { reducer as TourishPlanListReducer } from "../TourishPlan/tourishPlan-list/tourishPlanList.store.reducer";

import { storeKey as TourishPlanDetailStoreKey } from "../TourishPlan/tourishPlan-detail/tourishPlan-detail.store.action";
import { reducer as TourishPlanDetailReducer } from "../TourishPlan/tourishPlan-detail/tourishPlan-detail.store.reducer";


import { storeKey as TourishCategoryCreateStoreKey } from "../TourishCategory/tourish_category_create/tourish_category-create.store.action";
import { reducer as TourishCategoryCreateReducer } from "../TourishCategory/tourish_category_create/tourish_category-create.store.reducer";

import { storeKey as TourishCategoryListStoreKey } from "../TourishCategory/tourish_category_list/tourish_category-list.store.action";
import { reducer as TourishCategoryListReducer } from "../TourishCategory/tourish_category_list/tourish_category-list.store.reducer";

import { storeKey as TourishCategoryDetailStoreKey } from "../TourishCategory/tourish_category_detail/tourish_category-detail.store.action";
import { reducer as TourishCategoryDetailReducer } from "../TourishCategory/tourish_category_detail/tourish_category-detail.store.reducer";

import { storeKey as RestHouseContactCreateStoreKey } from "../RestHouseContact/rest-house-contact_create/rest-house-contact-create.store.action";
import { reducer as RestHouseContactCreateReducer } from "../RestHouseContact/rest-house-contact_create/rest-house-contact-create.store.reducer";

import { storeKey as RestHouseContactListStoreKey } from "../RestHouseContact/rest-house-contact_list/rest-house-contact-list.store.action";
import { reducer as RestHouseContactListReducer } from "../RestHouseContact/rest-house-contact_list/rest-house-contact-list.store.reducer";

import { storeKey as RestHouseContactDetailStoreKey } from "../RestHouseContact/rest-house-contact_detail/rest-house-contact-detail.store.action";
import { reducer as RestHouseContactDetailReducer } from "../RestHouseContact/rest-house-contact_detail/rest-house-contact-detail.store.reducer";

import { storeKey as RestaurantCreateStoreKey } from "../Restaurant/restaurant_create/restaurant-create.store.action";
import { reducer as RestaurantCreateReducer } from "../Restaurant/restaurant_create/restaurant-create.store.reducer";

import { storeKey as RestaurantListStoreKey } from "../Restaurant/restaurant_list/restaurant-list.store.action";
import { reducer as RestaurantListReducer } from "../Restaurant/restaurant_list/restaurant-list.store.reducer";

import { storeKey as RestaurantDetailStoreKey } from "../Restaurant/restaurant_detail/restaurant-detail.store.action";
import { reducer as RestaurantDetailReducer } from "../Restaurant/restaurant_detail/restaurant-detail.store.reducer";

import { storeKey as ReceiptCreateStoreKey } from "../Receipt/receipt_create/receipt-create.store.action";
import { reducer as ReceiptCreateReducer } from "../Receipt/receipt_create/receipt-create.store.reducer";

import { storeKey as ReceiptListStoreKey } from "../Receipt/receipt_list/receipt-list.store.action";
import { reducer as ReceiptListReducer } from "../Receipt/receipt_list/receipt-list.store.reducer";

import { storeKey as ReceiptDetailStoreKey } from "../Receipt/receipt_detail/receipt-detail.store.action";
import { reducer as ReceiptDetailReducer } from "../Receipt/receipt_detail/receipt-detail.store.reducer";

import { storeKey as UserListStoreKey } from "../User/user_list/user-list.store.action";
import { reducer as UserListReducer } from "../User/user_list/user-list.store.reducer";

import { storeKey as UserDetailStoreKey } from "../User/user_detail/user-detail.store.action";
import { reducer as UserDetailReducer } from "../User/user_detail/user-detail.store.reducer";

import { storeKey as AccountInfoStoreKey } from "../Account/account-info/account-info.store.action";
import { reducer as AccountInfoReducer } from "../Account/account-info/account-info.store.reducer";

import { SharedModule } from "src/app/shared.module";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { RestHouseContactCreateEffects } from "../RestHouseContact/rest-house-contact_create/rest-house-contact-create.store.effect";
import { RestHouseContactEffects } from "../RestHouseContact/rest-house-contact_detail/rest-house-contact-detail.store.effect";
import { RestHouseContactListEffects } from "../RestHouseContact/rest-house-contact_list/rest-house-contact-list.store.effect";

import { TourishPlanCreateEffects } from "../TourishPlan/tourishPlan-create/tourishPlan-create.store.effect";
import { TourishPlanListEffects } from "../TourishPlan/tourishPlan-list/tourishPlanList.store.effect";

import { RestaurantCreateEffects } from "../Restaurant/restaurant_create/restaurant-create.store.effect";
import { RestaurantEffects } from "../Restaurant/restaurant_detail/restaurant-detail.store.effect";
import { RestaurantListEffects } from "../Restaurant/restaurant_list/restaurant-list.store.effect";

import { MovingAutoCompleteListEffects } from "src/app/utility/multiselect/moving-multiselect-autocomplete/multiselect-autocomplete.store.effect";
import { EatingAutoCompleteListEffects } from "src/app/utility/multiselect/eating-multiselect-autocomplete/multiselect-autocomplete.store.effect";
import { StayingAutoCompleteListEffects } from "src/app/utility/multiselect/staying-multiselect-autocomplete/multiselect-autocomplete.store.effect";

import { RestaurantCreateComponent } from "../Restaurant/restaurant_create/restaurant-create.component";
import { RestaurantDetailComponent } from "../Restaurant/restaurant_detail/restaurant-detail.component";
import { RestaurantListComponent } from "../Restaurant/restaurant_list/restaurant-list.component";

import { StayingMultiselectAutocompleteComponent } from "src/app/utility/multiselect/staying-multiselect-autocomplete/multiselect-autocomplete.component";
import { MovingMultiselectAutocompleteComponent } from "src/app/utility/multiselect/moving-multiselect-autocomplete/multiselect-autocomplete.component";
import { EatingMultiselectAutocompleteComponent } from "src/app/utility/multiselect/eating-multiselect-autocomplete/multiselect-autocomplete.component";

import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
} from "@angular-material-components/datetime-picker";
import { MatDatepickerModule } from "@angular/material/datepicker";

import { TourishPlanCreateAdminComponent } from "../TourishPlan/tourishPlan-create/tourishPlan-create_admin.component";
import { TourishPlanListAdminComponent } from "../TourishPlan/tourishPlan-list/tourishPlanList.component";
import { TourishPlanDetailAdminComponent } from "../TourishPlan/tourishPlan-detail/tourishPlan_admin.component";

import { ValidationComponent } from "src/app/utility/validation/validation.component";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";

import { TourishPlanDetailEffects } from "../TourishPlan/tourishPlan-detail/tourishPlan-detail.store.effect";
import { TourishPlanAutoCompleteListEffects } from "src/app/utility/multiselect/tourishPlan-multiselect-autocomplete/multiselect-autocomplete.store.effect";
import { TourishPlanMultiselectAutocompleteComponent } from "src/app/utility/multiselect/tourishPlan-multiselect-autocomplete/multiselect-autocomplete.component";

import { ReceiptCreateComponent } from "../Receipt/receipt_create/receipt-create.component";
import { ReceiptListComponent } from "../Receipt/receipt_list/receipt-list.component";
import { ReceiptDetailComponent } from "../Receipt/receipt_detail/receipt-detail.component";

import { ReceiptCreateEffects } from "../Receipt/receipt_create/receipt-create.store.effect";
import { ReceiptEffects } from "../Receipt/receipt_detail/receipt-detail.store.effect";
import { ReceiptListEffects } from "../Receipt/receipt_list/receipt-list.store.effect";
import { UserDetailComponent } from "../User/user_detail/user-detail.component";
import { UserListComponent } from "../User/user_list/user-list.component";
import { UserEffects } from "../User/user_detail/user-detail.store.effect";
import { UserListEffects } from "../User/user_list/user-list.store.effect";
import { AccountInfoComponent } from "../Account/account-info/account-info.component";
import { AccountEffects } from "../Account/account-info/account-info.store.effect";

import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { TourishCategoryCreateComponent } from "../TourishCategory/tourish_category_create/tourish_category-create.component";
import { TourishCategoryDetailComponent } from "../TourishCategory/tourish_category_detail/tourish_category-detail.component";
import { TourishCategoryListComponent } from "../TourishCategory/tourish_category_list/tourish_category-list.component";
import { TourishCategoryCreateEffects } from "../TourishCategory/tourish_category_create/tourish_category-create.store.effect";
import { TourishCategoryEffects } from "../TourishCategory/tourish_category_detail/tourish_category-detail.store.effect";
import { TourishCategoryListEffects } from "../TourishCategory/tourish_category_list/tourish_category-list.store.effect";
import { TourishCategoryMultiselectAutocompleteComponent } from "src/app/utility/multiselect/tourishCategory-multiselect-autocomplete/multiselect-autocomplete.component";
import { TourishCategoryAutoCompleteListEffects } from "src/app/utility/multiselect/tourishCategory-multiselect-autocomplete/multiselect-autocomplete.store.effect";
import { NotificationCreateComponent } from "../notification/notification_create/notification-create.component";
import { NotificationDetailComponent } from "../notification/notification_detail/notification-detail.component";
import { NotificationListComponent } from "../notification/notification_list/notification-list.component";
import { UserMultiselectAutocompleteComponent } from "src/app/utility/multiselect/user-multiselect-autocomplete/multiselect-autocomplete.component";
import { UserAutoCompleteListEffects } from "src/app/utility/multiselect/user-multiselect-autocomplete/multiselect-autocomplete.store.effect";

import { storeKey as ChatConHistoryListStoreKey } from "../ChatConHistory/chat_con_his_list//chat_con_his_list.store.action";
import { reducer as ChatConHistoryListReducer } from "../ChatConHistory/chat_con_his_list/chat_con_his_list.store.reducer";

import { storeKey as NotificationCreateStoreKey } from "../notification/notification_create/notification-create.store.action";
import { reducer as NotificationCreateReducer } from "../notification/notification_create/notification-create.store.reducer";

import { storeKey as NotificationListStoreKey } from "../notification/notification_list/notification-list.store.action";
import { reducer as NotificationListReducer } from "../notification/notification_list/notification-list.store.reducer";

import { storeKey as MovingScheduleCreateStoreKey } from "../Schedule-moving/schedule_moving_create/schedule_moving-create.store.action";
import { reducer as MovingScheduleCreateReducer } from "../Schedule-moving/schedule_moving_create/schedule_moving-create.store.reducer";

import { storeKey as MovingScheduleDetailStoreKey } from "../Schedule-moving/schedule_moving_detail/schedule_moving-detail.store.action";
import { reducer as MovingScheduleDetailReducer } from "../Schedule-moving/schedule_moving_detail/schedule_moving-detail.store.reducer";

import { storeKey as MovingScheduleListStoreKey } from "../Schedule-moving/schedule_moving_list/schedule_moving-list.store.action";
import { reducer as MovingScheduleListReducer } from "../Schedule-moving/schedule_moving_list/schedule_moving-list.store.reducer";

import { storeKey as MovingContactSelectStoreKey } from "../../utility/multiselect/moving-contact-select-autocomplete/select-autocomplete.store.action";
import { reducer as MovingContactSelectReducer } from "../../utility/multiselect/moving-contact-select-autocomplete/select-autocomplete.store.reducer";

import { storeKey as NotificationDetailStoreKey } from "../notification/notification_detail/notification-detail.store.action";
import { reducer as NotificationDetailReducer } from "../notification/notification_detail/notification-detail.store.reducer";
import { NotificationCreateEffects } from "../notification/notification_create/notification-create.store.effect";
import { NotificationEffects } from "../notification/notification_detail/notification-detail.store.effect";
import { NotificationListEffects } from "../notification/notification_list/notification-list.store.effect";
import { AvatarUploadComponent } from "src/app/utility/image_avatar_service/imageUpload.component";
import { BigChatComponent } from "src/app/utility/big-chat/big-chat.component";
import { GuestMessageConHistoryListComponent } from "../ChatConHistory/chat_con_his_list/chat_con_his_list.component";
import { GuestMessageConHistoryListEffects } from "../ChatConHistory/chat_con_his_list/chat_con_his_list.store.effect";
import { MovingContactSelectAutocompleteComponent } from "src/app/utility/multiselect/moving-contact-select-autocomplete/select-autocomplete.component";
import { MovingScheduleCreateComponent } from "../Schedule-moving/schedule_moving_create/schedule_moving-create.component";
import { MovingScheduleDetailComponent } from "../Schedule-moving/schedule_moving_detail/schedule_moving-detail.component";
import { MovingScheduleListComponent } from "../Schedule-moving/schedule_moving_list/schedule_moving-list.component";
import { MovingScheduleCreateEffects } from "../Schedule-moving/schedule_moving_create/schedule_moving-create.store.effect";
import { MovingScheduleEffects } from "../Schedule-moving/schedule_moving_detail/schedule_moving-detail.store.effect";
import { MovingScheduleListEffects } from "../Schedule-moving/schedule_moving_list/schedule_moving-list.store.effect";
import { MovingContactAutoCompleteListEffects } from "src/app/utility/multiselect/moving-contact-select-autocomplete/select-autocomplete.store.effect";
import { AvatarUploadModalComponent } from "src/app/utility/image_avatar_modal/imageUpload.component";
import { TourScheduleMultiselectAutocompleteComponent } from "src/app/utility/multiselect/tour-schedule-multiselect-autocomplete/multiselect-autocomplete.component";
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    MovingContactCreateComponent,
    MovingContactDetailComponent,
    MovingContactListComponent,

    RestHouseContactCreateComponent,
    RestHouseContactDetailComponent,
    RestHouseContactListComponent,

    RestaurantCreateComponent,
    RestaurantDetailComponent,
    RestaurantListComponent,

    TourishPlanCreateAdminComponent,
    TourishPlanListAdminComponent,
    TourishPlanDetailAdminComponent,

    TourishCategoryCreateComponent,
    TourishCategoryDetailComponent,
    TourishCategoryListComponent,

    NotificationCreateComponent,
    NotificationDetailComponent,
    NotificationListComponent,

    ReceiptCreateComponent,
    ReceiptListComponent,
    ReceiptDetailComponent,

    UserDetailComponent,
    UserListComponent,

    AccountInfoComponent,

    AdminMainComponent,
    HeaderAdminComponent,
    GuestMessageConHistoryListComponent,

    MovingContactSelectAutocompleteComponent,
    MovingScheduleCreateComponent,
    MovingScheduleDetailComponent,
    MovingScheduleListComponent,

    StayingMultiselectAutocompleteComponent,
    MovingMultiselectAutocompleteComponent,
    EatingMultiselectAutocompleteComponent,
    TourishPlanMultiselectAutocompleteComponent,
    TourishCategoryMultiselectAutocompleteComponent,
    UserMultiselectAutocompleteComponent,
    FileUploadComponent,
    BigChatComponent,
    AvatarUploadModalComponent,
    TourScheduleMultiselectAutocompleteComponent,
    OptionsScrollDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRouter,
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
    NgbDropdownModule,
    MatProgressSpinnerModule,
    NgbNavModule,
    NgbOffcanvasModule,
    NgbAlertModule,
    MatSelectModule,
    MatExpansionModule,

    NbChatModule,

    EditorModule,

    StoreModule.forFeature(TourishPlanCreateStoreKey, TourishPlanCreateReducer),
    StoreModule.forFeature(TourishPlanListStoreKey, TourishPlanListReducer),
    StoreModule.forFeature(TourishPlanDetailStoreKey, TourishPlanDetailReducer),

    StoreModule.forFeature(TourishCategoryCreateStoreKey, TourishCategoryCreateReducer),
    StoreModule.forFeature(TourishCategoryListStoreKey, TourishCategoryListReducer),
    StoreModule.forFeature(TourishCategoryDetailStoreKey,TourishCategoryDetailReducer),

    StoreModule.forFeature(NotificationCreateStoreKey, NotificationCreateReducer),
    StoreModule.forFeature(NotificationListStoreKey, NotificationListReducer),
    StoreModule.forFeature(NotificationDetailStoreKey,NotificationDetailReducer),

    StoreModule.forFeature(
      MovingContactCreateStoreKey,
      MovingContactCreateReducer
    ),
    StoreModule.forFeature(MovingContactListStoreKey, MovingContactListReducer),
    StoreModule.forFeature(
      MovingContactDetailStoreKey,
      MovingContactDetailReducer
    ),
    StoreModule.forFeature(ChatConHistoryListStoreKey, ChatConHistoryListReducer),

    StoreModule.forFeature(RestHouseContactCreateStoreKey, RestHouseContactCreateReducer),
    StoreModule.forFeature(RestHouseContactListStoreKey, RestHouseContactListReducer),
    StoreModule.forFeature(RestHouseContactDetailStoreKey, RestHouseContactDetailReducer),

    StoreModule.forFeature(RestaurantCreateStoreKey, RestaurantCreateReducer),
    StoreModule.forFeature(RestaurantListStoreKey, RestaurantListReducer),
    StoreModule.forFeature(RestaurantDetailStoreKey, RestaurantDetailReducer),

    StoreModule.forFeature(ReceiptCreateStoreKey, ReceiptCreateReducer),
    StoreModule.forFeature(ReceiptListStoreKey, ReceiptListReducer),
    StoreModule.forFeature(ReceiptDetailStoreKey, ReceiptDetailReducer),

    StoreModule.forFeature(UserListStoreKey, UserListReducer),
    StoreModule.forFeature(UserDetailStoreKey, UserDetailReducer),

    StoreModule.forFeature(AccountInfoStoreKey, AccountInfoReducer),

    StoreModule.forFeature(
      TourishCategoryAutocompleteStoreKey,
      TourishCategoryAutocompleteReducer
    ),

    StoreModule.forFeature(
      StayingAutocompleteStoreKey,
      StayingAutocompleteReducer
    ),

    StoreModule.forFeature(
      MovingAutocompleteStoreKey,
      MovingAutocompleteReducer
    ),

    StoreModule.forFeature(
      EatingAutocompleteStoreKey,
      EatingAutocompleteReducer
    ),

    StoreModule.forFeature(
      TourishPlanAutocompleteStoreKey,
      TourishPlanAutocompleteReducer
    ),

    StoreModule.forFeature(
      UserAutocompleteStoreKey,
      UserAutocompleteReducer
    ),

    StoreModule.forFeature(ImageListStoreKey, ImageListReducer),

    StoreModule.forFeature(MovingScheduleCreateStoreKey, MovingScheduleCreateReducer),
    StoreModule.forFeature(MovingScheduleDetailStoreKey, MovingScheduleDetailReducer),
    StoreModule.forFeature(MovingScheduleListStoreKey, MovingScheduleListReducer),
    StoreModule.forFeature(MovingContactSelectStoreKey, MovingContactSelectReducer),

    EffectsModule.forFeature([TourishCategoryCreateEffects]),
    EffectsModule.forFeature([TourishCategoryEffects]),
    EffectsModule.forFeature([TourishCategoryListEffects]),

    EffectsModule.forFeature([NotificationCreateEffects]),
    EffectsModule.forFeature([NotificationEffects]),
    EffectsModule.forFeature([NotificationListEffects]),

    EffectsModule.forFeature([TourishCategoryAutoCompleteListEffects]),
    EffectsModule.forFeature([StayingAutoCompleteListEffects]),
    EffectsModule.forFeature([MovingAutoCompleteListEffects]),
    EffectsModule.forFeature([EatingAutoCompleteListEffects]),
    EffectsModule.forFeature([TourishPlanAutoCompleteListEffects]),
    EffectsModule.forFeature([UserAutoCompleteListEffects]),

    EffectsModule.forFeature([ImageListEffects]),
    EffectsModule.forFeature([GuestMessageConHistoryListEffects]),

    EffectsModule.forFeature([TourishPlanCreateEffects]),
    EffectsModule.forFeature([TourishPlanDetailEffects]),
    EffectsModule.forFeature([TourishPlanListEffects]),

    EffectsModule.forFeature([MovingContactCreateEffects]),
    EffectsModule.forFeature([MovingContactEffects]),
    EffectsModule.forFeature([MovingContactListEffects]),

    EffectsModule.forFeature([RestHouseContactCreateEffects]),
    EffectsModule.forFeature([RestHouseContactEffects]),
    EffectsModule.forFeature([RestHouseContactListEffects]),

    EffectsModule.forFeature([RestaurantCreateEffects]),
    EffectsModule.forFeature([RestaurantEffects]),
    EffectsModule.forFeature([RestaurantListEffects]),

    EffectsModule.forFeature([ReceiptCreateEffects]),
    EffectsModule.forFeature([ReceiptEffects]),
    EffectsModule.forFeature([ReceiptListEffects]),

    EffectsModule.forFeature([UserEffects]),
    EffectsModule.forFeature([UserListEffects]),

    EffectsModule.forFeature([AccountEffects]),

    EffectsModule.forFeature([MovingScheduleCreateEffects]),
    EffectsModule.forFeature([MovingScheduleEffects]),
    EffectsModule.forFeature([MovingScheduleListEffects]),

    EffectsModule.forFeature([MovingContactAutoCompleteListEffects]),
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class AdminModule {}
