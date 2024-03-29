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
import { PassengerCarParam } from "./passenger_car-create.component.model";
import * as passengerCarActions from "./passenger_car-create.store.action";
import { State as passenger_carState } from "./passenger_car-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createPassengerCar,
  getMessage,
  getSysError,
} from "./passenger_car-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { PassengerCar } from "src/app/model/baseModel";

@Component({
  selector: "app-book-create",
  templateUrl: "./passenger_car-create.component.html",
  styleUrls: ["./passenger_car-create.component.css"],
})
export class PassengerCarCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  passengerCarParam!: PassengerCarParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  passengerCarState!: Observable<any>;
  createPassengerCarState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<passenger_carState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: PassengerCarParam
  ) {
    this.createPassengerCarState = this.store.select(createPassengerCar);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createPassengerCarState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);
        }
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(passengerCarActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
      branchName: ["", Validators.compose([Validators.required])],
      hotlineNumber: ["", Validators.compose([Validators.required])],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(passengerCarActions.resetPassengerCar());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.setValue({
      branchName: "",
      hotlineNumber: "",
      supportEmail: "",
      headQuarterAddress: "",
      discountFloat: 0,
      discountAmount: 0,
      description: "",
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    if (this.createformGroup_info.valid) {
      const payload: PassengerCar = {
        branchName: this.createformGroup_info.value.branchName,
        vehicleType: 0,
        hotlineNumber: this.createformGroup_info.value.hotlineNumber,
        supportEmail: this.createformGroup_info.value.supportEmail,
        headQuarterAddress: this.createformGroup_info.value.headQuarterAddress,
        discountFloat: this.createformGroup_info.value.discountFloat,
        discountAmount: this.createformGroup_info.value.discountAmount,
        description: this.createformGroup_info.value.description,
      };

      this.store.dispatch(
        passengerCarActions.createPassengerCar({
          payload: payload,
        })
      );
    }
  }
}
