import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import {  ReactiveFormsModule } from "@angular/forms";
import { GuestRouterModule } from "./guest.router";
import { StoreModule } from "@ngrx/store";
import { MainComponent } from "./../main/main.component";
import { HeaderComponent } from "../header/header.component";
import { LoginComponent } from "../log/login/login.component";
import { LoginEffects } from "../log/login/login.store.effect";
import { EffectsModule } from "@ngrx/effects";
import { storeKey as LoginStoreKey } from "../log/login/login.store.action";
import { reducer as LoginReducer } from "../log/login/login.store.reducer";
import { storeKey as SignInStoreKey } from "../log/signIn/signIn-create.store.action";
import { reducer as SignInReducer } from "../log/signIn/signIn-create.store.reducer";

import { storeKey as ReclaimUserStoreKey } from "../log/reclaim/reclaim.store.action";
import { reducer as ReclaimUserReducer } from "../log//reclaim/reclaim.store.reducer";

import {
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import { nl2brPipe } from "src/app/utility/nl2br.pipe";
import { HomeComponent } from "../home/home.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { SharedModule } from "src/app/shared.module";
import { UserCreateComponent } from "../log/signIn/signIn-create.component";
import { UserCreateEffects } from "../log/signIn/signIn-create.store.effect";
import { ChatComponent } from "src/app/utility/chat/chat.component";
import { TourishPlanCardComponent } from "src/app/utility/tourish-card/tourish-card.component";
import { TourishDetailComponent } from "../tourish-detail/tourish-detail.component";

import { NgImageSliderModule } from "ng-image-slider";
import { TourishMainComponent } from "../tourish-main/tourish-main.component";
import { TourishPackComponent } from "src/app/utility/tourish-pack/tourish-pack.component";
import {
  EditorModule,
  TINYMCE_SCRIPT_SRC,
} from "@tinymce/tinymce-angular";
import { ReclaimUserEffects } from "../log/reclaim/reclaim.store.effect";
import { ReclaimUserComponent } from "../log/reclaim/reclaim.component";
import { ScheduleSearchComponent } from "../schedule-search/schedule-search.component";

@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    UserCreateComponent,
    ReclaimUserComponent,
    nl2brPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    GuestRouterModule,
    MatExpansionModule,
    NgbDropdownModule,
    NgImageSliderModule,
    HttpClientModule,
    ReactiveFormsModule,
    EditorModule,

    StoreModule.forFeature(LoginStoreKey, LoginReducer),
    StoreModule.forFeature(SignInStoreKey, SignInReducer),
    StoreModule.forFeature(ReclaimUserStoreKey, ReclaimUserReducer),

    EffectsModule.forFeature([LoginEffects]),
    EffectsModule.forFeature([UserCreateEffects]),
    EffectsModule.forFeature([ReclaimUserEffects]),
  ],
  exports: [
    RouterModule,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    UserCreateComponent,
    ChatComponent,
    TourishPlanCardComponent,
    TourishDetailComponent,
    TourishMainComponent,
    TourishPackComponent,
    nl2brPipe,
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
})
export class GuestModule {}
