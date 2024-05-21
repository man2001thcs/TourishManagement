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
import { ReceiptParam } from "./receipt-create.component.model";
import * as receiptActions from "./receipt-create.store.action";
import { State as passenger_carState } from "./receipt-create.store.reducer";
import { Store } from "@ngrx/store";
import {
  createReceipt,
  getMessage,
  getSysError,
} from "./receipt-create.store.selector";
import { FailNotifyDialogComponent } from "src/app/utility/notification_admin/fail-notify-dialog.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import {
  FullReceipt,
  TourishPlan,
  TourishSchedule,
} from "src/app/model/baseModel";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-book-create",
  templateUrl: "./receipt-create.component.html",
  styleUrls: ["./receipt-create.component.css"],
})
export class ReceiptCreateComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;

  receiptParam!: ReceiptParam;

  this_announce = "";
  isSubmitted = false;

  createformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  receiptState!: Observable<any>;
  createReceiptState!: Observable<any>;
  subscriptions: Subscription[] = [];
  tourishPlan!: TourishPlan;
  tourSchedule: TourishSchedule[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<passenger_carState>,
    private messageService: MessageService,
    private http: HttpClient,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ReceiptParam
  ) {
    this.createReceiptState = this.store.select(createReceipt);

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.createReceiptState.subscribe((state) => {
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

    this.store.dispatch(receiptActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.createformGroup_info = this.fb.group({
      tourishPlanId: ["", Validators.compose([Validators.required])],
      tourishScheduleId: ["", Validators.compose([Validators.required])],
      status: [0, Validators.compose([Validators.required])],
      guestName: ["", Validators.compose([Validators.required])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required]),
      ],
      email: ["", Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      totalChildTicket: [0, Validators.compose([Validators.required])],
      originalPrice: [0, Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],
      description: ["", Validators.compose([Validators.required])],
    });
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(receiptActions.resetReceipt());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  formReset(): void {
    this.createformGroup_info.setValue({
      guestName: "",
      tourishPlanId: "",
      tourishScheduleId: "",
      totalTicket: 0,
      totalChildTicket: 0,
      originalPrice: 0,
      discountFloat: 0,
      discountAmount: 0,
      description: "",
      status: 0,

      email: "",
      phoneNumber: "",
    });
  }

  formSubmit_create_info(): void {
    this.isSubmitted = true;

    if (this.createformGroup_info.valid) {
      const payload: FullReceipt = {
        guestName: this.createformGroup_info.value.guestName,
        tourishPlanId: this.createformGroup_info.value.tourishPlanId,
        totalTicket: this.createformGroup_info.value.totalTicket,
        totalChildTicket: this.createformGroup_info.value.totalChildTicket,
        originalPrice: this.createformGroup_info.value.originalPrice,
        discountFloat: this.createformGroup_info.value.discountFloat,
        discountAmount: this.createformGroup_info.value.discountAmount,
        email: this.createformGroup_info.value.email,
        phoneNumber: this.createformGroup_info.value.phoneNumber,
        description: this.createformGroup_info.value.description,
        status: this.createformGroup_info.value.status,
      };

      this.store.dispatch(
        receiptActions.createReceipt({
          payload: payload,
        })
      );

      this.messageService.openLoadingDialog();
    }
  }

  selectChangeReceipt($event: any): any {
    console.log($event);
    if ($event.data?.length > 0) {
      this.createformGroup_info.controls["tourishPlanId"].setValue(
        $event.data[0]
      );

      if ($event.data[0] == "") {
        this.tourSchedule = [];
      } else this.getTour($event.data[0]);
      console.log(this.createformGroup_info.value);
    } else {
      this.createformGroup_info.controls["tourishPlanId"].setValue("");
      this.tourSchedule = [];
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  getTour(id: string) {
    this.http.get("/api/GetTourishPlan/" + id).subscribe((response: any) => {
      this.tourishPlan = response.data;
      this.tourSchedule = this.tourishPlan.tourishScheduleList ?? [];
    });
  }

  getDateFormat(date: Date) {
    const isoDateString = date != null ? date.toString() ?? "" : "";
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0

    const chuoiNgayThang = `Ngày ${day} tháng ${month}`;

    return chuoiNgayThang;
  }
}
