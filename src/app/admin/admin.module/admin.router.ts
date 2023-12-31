import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";

import { AdminMainComponent } from "../main/admin.main.component";
import { CanEditAdminGuard } from "../guard/edit-admin-guard.guard";
import {
  CanLeaveEditGuard,
  canLeaveSiteGuard,
} from "../guard/can-leave-edit.guard";
import { RouterModule } from "@angular/router";

import { EditDetailResolver } from "../resolver/edit-detail.resolver";
import { PassengerCarListComponent } from "../PassengerCar/passenger_car_list/passenger_car-list.component";
import { AirPlaneListComponent } from "../AirPlane/air_plane_list/air_plane-list.component";
import { HotelListComponent } from "../Hotel/hotel_list/hotel-list.component";
import { RestaurantListComponent } from "../Restaurant/restaurant_list/restaurant-list.component";
import { HomeStayListComponent } from "../HomeStay/homeStay_list/homeStay-list.component";
import { TourishPlanCreateAdminComponent } from "../TourishPlan/tourishPlan-create/tourishPlan-create_admin.component";
import { TourishPlanDetailAdminComponent } from "../TourishPlan/tourishPlan-detail/tourishPlan_admin.component";
import { TourishPlanListAdminComponent } from "../TourishPlan/tourishPlan-list/tourishPlanList.component";
import { ReceiptListComponent } from "../Receipt/receipt_list/receipt-list.component";
import { UserListComponent } from "../User/user_list/user-list.component";
import { AccountInfoComponent } from "../Account/account-info/account-info.component";

const routes: Routes = [
  {
    path: "",
    component: AdminMainComponent,
    children: [
      // other configuration

      {
        path: "tourish-plan/detail/:id/edit",
        component: TourishPlanDetailAdminComponent,
        canActivate: [CanEditAdminGuard], // <== this is an array, we can have multiple guards
        canDeactivate: [CanLeaveEditGuard],
      },
      {
        path: "tourish-plan/create",
        component: TourishPlanCreateAdminComponent,
        canActivate: [CanEditAdminGuard], // <== this is an array, we can have multiple guards
        canDeactivate: [canLeaveSiteGuard],
      },
      {
        path: "tourish-plan/list",
        component: TourishPlanListAdminComponent,
      },

      {
        path: "transport/passenger-car/list",
        component: PassengerCarListComponent,
      },
      {
        path: "transport/air-plane/list",
        component: AirPlaneListComponent,
      },
      {
        path: "resthouse/hotel/list",
        component: HotelListComponent,
      },
      {
        path: "resthouse/homeStay/list",
        component: HomeStayListComponent,
      },
      {
        path: "restaurant/list",
        component: RestaurantListComponent,
      },
      {
        path: "receipt/list",
        component: ReceiptListComponent,
      },
      {
        path: "user/list",
        component: UserListComponent,
      },
      {
        path: "account/info",
        component: AccountInfoComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouter {}
