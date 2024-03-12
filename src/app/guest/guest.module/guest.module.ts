import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatInputModule } from "@angular/material/input";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { GuestRouterModule } from "./guest.router";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
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

import {
  NgbCarouselModule,
  NgbDropdownModule,
  NgbModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbProgressbar,
  NgbProgressbarModule,
} from "@ng-bootstrap/ng-bootstrap";
import { nl2brPipe } from "src/app/utility/nl2br.pipe";
import { MatCard, MatCardModule } from "@angular/material/card";
import { HomeComponent } from "../home/home.component";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FooterComponent } from "src/app/utility/footer/footer.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { SharedModule } from "src/app/shared.module";
import { UserCreateComponent } from "../log/signIn/signIn-create.component";
import { UserCreateEffects } from "../log/signIn/signIn-create.store.effect";
import { ChatComponent } from "src/app/utility/chat/chat.component";
import { TourishPlanCardComponent } from "src/app/utility/tourish-card/tourish-card.component";
import { TourishDetailComponent } from "../tourish-detail/tourish-detail.component";

import { NgImageSliderModule } from "ng-image-slider";
import { CarouselSlider } from "angular-carousel-slider";
import { TourishMainComponent } from "../tourish-main/tourish-main.component";



@NgModule({
  declarations: [
    MainComponent,
    LoginComponent,
    HeaderComponent,
    HomeComponent,
    UserCreateComponent,
    ChatComponent,
    TourishPlanCardComponent,
    TourishDetailComponent,
    TourishMainComponent,
    nl2brPipe,
   
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    GuestRouterModule,
    MatExpansionModule,
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
    MatCardModule,
    NgbDropdownModule,
    NgImageSliderModule,
    HttpClientModule,
    ReactiveFormsModule,

    StoreModule.forFeature(LoginStoreKey, LoginReducer),
    StoreModule.forFeature(SignInStoreKey, SignInReducer),

    EffectsModule.forFeature([LoginEffects]),
    EffectsModule.forFeature([UserCreateEffects]),
  ],
  exports: [RouterModule],
})
export class GuestModule {}
