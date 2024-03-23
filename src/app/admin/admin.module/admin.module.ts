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
} from "@ng-bootstrap/ng-bootstrap";
import { FileUploadComponent } from "src/app/utility/image_service/imageUpload.component";
import { NbChatModule, NbThemeModule } from "@nebular/theme";
import { MatCardModule } from "@angular/material/card";
import { ImageListEffects } from "src/app/utility/image_service/imageUpload.store.effect";

import { PassengerCarCreateComponent } from "../PassengerCar/passenger_car_create/passenger_car-create.component";
import { PassengerCarDetailComponent } from "../PassengerCar/passenger_car_detail/passenger_car-detail.component";
import { PassengerCarListComponent } from "../PassengerCar/passenger_car_list/passenger_car-list.component";

import { HotelCreateComponent } from "../Hotel/hotel_create/hotel-create.component";
import { HotelDetailComponent } from "../Hotel/hotel_detail/hotel-detail.component";
import { HotelListComponent } from "../Hotel/hotel_list/hotel-list.component";

import { HomeStayCreateComponent } from "../HomeStay/homeStay_create/homeStay-create.component";
import { HomeStayDetailComponent } from "../HomeStay/homeStay_detail/homeStay-detail.component";
import { HomeStayListComponent } from "../HomeStay/homeStay_list/homeStay-list.component";

import { PassengerCarCreateEffects } from "../PassengerCar/passenger_car_create/passenger_car-create.store.effect";
import { PassengerCarEffects } from "../PassengerCar/passenger_car_detail/passenger_car-detail.store.effect";
import { PassengerCarListEffects } from "../PassengerCar/passenger_car_list/passenger_car-list.store.effect";

import { storeKey as PassengerCarCreateStoreKey } from "../PassengerCar/passenger_car_create/passenger_car-create.store.action";
import { reducer as PassengerCarCreateReducer } from "../PassengerCar/passenger_car_create/passenger_car-create.store.reducer";

import { storeKey as PassengerCarListStoreKey } from "../PassengerCar/passenger_car_list/passenger_car-list.store.action";
import { reducer as PassengerCarListReducer } from "../PassengerCar/passenger_car_list/passenger_car-list.store.reducer";

import { storeKey as PassengerCarDetailStoreKey } from "../PassengerCar/passenger_car_detail/passenger_car-detail.store.action";
import { reducer as PassengerCarDetailReducer } from "../PassengerCar/passenger_car_detail/passenger_car-detail.store.reducer";

import { AirPlaneCreateComponent } from "../AirPlane/air_plane_create/air_plane-create.component";
import { AirPlaneDetailComponent } from "../AirPlane/air_plane_detail/air_plane-detail.component";
import { AirPlaneListComponent } from "../AirPlane/air_plane_list/air_plane-list.component";

import { AirPlaneCreateEffects } from "../AirPlane/air_plane_create/air_plane-create.store.effect";
import { AirPlaneEffects } from "../AirPlane/air_plane_detail/air_plane-detail.store.effect";
import { AirPlaneListEffects } from "../AirPlane/air_plane_list/air_plane-list.store.effect";

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


import { storeKey as AirPlaneCreateStoreKey } from "../AirPlane/air_plane_create/air_plane-create.store.action";
import { reducer as AirPlaneCreateReducer } from "../AirPlane/air_plane_create/air_plane-create.store.reducer";

import { storeKey as AirPlaneListStoreKey } from "../AirPlane/air_plane_list/air_plane-list.store.action";
import { reducer as AirPlaneListReducer } from "../AirPlane/air_plane_list/air_plane-list.store.reducer";

import { storeKey as AirPlaneDetailStoreKey } from "../AirPlane/air_plane_detail/air_plane-detail.store.action";
import { reducer as AirPlaneDetailReducer } from "../AirPlane/air_plane_detail/air_plane-detail.store.reducer";

import { storeKey as HotelCreateStoreKey } from "../Hotel/hotel_create/hotel-create.store.action";
import { reducer as HotelCreateReducer } from "../Hotel/hotel_create/hotel-create.store.reducer";

import { storeKey as HotelListStoreKey } from "../Hotel/hotel_list/hotel-list.store.action";
import { reducer as HotelListReducer } from "../Hotel/hotel_list/hotel-list.store.reducer";

import { storeKey as HotelDetailStoreKey } from "../Hotel/hotel_detail/hotel-detail.store.action";
import { reducer as HotelDetailReducer } from "../Hotel/hotel_detail/hotel-detail.store.reducer";

import { storeKey as HomeStayCreateStoreKey } from "../HomeStay/homeStay_create/homeStay-create.store.action";
import { reducer as HomeStayCreateReducer } from "../HomeStay/homeStay_create/homeStay-create.store.reducer";

import { storeKey as HomeStayListStoreKey } from "../HomeStay/homeStay_list/homeStay-list.store.action";
import { reducer as HomeStayListReducer } from "../HomeStay/homeStay_list/homeStay-list.store.reducer";

import { storeKey as HomeStayDetailStoreKey } from "../HomeStay/homeStay_detail/homeStay-detail.store.action";
import { reducer as HomeStayDetailReducer } from "../HomeStay/homeStay_detail/homeStay-detail.store.reducer";

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

import { HotelCreateEffects } from "../Hotel/hotel_create/hotel-create.store.effect";
import { HotelEffects } from "../Hotel/hotel_detail/hotel-detail.store.effect";
import { HotelListEffects } from "../Hotel/hotel_list/hotel-list.store.effect";

import { HomeStayCreateEffects } from "../HomeStay/homeStay_create/homeStay-create.store.effect";
import { HomeStayEffects } from "../HomeStay/homeStay_detail/homeStay-detail.store.effect";
import { HomeStayListEffects } from "../HomeStay/homeStay_list/homeStay-list.store.effect";

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

import { storeKey as NotificationCreateStoreKey } from "../notification/notification_create/notification-create.store.action";
import { reducer as NotificationCreateReducer } from "../notification/notification_create/notification-create.store.reducer";

import { storeKey as NotificationListStoreKey } from "../notification/notification_list/notification-list.store.action";
import { reducer as NotificationListReducer } from "../notification/notification_list/notification-list.store.reducer";

import { storeKey as NotificationDetailStoreKey } from "../notification/notification_detail/notification-detail.store.action";
import { reducer as NotificationDetailReducer } from "../notification/notification_detail/notification-detail.store.reducer";
import { NotificationCreateEffects } from "../notification/notification_create/notification-create.store.effect";
import { NotificationEffects } from "../notification/notification_detail/notification-detail.store.effect";
import { NotificationListEffects } from "../notification/notification_list/notification-list.store.effect";
import { NotificationPackComponent } from "src/app/utility/notification-pack/notification-pack.component";
import { AvatarUploadComponent } from "src/app/utility/image_avatar_service/imageUpload.component";



@NgModule({
  declarations: [
    PassengerCarCreateComponent,
    PassengerCarDetailComponent,
    PassengerCarListComponent,

    AirPlaneCreateComponent,
    AirPlaneDetailComponent,
    AirPlaneListComponent,

    HotelCreateComponent,
    HotelDetailComponent,
    HotelListComponent,

    HomeStayCreateComponent,
    HomeStayDetailComponent,
    HomeStayListComponent,

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
    AvatarUploadComponent,

    AdminMainComponent,
    HeaderAdminComponent,

    StayingMultiselectAutocompleteComponent,
    MovingMultiselectAutocompleteComponent,
    EatingMultiselectAutocompleteComponent,
    TourishPlanMultiselectAutocompleteComponent,
    TourishCategoryMultiselectAutocompleteComponent,
    UserMultiselectAutocompleteComponent,

    NotificationPackComponent,

    FileUploadComponent,

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

    NgbAlertModule,

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
      PassengerCarCreateStoreKey,
      PassengerCarCreateReducer
    ),
    StoreModule.forFeature(PassengerCarListStoreKey, PassengerCarListReducer),
    StoreModule.forFeature(
      PassengerCarDetailStoreKey,
      PassengerCarDetailReducer
    ),

    StoreModule.forFeature(HotelCreateStoreKey, HotelCreateReducer),
    StoreModule.forFeature(HotelListStoreKey, HotelListReducer),
    StoreModule.forFeature(HotelDetailStoreKey, HotelDetailReducer),

    StoreModule.forFeature(HomeStayCreateStoreKey, HomeStayCreateReducer),
    StoreModule.forFeature(HomeStayListStoreKey, HomeStayListReducer),
    StoreModule.forFeature(HomeStayDetailStoreKey, HomeStayDetailReducer),

    StoreModule.forFeature(AirPlaneCreateStoreKey, AirPlaneCreateReducer),
    StoreModule.forFeature(AirPlaneListStoreKey, AirPlaneListReducer),
    StoreModule.forFeature(AirPlaneDetailStoreKey, AirPlaneDetailReducer),

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

    EffectsModule.forFeature([TourishPlanCreateEffects]),
    EffectsModule.forFeature([TourishPlanDetailEffects]),
    EffectsModule.forFeature([TourishPlanListEffects]),

    EffectsModule.forFeature([PassengerCarCreateEffects]),
    EffectsModule.forFeature([PassengerCarEffects]),
    EffectsModule.forFeature([PassengerCarListEffects]),

    EffectsModule.forFeature([AirPlaneCreateEffects]),
    EffectsModule.forFeature([AirPlaneEffects]),
    EffectsModule.forFeature([AirPlaneListEffects]),

    EffectsModule.forFeature([HotelCreateEffects]),
    EffectsModule.forFeature([HotelEffects]),
    EffectsModule.forFeature([HotelListEffects]),

    EffectsModule.forFeature([HomeStayCreateEffects]),
    EffectsModule.forFeature([HomeStayEffects]),
    EffectsModule.forFeature([HomeStayListEffects]),

    EffectsModule.forFeature([RestaurantCreateEffects]),
    EffectsModule.forFeature([RestaurantEffects]),
    EffectsModule.forFeature([RestaurantListEffects]),

    EffectsModule.forFeature([ReceiptCreateEffects]),
    EffectsModule.forFeature([ReceiptEffects]),
    EffectsModule.forFeature([ReceiptListEffects]),

    EffectsModule.forFeature([UserEffects]),
    EffectsModule.forFeature([UserListEffects]),

    EffectsModule.forFeature([AccountEffects]),
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class AdminModule {}
