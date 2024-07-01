import { Response } from "../../../model/response";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";

import { Observable, Subscription, map } from "rxjs";

import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { TourishCategoryParam } from "./tourish_category-create.component.model";
import * as TourishCategoryActions from "./tourish_category-create.store.action";
import { State as tourish_categoryState } from "./tourish_category-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createTourishCategory,
  getMessage,
  getSysError,
} from "./tourish_category-create.store.selector";

import { MessageService } from "src/app/utility/user_service/message.service";
import { TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-category-create",
  templateUrl: "./tourish_category-create.component.html",
  styleUrls: ["./tourish_category-create.component.css"],
})
export class TourishCategoryCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  TourishCategoryParam!: TourishCategoryParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  TourishCategoryState!: Observable<any>;
  createTourishCategoryState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<tourish_categoryState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: TourishCategoryParam
  ) {
    this.createTourishCategoryState = this.store.select(createTourishCategory);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createTourishCategoryState.subscribe((state) => {
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

    this.store.dispatch(TourishCategoryActions.initial());

    
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
      name: "",
      description: "",
    });
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(TourishCategoryActions.resetTourishCategory());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.patchValue({
      name: "",
      description: "",
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    if (this.createformGroup_info.valid) {
      const payload: TourishCategory = {
        name: this.createformGroup_info.value.name,     
        description: this.createformGroup_info.value.description,    
      };

      this.store.dispatch(
        TourishCategoryActions.createTourishCategory({
          payload: payload,
        })
      );

      this.messageService.openLoadingDialog();
    }
  }

  closeDialog(){
    this.dialog.closeAll();
  }
}
