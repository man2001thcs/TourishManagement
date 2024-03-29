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
import { HomeStayParam } from "./homeStay-detail.component.model";

import * as HomeStayActions from "./homeStay-detail.store.action";
import { State as HomeStayState } from "./homeStay-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editHomeStay,
  getHomeStay,
  getMessage,
  getSysError,
} from "./homeStay-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { HomeStay } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./homeStay-detail.component.html",
  styleUrls: ["./homeStay-detail.component.css"],
})
export class HomeStayDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  homeStay: HomeStay = {
    id: "",
    placeBranch: "",
    restHouseType: 0,
    hotlineNumber: "",
    supportEmail: "",
    headQuarterAddress: "",
    discountFloat: 0,
    discountAmount: 0,
    description: "",
  };
  homeStayParam!: HomeStayParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  homeStayState!: Observable<any>;
  editHomeStayState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<HomeStayState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: HomeStayParam
  ) {
    this.homeStayState = this.store.select(getHomeStay);
    this.editHomeStayState = this.store.select(editHomeStay);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      placeBranch: ["", Validators.compose([Validators.required])],
      hotlineNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],

      description: ["", Validators.compose([Validators.required])]
    });

    this.subscriptions.push(
      this.homeStayState.subscribe((state) => {
        if (state) {
          this.homeStay = state;

          this.messageService.closeLoadingDialog();
          
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
      this.editHomeStayState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openMessageNotifyDialog(state);
          }
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

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      HomeStayActions.getHomeStay({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(HomeStayActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(HomeStayActions.resetHomeStay());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      placeBranch: this.homeStay.placeBranch ?? "",
      hotlineNumber: this.homeStay.hotlineNumber ?? "",
      supportEmail: this.homeStay.supportEmail ?? "",
      headQuarterAddress: this.homeStay.headQuarterAddress ?? "",
      discountFloat: this.homeStay.discountFloat ?? 0,
      discountAmount: this.homeStay.discountAmount ?? 0,
      description: this.homeStay.description,
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: HomeStay = {
        id: this.data.id,
        placeBranch: this.editformGroup_info.value.placeBranch,
        restHouseType: 0,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        HomeStayActions.editHomeStay({
          payload: payload,
        })
      );
    }
  }
}
