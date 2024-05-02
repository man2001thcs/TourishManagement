import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

import { Observable, Subscription, map } from "rxjs";

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Book } from "src/app/model/book";
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";
import { StayingScheduleParam } from "./schedule_staying-detail.component.model";

import * as StayingScheduleActions from "./schedule_staying-detail.store.action";
import { State as StayingScheduleState } from "./schedule_staying-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editStayingSchedule,
  getStayingSchedule,
  getMessage,
  getSysError,
} from "./schedule_staying-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { StayingSchedule } from "src/app/model/baseModel";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "app-book-detail",
  templateUrl: "./schedule_staying-detail.component.html",
  styleUrls: ["./schedule_staying-detail.component.css"],
})
export class StayingScheduleDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  stayingSchedule: StayingSchedule = {
    id: "",
    tourishPlanId: "",
    name: "",
    placeName: "",
    address: "",
    supportNumber: "",
    restHouseType: 0,
    restHouseBranchId: "",
    singlePrice: 0,
    status: 0,
    description: "",
  };
  
  stayingScheduleParam!: StayingScheduleParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  stayingScheduleState!: Observable<any>;
  editStayingScheduleState!: Observable<any>;
  subscriptions: Subscription[] = [];

  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;
  color: ThemePalette = "primary";
  editorContent: any;
  vehicleType = 0;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<StayingScheduleState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: StayingScheduleParam
  ) {
    this.stayingScheduleState = this.store.select(getStayingSchedule);
    this.editStayingScheduleState = this.store.select(editStayingSchedule);
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
      this.stayingScheduleState.subscribe((state) => {
        if (state) {
          this.stayingSchedule = state;

          this.editformGroup_info.controls["name"].setValue(state.name ?? "");
          this.editformGroup_info.controls["branchName"].setValue(
            state.branchName ?? ""
          );
          this.editformGroup_info.controls["driverName"].setValue(
            state.driverName ?? ""
          );
          this.editformGroup_info.controls["vehiclePlate"].setValue(
            state.vehiclePlate ?? ""
          );
          this.editformGroup_info.controls["phoneNumber"].setValue(
            state.phoneNumber ?? ""
          );
          this.editformGroup_info.controls["vehicleType"].setValue(
            state.vehicleType ?? 0
          );
          this.editformGroup_info.controls["transportId"].setValue(
            state.transportId ?? ""
          );
          this.editformGroup_info.controls["startingPlace"].setValue(
            state.startingPlace ?? ""
          );
          this.editformGroup_info.controls["singlePrice"].setValue(
            state.singlePrice ?? ""
          );
          this.editformGroup_info.controls["headingPlace"].setValue(
            state.headingPlace ?? ""
          );
          this.editformGroup_info.controls["status"].setValue(
            state.status ?? 0
          );
          this.editformGroup_info.controls["description"].setValue(
            state.description ?? ""
          );
          this.editformGroup_info.controls["startDate"].setValue(
            state.startDate ?? null
          );
          this.editformGroup_info.controls["endDate"].setValue(
            state.endDate ?? null
          );

          this.vehicleType = state.vehicleType;
        }
      })
    );

    this.subscriptions.push(
      this.editStayingScheduleState.subscribe((state) => {
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
          this.messageService.openFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      StayingScheduleActions.getStayingSchedule({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(StayingScheduleActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(StayingScheduleActions.resetStayingSchedule());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      id: this.stayingSchedule.id ?? "",
      tourishPlanId: this.stayingSchedule.tourishPlanId ?? "",
      name: this.stayingSchedule.name ?? "",
      branchName: this.stayingSchedule.branchName ?? "",
      driverName: this.stayingSchedule.driverName ?? "",
      vehiclePlate: this.stayingSchedule.vehiclePlate ?? "",
      phoneNumber: this.stayingSchedule.phoneNumber ?? "",
      singlePrice: this.stayingSchedule.singlePrice ?? 0,
      vehicleType: this.stayingSchedule.vehicleType ?? 0,
      transportId: this.stayingSchedule.transportId ?? "",
      startingPlace: this.stayingSchedule.startingPlace ?? "",
      headingPlace: this.stayingSchedule.headingPlace ?? "",
      status: this.stayingSchedule.status ?? 0,
      description: this.stayingSchedule.description ?? "",
      startDate: this.stayingSchedule.startDate ?? null,
      endDate: this.stayingSchedule.endDate ?? null,
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    this.editformGroup_info.controls["description"].setValue(
      this.editorContent
    );
    if (!this.editformGroup_info.invalid) {
      const payload: StayingSchedule = {
        id: this.editformGroup_info.value.id,
        name: this.editformGroup_info.value.name,
        branchName: this.editformGroup_info.value.branchName,
        driverName: this.editformGroup_info.value.driverName,
        vehiclePlate: this.editformGroup_info.value.vehiclePlate,
        phoneNumber: this.editformGroup_info.value.phoneNumber,
        singlePrice: parseInt(this.editformGroup_info.value.singlePrice),
        vehicleType: this.editformGroup_info.value.vehicleType,
        transportId: this.editformGroup_info.value.transportId,
        startingPlace: this.editformGroup_info.value.startingPlace,
        headingPlace: this.editformGroup_info.value.headingPlace,
        status: this.editformGroup_info.value.status,
        description: this.editformGroup_info.value.description,
        startDate: this.editformGroup_info.value.startDate,
        endDate: this.editformGroup_info.value.endDate,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        StayingScheduleActions.editStayingSchedule({
          payload: payload,
        })
      );
    } else console.log(this.editformGroup_info.invalid);
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectSchedule($event: string[]) {
    this.editformGroup_info.controls["transportId"].setValue($event[0]);
  }

  changeStatusExist($event: any) {
    this.editformGroup_info.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

  getTinyMceResult($event: any) {
    this.editorContent = $event.data;
  }

  changeType($event: any) {
    this.vehicleType = parseInt($event.target.value);
  }
}
