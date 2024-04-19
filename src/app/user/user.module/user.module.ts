import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserMainComponent } from "./../main/main.component";
import { HeaderUserComponent } from "../header/header.user.component";
import { SharedModule } from "src/app/shared.module";
import { UserRouterModule } from "./user.router";
import { CommonModule } from "@angular/common";
import { UserAccountInfoComponent } from "../account-info/account-info.component";
import { EffectsModule } from "@ngrx/effects";
import { AccountEffects } from "../account-info/account-info.store.effect";
import { StoreModule } from "@ngrx/store";
import { storeKey as AccountInfoStoreKey } from "../account-info/account-info.store.action";
import { reducer as AccountInfoReducer } from "../account-info/account-info.store.reducer";

@NgModule({
  declarations: [
    UserMainComponent,
    HeaderUserComponent,
    UserAccountInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRouterModule,
    SharedModule,
    
    EffectsModule.forFeature([AccountEffects]),
    StoreModule.forFeature(AccountInfoStoreKey, AccountInfoReducer),
  ],
  exports: [RouterModule]
})
export class UserModule {}
