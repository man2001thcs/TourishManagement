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
import { NotificationParam } from "./notification-detail.component.model";

import * as NotificationActions from "./notification-detail.store.action";
import { State as NotificationState } from "./notification-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editNotification,
  getNotification,
  getMessage,
  getSysError,
} from "./notification-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { Notification } from "src/app/model/baseModel";

@Component({
  selector: "app-book-detail",
  templateUrl: "./notification-detail.component.html",
  styleUrls: ["./notification-detail.component.css"],
})
export class NotificationDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  notification: Notification = {
    id: "",
    content: "",
    contentCode: "",
    userCreateId: "",
    isDeleted: false,
    isRead: false
  };

  notificationParam!: NotificationParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  notificationState!: Observable<any>;
  editNotificationState!: Observable<any>;
  subscriptions: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<NotificationState>,
    private messageService: MessageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: NotificationParam
  ) {
    this.notificationState = this.store.select(getNotification);
    this.editNotificationState = this.store.select(editNotification);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      id: [this.data.id, Validators.compose([Validators.required])],
      content: ["", Validators.compose([Validators.required])],
      contentId: [""],
      isRead: [false, Validators.compose([Validators.required])],
      isDeleted: [false, Validators.compose([Validators.required])]
    });

    this.subscriptions.push(
      this.notificationState.subscribe((state) => {
        if (state) {
          this.notification = state;

          this.editformGroup_info.controls["content"].setValue(
            state.content
          );
          this.editformGroup_info.controls["contentId"].setValue(
            state.contentId
          );
          this.editformGroup_info.controls["isRead"].setValue(
            state.isRead
          );
          this.editformGroup_info.controls["isDeleted"].setValue(
            state.isDeleted
          );        
        }
      })
    );

    this.subscriptions.push(
      this.editNotificationState.subscribe((state) => {
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
      NotificationActions.getNotification({
        payload: {
          id: this.data.id,
        },
      })
    );

    this.store.dispatch(NotificationActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(NotificationActions.resetNotification());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      content : this.notification.content ?? "",
      contentCode : this.notification.contentCode ?? "",
      isRead: this.notification.isRead ?? false,
      isDeleted: this.notification.isDeleted ?? false
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;
    if (this.editformGroup_info.valid){
      const payload: Notification = {
        id: this.data.id,
        userCreateId: this.notification.userCreateId,
        content: this.editformGroup_info.value.content,
        contentCode: this.editformGroup_info.value.contentCode,
        isRead: this.editformGroup_info.value.isRead,
        isDeleted: this.editformGroup_info.value.isDeleted
      };
  
      this.store.dispatch(
        NotificationActions.editNotification({
          payload: payload,
        })
      );
    } 
  }
}
