import { Response } from "../../../model/response";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, Subscription, map } from "rxjs";
import {
  ConfirmDialogComponent,
  DialogData,
} from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { NotifyDialogComponent } from "src/app/utility/notification_admin/notify-dialog.component";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Book } from "src/app/model/book";
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";
import { RestaurantParam } from "./restaurant-detail.component.model";

import * as RestaurantActions from "./restaurant-detail.store.action";
import { State as RestaurantState } from "./restaurant-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editRestaurant,
  getRestaurant,
  getMessage,
  getSysError,
} from "./restaurant-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Restaurant } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./restaurant-detail.component.html",
  styleUrls: ["./restaurant-detail.component.css"],
})
export class RestaurantDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  disabled = true;
  isSubmitted = false;
  restaurant: Restaurant = {
    id: "",
    placeBranch: "",
    hotlineNumber: "",
    supportEmail: "",
    headQuarterAddress: "",
    discountFloat: 0,
    discountAmount: 0,
    description: "",
  };
  restaurantParam!: RestaurantParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  restaurantState!: Observable<any>;
  editRestaurantState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<RestaurantState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: RestaurantParam
  ) {
    this.restaurantState = this.store.select(getRestaurant);
    this.editRestaurantState = this.store.select(editRestaurant);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      placeBranch: ["", Validators.compose([Validators.required])],
      hotlineNumber: [
        "",
        Validators.compose([Validators.required]),
      ],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],

      description: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.restaurantState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          
          this.restaurant = state;

          this.editformGroup_info.controls["placeBranch"].setValue(
            state.placeBranch
          );
          this.editformGroup_info.controls["hotlineNumber"].setValue(
            state.hotlineNumber
          );
          this.editformGroup_info.controls["supportEmail"].setValue(
            state.supportEmail
          );
          this.editformGroup_info.controls["headQuarterAddress"].setValue(
            state.headQuarterAddress
          );

          this.editformGroup_info.controls["discountFloat"].setValue(
            state.discountFloat
          );

          this.editformGroup_info.controls["discountAmount"].setValue(
            state.discountAmount
          );

          this.editformGroup_info.controls["description"].setValue(
            state.description
          );
        }
      })
    );

    this.subscriptions.push(
      this.editRestaurantState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state.code);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      RestaurantActions.getRestaurant({
        payload: {
          id: this.data.id,
        },
      })
    );
    this.messageService.openLoadingDialog();

    this.store.dispatch(RestaurantActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(RestaurantActions.resetRestaurant());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.patchValue({
      placeBranch: this.restaurant.placeBranch ?? "",
      hotlineNumber: this.restaurant.hotlineNumber ?? "",
      supportEmail: this.restaurant.supportEmail ?? "",
      headQuarterAddress: this.restaurant.headQuarterAddress ?? "",
      discountFloat: this.restaurant.discountFloat ?? 0,
      discountAmount: this.restaurant.discountAmount ?? 0,
      description: this.restaurant.description,
    });
  }

  formSubmit(): void {
    
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: Restaurant = {
        id: this.data.id,
        placeBranch: this.editformGroup_info.value.placeBranch,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        RestaurantActions.editRestaurant({
          payload: payload,
        })
      );
    } else {
      this.messageService.openFailNotifyDialog(
        "Lỗi giá trị đầu vào. Vui lòng kiểm tra lại"
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
