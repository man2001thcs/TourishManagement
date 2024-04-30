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
import { ReceiptParam } from "./receipt-detail.component.model";

import * as ReceiptActions from "./receipt-detail.store.action";
import { State as ReceiptState } from "./receipt-detail.store.reducer";
import { Store } from "@ngrx/store";
import {
  editReceipt,
  getReceipt,
  getMessage,
  getSysError,
} from "./receipt-detail.store.selector";
import { MessageService } from "src/app/utility/user_service/message.service";
import { FullReceipt, TotalReceipt, TourishPlan } from "src/app/model/baseModel";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-book-detail",
  templateUrl: "./receipt-detail.component.html",
  styleUrls: ["./receipt-detail.component.css"],
})
export class ReceiptDetailComponent implements OnInit, OnDestroy {
  isEditing: boolean = true;
  isSubmitted = false;
  receipt: FullReceipt = {
    fullReceiptId: "",
    totalReceiptId: "",
    guestName: "",
    tourishPlanId: "",
    totalTicket: 0,
    totalChildTicket: 0,
    originalPrice: 0,
    discountFloat: 0,
    discountAmount: 0,
    description: "",
    status: 0,
    createDate: "",
    completeDate: "",

    email: "",
    phoneNumber: "",
  };
  receiptParam!: ReceiptParam;

  this_announce = "";
  firstTime = false;
  editformGroup_info!: FormGroup;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;
  receiptState!: Observable<any>;
  editReceiptState!: Observable<any>;
  subscriptions: Subscription[] = [];
  tourishPlan!: TourishPlan;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private store: Store<ReceiptState>,
    private messageService: MessageService,
    private http: HttpClient,
    private _route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ReceiptParam
  ) {
    this.receiptState = this.store.select(getReceipt);
    this.editReceiptState = this.store.select(editReceipt);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.editformGroup_info = this.fb.group({
      fullReceiptId: [
        this.data.id      
      ],
      totalReceiptId: ["", Validators.compose([Validators.required])],
      tourishScheduleId: ["", Validators.compose([Validators.required])],
      guestName: ["", Validators.compose([Validators.required])],
      phoneNumber: [
        "",
        Validators.compose([Validators.required, Validators.minLength(8)]),
      ],
      email: ["", Validators.compose([Validators.required])],
      status: [0, Validators.compose([Validators.required])],
      totalTicket: [0, Validators.compose([Validators.required])],
      totalChildTicket: [0, Validators.compose([Validators.required])],
      originalPrice: [0, Validators.compose([Validators.required])],
      discountFloat: [0, Validators.compose([Validators.required])],
      discountAmount: [0, Validators.compose([Validators.required])],

      description: this.receipt.description,
    });

    this.subscriptions.push(
      this.receiptState.subscribe((state) => {
        if (state) {
          this.receipt = state;
          this.messageService.closeLoadingDialog();
          this.getTour(state.totalReceipt?.tourishPlanId);

          console.log(state.totalReceipt?.tourishPlanId);

          this.editformGroup_info.controls["totalReceiptId"].setValue(
            state.totalReceiptId
          );
          this.editformGroup_info.controls["tourishScheduleId"].setValue(
            state.tourishScheduleId
          );
          this.editformGroup_info.controls["guestName"].setValue(
            state.guestName
          );
          this.editformGroup_info.controls["originalPrice"].setValue(
            state.originalPrice
          );
          this.editformGroup_info.controls["email"].setValue(state.email);
          this.editformGroup_info.controls["phoneNumber"].setValue(
            state.phoneNumber
          );
          this.editformGroup_info.controls["status"].setValue(state.status);
          this.editformGroup_info.controls["totalTicket"].setValue(
            state.totalTicket
          );
          this.editformGroup_info.controls["totalChildTicket"].setValue(
            state.totalChildTicket
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
      this.editReceiptState.subscribe((state) => {
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
      this.errorSystemState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openFailNotifyDialog(state.message);
        }
      })
    );

    this.store.dispatch(
      ReceiptActions.getReceipt({
        payload: {
          id: this.data.id,
        },
      })
    );
    this.messageService.openLoadingDialog();

    this.store.dispatch(ReceiptActions.initial());

    //console.log(this.this_book);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(ReceiptActions.resetReceipt());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  getTour(id: string) {
    this.http
      .get("/api/GetTourishPlan/" + id)
      .subscribe((response: any) => {
        this.tourishPlan = response.data;
      });
  }

  formReset(): void {
    this.editformGroup_info.setValue({
      guestName: this.receipt.guestName ?? "",
      tourishPlanId: this.receipt.tourishPlanId ?? "",
      tourishScheduleId: this.receipt.tourishScheduleId ?? "",
      totalTicket: this.receipt.totalTicket ?? "",
      originalPrice: this.receipt.originalPrice ?? 0,
      discountFloat: this.receipt.discountFloat ?? 0,
      discountAmount: this.receipt.discountAmount ?? 0,
      description: this.receipt.description ?? "",
      status: this.receipt.status ?? 0,
      createDate: this.receipt.createDate ?? "",
      completeDate: this.receipt.completeDate ?? "",

      email: this.receipt.email ?? "",
      phoneNumber: this.receipt.phoneNumber ?? "",
    });
  }

  formSubmit(): void {
    console.log(this.editformGroup_info.value);
  }

  formSubmit_edit_info(): void {
    this.isSubmitted = true;

    console.log(this.editformGroup_info.value);
    if (this.editformGroup_info.valid){
      const payload: FullReceipt = {
        totalReceiptId: this.receipt.totalReceiptId,
        fullReceiptId: this.data.id,
        guestName: this.editformGroup_info.value.guestName,
        tourishPlanId: this.editformGroup_info.value.tourishPlanId,
        tourishScheduleId: this.editformGroup_info.value.tourishScheduleId,
        totalTicket: this.editformGroup_info.value.totalTicket,
        totalChildTicket: this.editformGroup_info.value.totalChildTicket,
        originalPrice: this.editformGroup_info.value.originalPrice,
        discountFloat: this.editformGroup_info.value.discountFloat,
        discountAmount: this.editformGroup_info.value.discountAmount,
        email: this.editformGroup_info.value.email,
        phoneNumber: this.editformGroup_info.value.phoneNumber,
        description: this.editformGroup_info.value.description,
        status: parseInt(this.editformGroup_info.value.status),
      };
  
      this.store.dispatch(
        ReceiptActions.editReceipt({
          payload: payload,
        })
      );
      this.messageService.openLoadingDialog();
    }
    
  }

  saveInfomation(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn lưu lại không?",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formSubmit_edit_info();
    });
  }

  selectChangeReceipt($event: any): any {
    console.log($event);
    this.editformGroup_info.controls["tourishPlanId"].setValue(
      $event.data[0]
    );

    console.log(this.editformGroup_info.value);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

  getDateFormat(date: Date) {
    const isoDateString = date != null ? date.toString() ?? "" : "";
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = ngayThang.getFullYear();
    const hour = ngayThang.getHours();
    const minute = ngayThang.getHours();

    const chuoiNgayThang = `Ngày ${day} tháng ${month}`;

    return chuoiNgayThang;
  }
}
