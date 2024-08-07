import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes } from "@angular/router";
import { MainComponent } from "../main/main.component";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { UserCreateComponent } from "../log/signIn/signIn-create.component";
import { LoginComponent } from "../log/login/login.component";
import { TourishPlanCardComponent } from "src/app/utility/tourish-card/tourish-card.component";
import { TourishDetailComponent } from "../tourish-detail/tourish-detail.component";
import { TourishMainComponent } from "../tourish-main/tourish-main.component";
import { ReclaimUserComponent } from "../log/reclaim/reclaim.component";
import { TourishSearchComponent } from "../tourish-search/tourish-search.component";
import { ScheduleSearchComponent } from "../schedule-search/schedule-search.component";
import { ScheduleDetailComponent } from "../schedule-detail/schedule-detail.component";
import { NotFoundComponent } from "src/app/utility/not-found-page/404.component";
import { AboutPageComponent } from "src/app/utility/footer/about-page/about-page.component";
import { PolicyPageComponent } from "src/app/utility/footer/policy/policy.component";

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
      {
        path: "service-search-page",
        component: ScheduleSearchComponent,
      },
      {
        path: "service/:id/detail",
        component: ScheduleDetailComponent,
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
export class GuestRouterModule {}
