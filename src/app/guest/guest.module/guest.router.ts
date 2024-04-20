import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";
import { MainComponent } from "../main/main.component";
import { RouterModule } from "@angular/router";

import { SearchResolver } from "../resolver/search.resolver";
import { HomeComponent } from "../home/home.component";
import { UserCreateComponent } from "../log/signIn/signIn-create.component";
import { LoginComponent } from "../log/login/login.component";
import { ChatComponent } from "src/app/utility/chat/chat.component";
import { TourishPlanCardComponent } from "src/app/utility/tourish-card/tourish-card.component";
import { TourishDetailComponent } from "../tourish-detail/tourish-detail.component";
import { TourishMainComponent } from "../tourish-main/tourish-main.component";
import { ReclaimUserComponent } from "../log/reclaim/reclaim.component";
import { TourishSearchComponent } from "../tourish-search/tourish-search.component";

const routes: Routes = [
  {
    path: "guest",
    component: MainComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "signIn",
        component: UserCreateComponent,
      },
      {
        path: "reclaim",
        component: ReclaimUserComponent,
      },
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "test",
        component: TourishPlanCardComponent,
      },
      {
        path: "tour/:id/detail",
        component: TourishDetailComponent,
      },
      {
        path: "main-page",
        component: TourishMainComponent,
      },
      {
        path: "search-page",
        component: TourishSearchComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GuestRouterModule {}
