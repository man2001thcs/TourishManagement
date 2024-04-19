import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";
import { RouterModule } from "@angular/router";
import { UserMainComponent } from "../main/main.component";
import { TourishDetailComponent } from "src/app/guest/tourish-detail/tourish-detail.component";
import { TourishMainComponent } from "src/app/guest/tourish-main/tourish-main.component";
import { UserAccountInfoComponent } from "../account-info/account-info.component";

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
        path: "account",
        component: UserAccountInfoComponent,
      },
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
