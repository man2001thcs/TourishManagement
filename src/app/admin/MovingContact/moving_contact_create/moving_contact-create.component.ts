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
import { MovingContactParam } from "./moving_contact-create.component.model";
import * as MovingContactActions from "./moving_contact-create.store.action";
import { State as moving_contactState } from "./moving_contact-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createMovingContact,
  getMessage,
  getSysError,
} from "./moving_contact-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { MovingContact } from "src/app/model/baseModel";

@Component({
  selector: "app-moving_contact-create",
  templateUrl: "./moving_contact-create.component.html",
  styleUrls: ["./moving_contact-create.component.css"],
})
export class MovingContactCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  MovingContactParam!: MovingContactParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  MovingContactState!: Observable<any>;
  createMovingContactState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<moving_contactState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: MovingContactParam
  ) {
    this.createMovingContactState = this.store.select(createMovingContact);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createMovingContactState.subscribe((state) => {
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

    this.store.dispatch(MovingContactActions.initial());

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
      vehicleType: [0, Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingContactActions.resetMovingContact());

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
      const payload: MovingContact = {
        branchName: this.createformGroup_info.value.branchName,
        hotlineNumber: this.createformGroup_info.value.hotlineNumber,
        supportEmail: this.createformGroup_info.value.supportEmail,
        headQuarterAddress: this.createformGroup_info.value.headQuarterAddress,
        discountFloat: this.createformGroup_info.value.discountFloat,
        discountAmount: this.createformGroup_info.value.discountAmount,
        description: this.createformGroup_info.value.description,
        vehicleType: this.createformGroup_info.value.vehicleType ?? 0,
      };

      this.store.dispatch(
        MovingContactActions.createMovingContact({
          payload: payload,
        })
      );
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
