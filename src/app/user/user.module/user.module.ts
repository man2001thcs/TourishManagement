import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { UserMainComponent } from "./../main/main.component";
import { HeaderUserComponent } from "../header/header.user.component";
import { SharedModule } from "src/app/shared.module";
import { UserRouterModule } from "./user.router";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    UserMainComponent,
    HeaderUserComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserRouterModule,
    SharedModule,
    
  ],
  exports: [RouterModule]
})
export class UserModule {}
