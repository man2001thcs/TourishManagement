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

import { storeKey as MovingReceiptUserListStoreKey } from "../MovingReceipt/receipt_list/receipt-list.store.action";
import { reducer as MovingReceiptUserListReducer } from "../MovingReceipt/receipt_list/receipt-list.store.reducer";
import { storeKey as MovingReceiptUserDetailStoreKey } from "../MovingReceipt/receipt_detail/receipt-detail.store.action";
import { reducer as MovingReceiptUserDetailReducer } from "../MovingReceipt/receipt_detail/receipt-detail.store.reducer";

import { storeKey as StayingReceiptUserListStoreKey } from "../StayingReceipt/receipt_list/receipt-list.store.action";
import { reducer as StayingReceiptUserListReducer } from "../StayingReceipt/receipt_list/receipt-list.store.reducer";
import { storeKey as StayingReceiptUserDetailStoreKey } from "../StayingReceipt/receipt_detail/receipt-detail.store.action";
import { reducer as StayingReceiptUserDetailReducer } from "../StayingReceipt/receipt_detail/receipt-detail.store.reducer";

import { ReceiptEffects } from "../Receipt/receipt_detail/receipt-detail.store.effect";
import { ReceiptListEffects } from "../Receipt/receipt_list/receipt-list.store.effect";

import { MovingReceiptEffects } from "../MovingReceipt/receipt_detail/receipt-detail.store.effect";
import { MovingReceiptListEffects } from "../MovingReceipt/receipt_list/receipt-list.store.effect";

import { StayingReceiptEffects } from "../StayingReceipt/receipt_detail/receipt-detail.store.effect";
import { StayingReceiptListEffects } from "../StayingReceipt/receipt_list/receipt-list.store.effect";
import { StayingReceiptUserListComponent } from "../StayingReceipt/receipt_list/receipt-list.component";
import { StayingReceiptUserDetailComponent } from "../StayingReceipt/receipt_detail/receipt-detail.component";
import { MovingReceiptUserListComponent } from "../MovingReceipt/receipt_list/receipt-list.component";
import { MovingReceiptUserDetailComponent } from "../MovingReceipt/receipt_detail/receipt-detail.component";

@NgModule({
  declarations: [
    UserMainComponent,
    HeaderUserComponent,
    UserAccountInfoComponent,
    ReceiptUserListComponent,
    ReceiptUserDetailComponent,

    MovingReceiptUserListComponent,
    MovingReceiptUserDetailComponent,
    
    StayingReceiptUserListComponent,
    StayingReceiptUserDetailComponent, 
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRouterModule,
    SharedModule,
    
    EffectsModule.forFeature([AccountEffects]),
    EffectsModule.forFeature([ReceiptEffects]),
    EffectsModule.forFeature([ReceiptListEffects]),
    EffectsModule.forFeature([MovingReceiptEffects]),
    EffectsModule.forFeature([MovingReceiptListEffects]),
    EffectsModule.forFeature([StayingReceiptEffects]),
    EffectsModule.forFeature([StayingReceiptListEffects]),

    StoreModule.forFeature(AccountInfoStoreKey, AccountInfoReducer),
    
    StoreModule.forFeature(ReceiptUserDetailStoreKey, ReceiptUserDetailReducer),
    StoreModule.forFeature(ReceiptUserListStoreKey, ReceiptUserListReducer),

    StoreModule.forFeature(MovingReceiptUserDetailStoreKey, MovingReceiptUserDetailReducer),
    StoreModule.forFeature(MovingReceiptUserListStoreKey, MovingReceiptUserListReducer),

    StoreModule.forFeature(StayingReceiptUserDetailStoreKey, StayingReceiptUserDetailReducer),
    StoreModule.forFeature(StayingReceiptUserListStoreKey, StayingReceiptUserListReducer),
  ],
  exports: [RouterModule]
})
export class UserModule {}
