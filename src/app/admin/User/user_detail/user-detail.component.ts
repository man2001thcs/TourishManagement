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
import { UserParam } from "./user-detail.component.model";

import * as UserActions from "./user-detail.store.action";
import { State as UserState } from "./user-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editUser,
  getUser,
  getMessage,
  getSysError,
} from "./user-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { User } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./user-detail.component.html",
  styleUrls: ["./user-detail.component.css"],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;

  user: User = {
    id: "",
    userName: "",
    phoneNumber: "",
    email: "",
    address: "",
    fullName: "",
    role: 0,
  };
  userParam!: UserParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  userState!: Observable<any>;
  editUserState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<UserState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: UserParam
  ) {
    this.userState = this.store.select(getUser);
    this.editUserState = this.store.select(editUser);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      userName: ["", Validators.compose([Validators.required])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      email: ["", Validators.compose([Validators.required])],
      address: ["", Validators.compose([Validators.required])],
      role: [0, Validators.compose([Validators.required])],
      fullName: [0, Validators.compose([Validators.required])],
    });

    this.subscriptions.push(
      this.userState.subscribe((state) => {
        if (state) {
          this.user = state;

          this.editformGroup_info.controls["userName"].setValue(state.userName);
          this.editformGroup_info.controls["phoneNumber"].setValue(
            state.phoneNumber
          );
          this.editformGroup_info.controls["email"].setValue(state.email);
          this.editformGroup_info.controls["address"].setValue(state.address);

          this.editformGroup_info.controls["role"].setValue(state.role);

          this.editformGroup_info.controls["fullName"].setValue(state.fullName);
        }
      })
    );

    this.subscriptions.push(
      this.editUserState.subscribe((state) => {
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
          this.messageService.openFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      UserActions.getUser({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(UserActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(UserActions.resetUser());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      userName: this.user.userName ?? "",
      phoneNumber: this.user.phoneNumber ?? "",
      email: this.user.email ?? "",
      address: this.user.address ?? "",
      role: this.user.role ?? 0,
      fullName: this.user.fullName ?? "",
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid) {
      const payload: User = {
        id: this.data.id,
        userName: this.editformGroup_info.value.userName,
        phoneNumber: this.editformGroup_info.value.phoneNumber,
        email: this.editformGroup_info.value.email,
        address: this.editformGroup_info.value.address,
        role: parseInt(this.editformGroup_info.value.role),
        fullName: this.editformGroup_info.value.fullName,
      };

      this.store.dispatch(
        UserActions.editUser({
          payload: payload,
        })
      );
    }
  }
}
