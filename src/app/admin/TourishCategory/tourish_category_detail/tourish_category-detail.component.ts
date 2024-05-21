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
import { TourishCategoryParam } from "./tourish_category-detail.component.model";

import * as TourishCategoryActions from "./tourish_category-detail.store.action";
import { State as TourishCategoryState } from "./tourish_category-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editTourishCategory,
  getTourishCategory,
  getMessage,
  getSysError,
} from "./tourish_category-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-category-detail",
  templateUrl: "./tourish_category-detail.component.html",
  styleUrls: ["./tourish_category-detail.component.css"],
})
export class TourishCategoryDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  disabled = true;

  tourishCategory: TourishCategory = {
    id: "",
    name: "",
    description: "",
  };
  tourishCategoryParam!: TourishCategoryParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  tourishCategoryState!: Observable<any>;
  editTourishCategoryState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<TourishCategoryState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: TourishCategoryParam
  ) {
    this.tourishCategoryState = this.store.select(getTourishCategory);
    this.editTourishCategoryState = this.store.select(editTourishCategory);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      name: ["", Validators.compose([Validators.required])],
      description: "",
    });

    this.subscriptions.push(
      this.tourishCategoryState.subscribe((state) => {
        if (state) {
          this.tourishCategory = state;
          console.log(state);
          this.messageService.closeLoadingDialog();

          this.editformGroup_info.controls["name"].setValue(state.name);
          this.editformGroup_info.controls["description"].setValue(
            state.description
          );
        }
      })
    );

    this.subscriptions.push(
      this.editTourishCategoryState.subscribe((state) => {
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

    this.store.dispatch(
      TourishCategoryActions.getTourishCategory({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(TourishCategoryActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(TourishCategoryActions.resetTourishCategory());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      name: this.tourishCategory.name ?? "",
      description: this.tourishCategory.description,
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: TourishCategory = {
        id: this.data.id,
        name: this.editformGroup_info.value.name,
        description: this.editformGroup_info.value.description,
      };

      this.store.dispatch(
        TourishCategoryActions.editTourishCategory({
          payload: payload,
        })
      );

      this.messageService.openLoadingDialog();
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
