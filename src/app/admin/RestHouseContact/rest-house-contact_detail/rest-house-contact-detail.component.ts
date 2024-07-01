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
import { RestHouseContactParam } from "./rest-house-contact-detail.component.model";

import * as RestHouseContactActions from "./rest-house-contact-detail.store.action";
import { State as RestHouseContactState } from "./rest-house-contact-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editRestHouseContact,
  getRestHouseContact,
  getMessage,
  getSysError,
} from "./rest-house-contact-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { RestHouseContact } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./rest-house-contact-detail.component.html",
  styleUrls: ["./rest-house-contact-detail.component.css"],
})
export class RestHouseContactDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  disabled = true;

  RestHouseContact: RestHouseContact = {
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
  RestHouseContactParam!: RestHouseContactParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  RestHouseContactState!: Observable<any>;
  editRestHouseContactState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<RestHouseContactState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: RestHouseContactParam
  ) {
    this.RestHouseContactState = this.store.select(getRestHouseContact);
    this.editRestHouseContactState = this.store.select(editRestHouseContact);
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
      restHouseType: [0, Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.RestHouseContactState.subscribe((state) => {
        if (state) {
          this.RestHouseContact = state;

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
          this.editformGroup_info.controls["restHouseType"].setValue(
            state.restHouseType
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
      this.editRestHouseContactState.subscribe((state) => {
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
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      RestHouseContactActions.getRestHouseContact({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(RestHouseContactActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(RestHouseContactActions.resetRestHouseContact());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.patchValue({
      placeBranch: this.RestHouseContact.placeBranch ?? "",
      hotlineNumber: this.RestHouseContact.hotlineNumber ?? "",
      supportEmail: this.RestHouseContact.supportEmail ?? "",
      headQuarterAddress: this.RestHouseContact.headQuarterAddress ?? "",
      discountFloat: this.RestHouseContact.discountFloat ?? 0,
      discountAmount: this.RestHouseContact.discountAmount ?? 0,
      description: this.RestHouseContact.description,
      restHouseType: this.RestHouseContact.restHouseType,
    });
  }

  formSubmit(): void {
    
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: RestHouseContact = {
        id: this.data.id,
        placeBranch: this.editformGroup_info.value.placeBranch,
        hotlineNumber: this.editformGroup_info.value.hotlineNumber,
        supportEmail: this.editformGroup_info.value.supportEmail,
        headQuarterAddress: this.editformGroup_info.value.headQuarterAddress,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        description: this.editformGroup_info.value.description,
        restHouseType: parseInt(this.editformGroup_info.value.restHouseType),
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        RestHouseContactActions.editRestHouseContact({
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
