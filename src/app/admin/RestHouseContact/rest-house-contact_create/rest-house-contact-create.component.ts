import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, map } from "rxjs";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { RestHouseContactParam } from "./rest-house-contact-create.component.model";
import * as RestHouseContactActions from "./rest-house-contact-create.store.action";
import { State as passenger_carState } from "./rest-house-contact-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createRestHouseContact,
  getMessage,
  getSysError,
} from "./rest-house-contact-create.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { RestHouseContact } from "src/app/model/baseModel";

@Component({
  selector: "app-book-create",
  templateUrl: "./rest-house-contact-create.component.html",
  styleUrls: ["./rest-house-contact-create.component.css"],
})
export class RestHouseContactCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  RestHouseContactParam!: RestHouseContactParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  RestHouseContactState!: Observable<any>;
  createRestHouseContactState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<passenger_carState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: RestHouseContactParam
  ) {
    this.createRestHouseContactState = this.store.select(createRestHouseContact);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createRestHouseContactState.subscribe((state) => {
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
            this.messageService.closeLoadingDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.store.dispatch(RestHouseContactActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
      placeBranch: ["", Validators.compose([Validators.required])],
      hotlineNumber: ["", Validators.compose([Validators.required])],
      supportEmail: ["", Validators.compose([Validators.required])],
      headQuarterAddress: ["", Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
      restHouseType: [0, Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(RestHouseContactActions.resetRestHouseContact());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.patchValue({
      placeBranch: "",
      hotlineNumber: "",
      supportEmail: "",
      headQuarterAddress: "",
      discountFloat: 0,
      discountAmount: 0,
      description: "",
      restHouseType: 0
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    if (this.createformGroup_info.valid) {
      const payload: RestHouseContact = {
        placeBranch: this.createformGroup_info.value.placeBranch,
        hotlineNumber: this.createformGroup_info.value.hotlineNumber,
        supportEmail: this.createformGroup_info.value.supportEmail,
        headQuarterAddress: this.createformGroup_info.value.headQuarterAddress,
        discountFloat: this.createformGroup_info.value.discountFloat,
        discountAmount: this.createformGroup_info.value.discountAmount,
        description: this.createformGroup_info.value.description,
        restHouseType: parseInt(this.createformGroup_info.value.restHouseType)
      };

      this.messageService.openLoadingDialog();
      this.store.dispatch(
        RestHouseContactActions.createRestHouseContact({
          payload: payload,
        })
      );
    }
  }

  closeDialog(){
    this.dialog.closeAll();
  }
}
