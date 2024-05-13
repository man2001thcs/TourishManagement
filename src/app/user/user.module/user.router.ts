import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { UserMainComponent } from "../main/main.component";
import { TourishDetailComponent } from "src/app/guest/tourish-detail/tourish-detail.component";
import { TourishMainComponent } from "src/app/guest/tourish-main/tourish-main.component";
import { UserAccountInfoComponent } from "../account-info/account-info.component";
import { ReceiptUserListComponent } from "../Receipt/receipt_list/receipt-list.component";
import { NotFoundComponent } from "src/app/utility/not-found-page/404.component";
import { TourishSearchComponent } from "src/app/guest/tourish-search/tourish-search.component";
import { ScheduleSearchComponent } from "src/app/guest/schedule-search/schedule-search.component";
import { ScheduleDetailComponent } from "src/app/guest/schedule-detail/schedule-detail.component";
import { MovingReceiptUserListComponent } from "../MovingReceipt/receipt_list/receipt-list.component";
import { StayingReceiptUserListComponent } from "../StayingReceipt/receipt_list/receipt-list.component";

const routes: Routes = [
  {
    path: "",
    component: UserMainComponent,
    children: [
      {
        path: "tour/:id/detail",
        component: TourishDetailComponent,
      },
      {
        path: "main-page",
        component: TourishMainComponent,
      },
      {
        path: "account/info",
        component: UserAccountInfoComponent,
      },
      {
        path: "receipt/list",
        component: ReceiptUserListComponent,
      },
      {
        path: "moving/receipt/list",
        component: MovingReceiptUserListComponent,
      },
      {
        path: "staying/receipt/list",
        component: StayingReceiptUserListComponent,
      },
      {
        path: "search-page",
        component: TourishSearchComponent,
      },
      {
        path: "service-search-page",
        component: ScheduleSearchComponent,
      },
      {
        path: "service/:id/detail",
        component: ScheduleDetailComponent,
      },
      { path: "**", pathMatch: "full", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class UserRouterModule {}
