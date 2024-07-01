import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

import { Observable, Subscription, map } from "rxjs";

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Book } from "src/app/model/book";
import { AdminService } from "../../service/admin.service";
import { CheckDeactivate } from "../../interface/admin.check_edit";
import { MovingContactParam } from "./moving_contact-detail.component.model";

import * as MovingContactActions from "./moving_contact-detail.store.action";
import { State as MovingContactState } from "./moving_contact-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editMovingContact,
  getMovingContact,
  getMessage,
  getSysError,
} from "./moving_contact-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { MovingContact } from "src/app/model/baseModel";

@Component({
  selector: "app-moving_contact-detail",
  templateUrl: "./moving_contact-detail.component.html",
  styleUrls: ["./moving_contact-detail.component.css"],
})
export class MovingContactDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  disabled = true;

  MovingContact: MovingContact = {
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
  MovingContactParam!: MovingContactParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  MovingContactState!: Observable<any>;
  editMovingContactState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<MovingContactState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: MovingContactParam
  ) {
    this.MovingContactState = this.store.select(getMovingContact);
    this.editMovingContactState = this.store.select(editMovingContact);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      branchName: ["", Validators.compose([Validators.required])],
      hotlineNumber: ["", Validators.compose([Validators.required])],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],
      vehicleType: [0, Validators.compose([Validators.required])],

      description: "",
    });

    this.subscriptions.push(
      this.MovingContactState.subscribe((state) => {
        if (state) {
          this.MovingContact = state;

          this.editformGroup_info.controls["branchName"].setValue(
            state.branchName
          );
          this.editformGroup_info.controls["hotlineNumber"].setValue(
            state.hotlineNumber
          );
          this.editformGroup_info.controls["supportEmail"].setValue(
            state.supportEmail
          );
          this.editformGroup_info.controls["vehicleType"].setValue(
            state.vehicleType
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
      this.editMovingContactState.subscribe((state) => {
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
      MovingContactActions.getMovingContact({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(MovingContactActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(MovingContactActions.resetMovingContact());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.patchValue({
      branchName: this.MovingContact.branchName ?? "",
      hotlineNumber: this.MovingContact.hotlineNumber ?? "",
      supportEmail: this.MovingContact.supportEmail ?? "",
      headQuarterAddress: this.MovingContact.headQuarterAddress ?? "",
      discountFloat: this.MovingContact.discountFloat ?? 0,
      discountAmount: this.MovingContact.discountAmount ?? 0,
      vehicleType: this.MovingContact.vehicleType ?? 0,
      description: this.MovingContact.description,
    });
  }

  formSubmit(): void {
    
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
 
    if (!this.editformGroup_info.invalid) {
      const payload: MovingContact = {
        id: this.data.id,
        branchName: this.editformGroup_info.value.branchName,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        vehicleType: parseInt(this.editformGroup_info.value.vehicleType),
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        MovingContactActions.editMovingContact({
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
