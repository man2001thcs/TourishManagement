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

import { MovingContactListComponent } from "../MovingContact/moving_contact_list/moving_contact-list.component";
import { RestaurantListComponent } from "../Restaurant/restaurant_list/restaurant-list.component";
import { RestHouseContactListComponent } from "../RestHouseContact/rest-house-contact_list/rest-house-contact-list.component";
import { TourishPlanCreateAdminComponent } from "../TourishPlan/tourishPlan-create/tourishPlan-create_admin.component";
import { TourishPlanDetailAdminComponent } from "../TourishPlan/tourishPlan-detail/tourishPlan_admin.component";
import { TourishPlanListAdminComponent } from "../TourishPlan/tourishPlan-list/tourishPlanList.component";
import { ReceiptListComponent } from "../Receipt/receipt_list/receipt-list.component";
import { UserListComponent } from "../User/user_list/user-list.component";
import { AccountInfoComponent } from "../Account/account-info/account-info.component";
import { TourishCategoryListComponent } from "../TourishCategory/tourish_category_list/tourish_category-list.component";
import { NotificationListComponent } from "../notification/notification_list/notification-list.component";
import { BigChatComponent } from "src/app/utility/big-chat/big-chat.component";
import { GuestMessageConHistoryListComponent } from "../ChatConHistory/chat_con_his_list/chat_con_his_list.component";
import { MovingScheduleListComponent } from "../Schedule-moving/schedule_moving_list/schedule_moving-list.component";
import { StayingScheduleListComponent } from "../Schedule-staying/schedule_staying_list/schedule_staying-list.component";
import { NotFoundComponent } from "src/app/utility/not-found-page/404.component";
import { DashboardComponent } from "src/app/utility/dashboard/dashboard.component";
import { MovingScheduleReceiptListComponent } from "../MovingScheduleReceipt/receipt_list/receipt-list.component";
import { StayingScheduleReceiptListComponent } from "../StayingScheduleReceipt/receipt_list/receipt-list.component";
import { AboutPageComponent } from "src/app/utility/footer/about-page/about-page.component";
import { PolicyPageComponent } from "src/app/utility/footer/policy/policy.component";

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
        path: "dash-board",
        component: DashboardComponent,
      },
      {
        path: "tourish-plan/list",
        component: TourishPlanListAdminComponent,
      },
      {
        path: "notification/list",
        component: NotificationListComponent,
      },
      {
        path: "tour/category/list",
        component: TourishCategoryListComponent,
      },
      {
        path: "transport/moving-contact/list",
        component: MovingContactListComponent,
      },
      {
        path: "transport/service/list",
        component: MovingScheduleListComponent,
      },
      {
        path: "resthouse/rest-house-contact/list",
        component: RestHouseContactListComponent,
      },
      {
        path: "resthouse/service/list",
        component: StayingScheduleListComponent,
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
        path: "moving/receipt/list",
        component: MovingScheduleReceiptListComponent,
      },
      {
        path: "staying/receipt/list",
        component: StayingScheduleReceiptListComponent,
      },
      {
        path: "user/list",
        component: UserListComponent,
      },
      {
        path: "account/info",
        component: AccountInfoComponent,
      },
      {
        path: "chat/list",
        component: GuestMessageConHistoryListComponent,
      },

      {
        path: "chat/display/:id",
        component: BigChatComponent,
      },
      {
        path: "chat/display",
        component: BigChatComponent,
      },
      {
        path: "about-us",
        component: AboutPageComponent,
      },
      {
        path: "policy",
        component: PolicyPageComponent,
      },

      { path: "**", pathMatch: "full", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRouter {}
