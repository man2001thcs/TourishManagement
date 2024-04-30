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
import { ReceiptUserListComponent } from "../Receipt/receipt_list/receipt-list.component";
import { ReceiptUserDetailComponent } from "../Receipt/receipt_detail/receipt-detail.component";

import { storeKey as ReceiptUserListStoreKey } from "../Receipt/receipt_list/receipt-list.store.action";
import { reducer as ReceiptUserListReducer } from "../Receipt/receipt_list/receipt-list.store.reducer";

import { storeKey as ReceiptUserDetailStoreKey } from "../Receipt/receipt_detail/receipt-detail.store.action";
import { reducer as ReceiptUserDetailReducer } from "../Receipt/receipt_detail/receipt-detail.store.reducer";
import { ReceiptEffects } from "../Receipt/receipt_detail/receipt-detail.store.effect";
import { ReceiptListEffects } from "../Receipt/receipt_list/receipt-list.store.effect";

@NgModule({
  declarations: [
    UserMainComponent,
    HeaderUserComponent,
    UserAccountInfoComponent,
    ReceiptUserListComponent,
    ReceiptUserDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRouterModule,
    SharedModule,
    
    EffectsModule.forFeature([AccountEffects]),
    EffectsModule.forFeature([ReceiptEffects]),
    EffectsModule.forFeature([ReceiptListEffects]),

    StoreModule.forFeature(AccountInfoStoreKey, AccountInfoReducer),
    StoreModule.forFeature(ReceiptUserDetailStoreKey, ReceiptUserDetailReducer),
    StoreModule.forFeature(ReceiptUserListStoreKey, ReceiptUserListReducer),
  ],
  exports: [RouterModule]
})
export class UserModule {}
