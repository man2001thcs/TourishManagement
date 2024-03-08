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
import { AirPlaneParam } from "./air_plane-detail.component.model";

import * as AirPlaneActions from "./air_plane-detail.store.action";
import { State as AirPlaneState } from "./air_plane-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editAirPlane,
  getAirPlane,
  getMessage,
  getSysError,
} from "./air_plane-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { AirPlane } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./air_plane-detail.component.html",
  styleUrls: ["./air_plane-detail.component.css"],
})
export class AirPlaneDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  passengerCar: AirPlane = {
    id: "",
    branchName: "",
    hotlineNumber: "",
    supportEmail: "",
    headQuarterAddress: "",
    discountFloat: 0,
    discountAmount: 0,
    description: "",
  };
  passengerCarParam!: AirPlaneParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  passengerCarState!: Observable<any>;
  editAirPlaneState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<AirPlaneState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: AirPlaneParam
  ) {
    this.passengerCarState = this.store.select(getAirPlane);
    this.editAirPlaneState = this.store.select(editAirPlane);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      hotlineNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],

      description: "",
    });

    this.subscriptions.push(
      this.passengerCarState.subscribe((state) => {
        if (state) {
          this.passengerCar = state;
          this.messageService.closeLoadingDialog();

          this.editformGroup_info.controls["branchName"].setValue(
            state.branchName
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
      this.editAirPlaneState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state !== "" && state !== null) {
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state);
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
      AirPlaneActions.getAirPlane({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(AirPlaneActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(AirPlaneActions.resetAirPlane());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      branchName: this.passengerCar.branchName ?? "",
      hotlineNumber: this.passengerCar.hotlineNumber ?? "",
      supportEmail: this.passengerCar.supportEmail ?? "",
      headQuarterAddress: this.passengerCar.headQuarterAddress ?? "",
      discountFloat: this.passengerCar.discountFloat ?? 0,
      discountAmount: this.passengerCar.discountAmount ?? 0,
      description: this.passengerCar.description,
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: AirPlane = {
        id: this.data.id,
        branchName: this.editformGroup_info.value.branchName,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
      };

      this.store.dispatch(
        AirPlaneActions.editAirPlane({
          payload: payload,
        })
      );

      this.messageService.openLoadingDialog();
    } else console.log(this.editformGroup_info.invalid);
  }
}
