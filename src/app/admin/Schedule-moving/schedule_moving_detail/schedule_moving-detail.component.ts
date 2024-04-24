import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

import { Observable, Subscription, map } from "rxjs";

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Book } from "src/app/model/book";
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";
import { MovingScheduleParam } from "./schedule_moving-detail.component.model";

import * as MovingScheduleActions from "./schedule_moving-detail.store.action";
import { State as MovingScheduleState } from "./schedule_moving-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editMovingSchedule,
  getMovingSchedule,
  getMessage,
  getSysError,
} from "./schedule_moving-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { MovingSchedule } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./schedule_moving-detail.component.html",
  styleUrls: ["./schedule_moving-detail.component.css"],
})
export class MovingScheduleDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  movingSchedule: MovingSchedule = {
    id: "",
    branchName: "",
    vehicleType: 0,
    hotlineNumber: "",
    supportEmail: "",
    headQuarterAddress: "",
    discountFloat: 0,
    discountAmount: 0,
    description: "",
  };
  movingScheduleParam!: MovingScheduleParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  movingScheduleState!: Observable<any>;
  editMovingScheduleState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<MovingScheduleState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: MovingScheduleParam
  ) {
    this.movingScheduleState = this.store.select(getMovingSchedule);
    this.editMovingScheduleState = this.store.select(editMovingSchedule);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      name: ["", Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      driverName: ["", Validators.compose([Validators.required])],
      vehiclePlate: ["", Validators.compose([Validators.required])],
      phoneNumber: ["", Validators.compose([Validators.required])],
      singlePrice: [0],
      vehicleType: [0, Validators.compose([Validators.required])],
      transportId: ["", Validators.compose([Validators.required])],
      startingPlace: ["", Validators.compose([Validators.required])],
      headingPlace: ["", Validators.compose([Validators.required])],
      status: [null, Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
      startDate: ["", Validators.compose([Validators.required])],
      endDate: ["", Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.movingScheduleState.subscribe((state) => {
        if (state) {
          this.movingSchedule = state;

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
      this.editMovingScheduleState.subscribe((state) => {
        if (state) {
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
          this.messageService.openFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      MovingScheduleActions.getMovingSchedule({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(MovingScheduleActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingScheduleActions.resetMovingSchedule());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      branchName: this.movingSchedule.branchName ?? "",
      hotlineNumber: this.movingSchedule.hotlineNumber ?? "",
      supportEmail: this.movingSchedule.supportEmail ?? "",
      headQuarterAddress: this.movingSchedule.headQuarterAddress ?? "",
      discountFloat: this.movingSchedule.discountFloat ?? 0,
      discountAmount: this.movingSchedule.discountAmount ?? 0,
      description: this.movingSchedule.description,
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (!this.editformGroup_info.invalid) {
      const payload: MovingSchedule = {
        id: this.data.id,
        branchName: this.editformGroup_info.value.branchName,
        vehicleType: 0,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
      };

      this.store.dispatch(
        MovingScheduleActions.editMovingSchedule({
          payload: payload,
        })
      );
    } else console.log(this.editformGroup_info.invalid);
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
