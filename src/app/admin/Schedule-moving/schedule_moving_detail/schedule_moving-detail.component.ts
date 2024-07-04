import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AdminService } from "../../service/admin.service";
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
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "app-book-detail",
  templateUrl: "./schedule_moving-detail.component.html",
  styleUrls: ["./schedule_moving-detail.component.css"],
})
export class MovingScheduleDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  disabled = true;

  movingSchedule: MovingSchedule = {
    id: "",
    name: "",
    branchName: "",
    driverName: "",
    vehiclePlate: "",
    transportId: "",
    description: "",
    vehicleType: 0,
    phoneNumber: "",
    singlePrice: 0,
    headingPlace: "",
    startingPlace: "",
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
    });

    this.subscriptions.push(
      this.movingScheduleState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.movingSchedule = state;

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

          this.vehicleType = state.vehicleType;
        }
      })
    );

    this.subscriptions.push(
      this.editMovingScheduleState.subscribe((state) => {
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
      MovingScheduleActions.getMovingSchedule({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.messageService.openLoadingDialog();

    this.store.dispatch(MovingScheduleActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(MovingScheduleActions.resetMovingSchedule());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.patchValue({
      id: this.movingSchedule.id ?? "",
      tourishPlanId: this.movingSchedule.tourishPlanId ?? "",
      name: this.movingSchedule.name ?? "",
      branchName: this.movingSchedule.branchName ?? "",
      driverName: this.movingSchedule.driverName ?? "",
      vehiclePlate: this.movingSchedule.vehiclePlate ?? "",
      phoneNumber: this.movingSchedule.phoneNumber ?? "",
      singlePrice: this.movingSchedule.singlePrice ?? 0,
      vehicleType: this.movingSchedule.vehicleType ?? 0,
      transportId: this.movingSchedule.transportId ?? "",
      startingPlace: this.movingSchedule.startingPlace ?? "",
      headingPlace: this.movingSchedule.headingPlace ?? "",
      description: this.movingSchedule.description ?? "",
    });
  }

  formSubmit(): void {
    
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    this.editformGroup_info.controls["description"].setValue(
      this.editorContent
    );
    if (!this.editformGroup_info.invalid) {
      const payload: MovingSchedule = {
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
        description: this.editformGroup_info.value.description,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        MovingScheduleActions.editMovingSchedule({
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
