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
import { MovingScheduleParam } from "./schedule_moving-create.component.model";
import * as passengerCarActions from "./schedule_moving-create.store.action";
import { State as schedule_movingState } from "./schedule_moving-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createMovingSchedule,
  getMessage,
  getSysError,
} from "./schedule_moving-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { MovingSchedule } from "src/app/model/baseModel";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: "app-book-create",
  templateUrl: "./schedule_moving-create.component.html",
  styleUrls: ["./schedule_moving-create.component.css"],
})
export class MovingScheduleCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  passengerCarParam!: MovingScheduleParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  passengerCarState!: Observable<any>;
  createMovingScheduleState!: Observable<any>;
  subscriptions: Subscription[] = [];

  showSpinners = true;
  showSeconds = false;
  touchUi = false;
  enableMeridian = false;
  color: ThemePalette = "primary";

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<schedule_movingState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: MovingScheduleParam
  ) {
    this.createMovingScheduleState = this.store.select(createMovingSchedule);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createMovingScheduleState.subscribe((state) => {
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
      this.errorSystemState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openFailNotifyDialog(state.message);
        }
      })
    );

    this.store.dispatch(passengerCarActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
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
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(passengerCarActions.resetMovingSchedule());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.setValue({
      name: "",
      branchName: "",
      driverName: "",
      vehiclePlate: "",
      phoneNumber: "",
      singlePrice: null,
      vehicleType: null,
      transportId: "",
      startingPlace: "",
      headingPlace: "",
      status: null,
      description: "",
      startDate: null,
      endDate: null,
      createDate: null,
      updateDate: null,
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    if (this.createformGroup_info.valid) {
      const payload: MovingSchedule = {
        name: this.createformGroup_info.value.name,
        branchName: this.createformGroup_info.value.branchName,
        driverName: this.createformGroup_info.value.driverName,
        vehiclePlate: this.createformGroup_info.value.vehiclePlate,
        phoneNumber: this.createformGroup_info.value.phoneNumber,
        singlePrice: this.createformGroup_info.value.singlePrice,
        vehicleType: this.createformGroup_info.value.vehicleType,
        transportId: this.createformGroup_info.value.transportId,
        startingPlace: this.createformGroup_info.value.startingPlace,
        headingPlace: this.createformGroup_info.value.headingPlace,
        status: this.createformGroup_info.value.status,
        description: this.createformGroup_info.value.description,
        startDate: this.createformGroup_info.value.startDate,
        endDate: this.createformGroup_info.value.endDate,
      };

      this.store.dispatch(
        // Assuming you're using NgRx store, replace passengerCarActions.createMovingSchedule with appropriate action
        // Also, make sure you import MovingSchedule and store accordingly
        passengerCarActions.createMovingSchedule({
          payload: payload,
        })
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  selectSchedule($event: string[]){
    this.createformGroup_info.controls["transportId"].setValue(
      $event[0]
    );
  }

  changeStatusExist($event: any) {
    this.createformGroup_info.controls["status"].setValue(
      parseInt($event.target.value)
    );
  }

}
