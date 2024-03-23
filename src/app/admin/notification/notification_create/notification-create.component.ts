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
import { NotificationParam } from "./notification-create.component.model";
import * as notificationActions from "./notification-create.store.action";
import { State as passenger_carState } from "./notification-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createNotification,
  getMessage,
  getSysError,
} from "./notification-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Notification } from "src/app/model/baseModel";

@Component({
  selector: "app-book-create",
  templateUrl: "./notification-create.component.html",
  styleUrls: ["./notification-create.component.css"],
})
export class NotificationCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;

  notificationParam!: NotificationParam;

  this_announce = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  notificationState!: Observable<any>;
  createNotificationState!: Observable<any>;
  subscriptions: Subscription[] = [];

  isSubmitted = false;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<passenger_carState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: NotificationParam
  ) {
    this.createNotificationState = this.store.select(createNotification);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createNotificationState.subscribe((state) => {
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

    this.store.dispatch(notificationActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // content: string;
    // contentCode?: string;
    // isRead: boolean;
    // isDeleted: boolean;
    this.createformGroup_info = this.fb.group({
      content: ["", Validators.compose([Validators.required])],
      contentCode: [""],
      isRead: [false, Validators.compose([Validators.required])],
      isDeleted: [false, Validators.compose([Validators.required])]
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(notificationActions.resetNotification());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.setValue({
      content: "",
      contentCode: "",
      isRead: false,
      isDeleted: false
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;
    if (this.createformGroup_info.valid) {
      const payload: Notification = {
        userCreateId: "",
        content: this.createformGroup_info.value.placeBranch,
        contentCode: this.createformGroup_info.value.contentCode,
        isRead: this.createformGroup_info.value.isRead,
        isDeleted: this.createformGroup_info.value.isDeleted
      };

      this.store.dispatch(
        notificationActions.createNotification({
          payload: payload,
        })
      );
    }
  }
}
