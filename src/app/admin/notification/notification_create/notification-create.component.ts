import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NotificationParam } from "./notification-create.component.model";
import * as notificationActions from "./notification-create.store.action";
import { State as passenger_carState } from "./notification-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createNotification,
  getMessage,
  getSysError,
} from "./notification-create.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { KeyValue, Notification } from "src/app/model/baseModel";
import { SUCCESS_MESSAGE_CODE_VI } from "src/app/utility/config/notificationCode";
import { TokenStorageService } from "src/app/utility/user_service/token.service";

@Component({
  selector: "app-book-create",
  templateUrl: "./notification-create.component.html",
  styleUrls: ["./notification-create.component.css"],
})
export class NotificationCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;

  notificationParam!: NotificationParam;

  this_announce = "";
  userReceiveId = "";

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  notificationState!: Observable<any>;
  createNotificationState!: Observable<any>;
  subscriptions: Subscription[] = [];

  isSubmitted = false;
  successNotifyCode: KeyValue[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<passenger_carState>,
    private messageService: MessageService,
    private tokenStorage: TokenStorageService,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: NotificationParam
  ) {
    this.createNotificationState = this.store.select(createNotification);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    SUCCESS_MESSAGE_CODE_VI.forEach((value, key) => {
      this.successNotifyCode.push({
        key,
        value: this.getNotifyCodeInfo(value),
      });
    });

    this.subscriptions.push(
      this.createNotificationState.subscribe((state) => {
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

    this.store.dispatch(notificationActions.initial());

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // content: string;
    // contentCode?: string;
    // isRead: boolean;
    // isDeleted: boolean;
    this.createformGroup_info = this.fb.group({
      content: ["", Validators.compose([Validators.required])],
      contentCode: [""],
      isRead: ["0", Validators.compose([Validators.required])],
      isDeleted: ["0", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(notificationActions.resetNotification());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.patchValue({
      content: "",
      contentCode: "",
      isRead: false,
      isDeleted: false,
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;

    if (this.userReceiveId.length <= 0) {
      this.messageService.openFailNotifyDialog(
        "Vui lòng nhập đối tượng để gửi thông báo"
      );
      return;
    }

    if (this.createformGroup_info.valid) {
      this.messageService.openLoadingDialog();

      const payload: Notification = {
        userCreateId: this.tokenStorage.getUser().Id,
        userReceiveId: this.userReceiveId,
        content: this.createformGroup_info.value.content,
        contentCode: this.createformGroup_info.value.contentCode,
        isGenerate: false,
        isRead: this.createformGroup_info.value.isRead === "1" ? true : false,
        isDeleted:
          this.createformGroup_info.value.isDeletedd === "1" ? true : false,
      };

      this.store.dispatch(
        notificationActions.createNotification({
          payload: payload,
        })
      );
    }
  }

  getNotifyCodeInfo(str: string) {
    let strCapital = str.charAt(0).toUpperCase() + str.slice(1);
    return strCapital.replaceAll(":", "");
  }

  selectChangeReceiver($event: any) {
    this.userReceiveId = $event.data[0];
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}
