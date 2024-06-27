import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { State as ReceiptListState } from "./receipt-list.store.reducer";
import {
  getReceiptList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./receipt-list.store.selector";
import * as ReceiptListActions from "./receipt-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { ReceiptUserDetailComponent } from "../receipt_detail/receipt-detail.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import {
  FullReceipt,
  TotalReceipt,
  TourishPlan,
} from "src/app/model/baseModel";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { TokenStorageService } from "src/app/utility/user_service/token.service";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-receiptList",
  templateUrl: "./receipt-list.component.html",
  styleUrls: ["./receipt-list.component.css"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class ReceiptUserListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  receiptList: TotalReceipt[] = [];
  subscriptions: Subscription[] = [];

  expandedElement!: any;
  isExpansionDetailRow = (i: number, row: Object) =>
    row.hasOwnProperty("detailRow");

  receiptListState!: Observable<any>;
  receiptDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  active = 0;

  displayedColumns: string[] = [
    "id",
    "tourName",
    "singlePrice",
    //"tourishPlanId",
  ];

  displayedColumnsWithExpand = [...this.displayedColumns, "expand"];

  @ViewChild(MatPaginator) paraginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clickedRows = new Set<any>();

  length = 0;
  pageSize = 5;
  pageSizeOpstion = [5, 10];
  pageIndex = 0;
  sortColumn: string = "createdDate";
  sortDirection: string = "desc";
  tourishPlanId = "";

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<ReceiptListState>,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private _route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.receiptListState = this.store.select(getReceiptList);
    this.receiptDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.receiptListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.receiptList = state.data ?? [];
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.receiptDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);
          this.messageService.closeLoadingDialog();

          if (state.resultCd === 0) {
            const email = this.tokenStorageService.getUser().email;
            this.store.dispatch(
              ReceiptListActions.getReceiptList({
                payload: {
                  email: email,
                  page: this.pageIndex + 1,
                  pageSize: this.pageSize,
                  tourishPlanId: this.tourishPlanId,
                  status: this.active,
                  sortBy: this.sortColumn,
                  sortDirection: this.sortDirection,
                },
              })
            );
            this.messageService.openLoadingDialog();
          }
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

    this.store.dispatch(ReceiptListActions.initial());

    this.subscriptions.push(
      this._route.queryParamMap.subscribe((query) => {
        if (query.get("active")) {
          this.active = parseInt(query.get("active") ?? "0");
          this.pageIndex = 0;
          this.pageSize = 5;

          const email = this.tokenStorageService.getUser().email;
          this.store.dispatch(
            ReceiptListActions.getReceiptList({
              payload: {
                email: email,
                page: this.pageIndex + 1,
                pageSize: this.pageSize,
                tourishPlanId: this.tourishPlanId,
                status: this.active,
                sortBy: this.sortColumn,
                sortDirection: this.sortDirection,
              },
            })
          );
          this.messageService.openLoadingDialog();
        } else {
          const email = this.tokenStorageService.getUser().email;
          this.store.dispatch(
            ReceiptListActions.getReceiptList({
              payload: {
                email: email,
                page: this.pageIndex + 1,
                pageSize: this.pageSize,
                tourishPlanId: this.tourishPlanId,
                status: this.active,
                sortBy: this.sortColumn,
                sortDirection: this.sortDirection,
              },
            })
          );
          this.messageService.openLoadingDialog();
        }

        if (query.get("complete")) {
          const complete = parseInt(query.get("complete") ?? "0");
          if (complete === 1 && parseInt(query.get("active") ?? "0") == 2)
            this.messageService.openNotifyDialog(
              "Đơn thanh toán đã hoàn thành, vui lòng kiểm tra lại trong mục quản lý hóa đơn"
            );

          if (complete === 1 && parseInt(query.get("active") ?? "0") == 3)
            this.messageService.openFailNotifyDialog(
              "Đơn thanh toán đã bị hủy, vui lòng kiểm tra lại trong mục quản lý hóa đơn"
            );
        }
      })
    );
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(ReceiptListActions.resetReceiptList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(ReceiptUserDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      const email = this.tokenStorageService.getUser().email;
      this.store.dispatch(
        ReceiptListActions.getReceiptList({
          payload: {
            email: email,
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            tourishPlanId: this.tourishPlanId,
            status: this.active,
            sortBy: this.sortColumn,
            sortDirection: this.sortDirection,
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  async openConfirmDialog(this_announce: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this_announce,
      },
    });

    await ref.afterClosed().subscribe((result) => {
      return result;
    });
  }

  addData(): void {}

  tourStatusChange($event: number): void {
    this.pageIndex = 0;
    this.active = $event;
    const email = this.tokenStorageService.getUser().email;

    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          status: $event,
          tourishPlanId: this.tourishPlanId,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  getTotalPriceReceipt(
    tourishPlan: TourishPlan,
    fullReceipt: FullReceipt
  ): number {
    let totalPrice = 0;

    tourishPlan.stayingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.eatSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.movingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    totalPrice =
      fullReceipt.originalPrice *
        (fullReceipt.totalTicket + fullReceipt.totalChildTicket / 2) *
        (1 - fullReceipt.discountFloat) -
      fullReceipt.discountAmount;

    return Math.floor(totalPrice);
  }

  getTotalPrice(tourishPlan: TourishPlan): number {
    let totalPrice = 0;

    tourishPlan.stayingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.eatSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    tourishPlan.movingSchedules?.forEach((entity) => {
      totalPrice += entity.singlePrice ?? 0;
    });

    return totalPrice;
  }

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    const email = this.tokenStorageService.getUser().email;
    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,

          tourishPlanId: this.tourishPlanId,
          status: this.active,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  selectChangeReceipt($event: any) {
    const email = this.tokenStorageService.getUser().email;
    this.tourishPlanId = $event.data[0];
    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          tourishPlanId: $event.data[0],
          status: this.active,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  announceSortChange(sortState: Sort) {
    this.pageIndex = 0;
    this.sortColumn = sortState.active;
    this.sortDirection = sortState.direction;
    const email = this.tokenStorageService.getUser().email;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          email: email,
          tourishPlanId: this.tourishPlanId,
          sortBy: sortState.active,
          sortDirection: sortState.direction,
          status: this.active,
        },
      })
    );
  }

  getIndex(elementId: string) {
    return (
      this.receiptList.findIndex((el) => el.totalReceiptId === elementId) + 1
    );
  }

  callPayment(orderId: string, paymentId: string) {
    if (paymentId !== null && paymentId.length > 0) {
      this.http
        .get("/api/CallPayment/tour/check-request?id=" + orderId)
        .subscribe((response: any) => {
          if (response) {
            if (response.messageCode == "I510") {
              window.open("https://pay.payos.vn/web/" + paymentId);
            } else {
              this.messageService.openMessageNotifyDialog(response.messageCode);
            }
          }
        });
    } else {
      const payload = {
        orderCode: parseInt(orderId),
      };

      this.messageService.openLoadingDialog();
      this.http
        .post("/api/CallPayment/tour/request", payload)
        .subscribe((response: any) => {
          this.messageService.closeLoadingDialog();
          if (response) {
            if (response.code == "00") {
              window.open(response.data.checkoutUrl);
            } else if (response.code == "231") {
              this.messageService.openFailNotifyDialog(
                "Link thanh toán đã tồn tại"
              );
            }
          }
        });
    }
  }

  getPaymentStatus(input: string) {
    if (input == "0") return "Đang xác nhận thông tin";
    else if (input == "1") return "Đang chờ thanh toán";
    else if (input == "2") return "Đã thanh toán";
    else if (input == "3") return "Đã hủy";
    return "Thất bại";
  }

  getPaymentStatusColor(input: string) {
    if (input == "0") return "#ffea00";
    else if (input == "1") return "#ffea00";
    else if (input == "2") return "#4caf50";
    else if (input == "3") return "#f50057";
    return "Thất bại";
  }

  isPaymentDisable(input: string) {
    if (input == "0" || input == "2" || input == "3") return true;
    return false;
  }

  getDateFormat(isoDateString: string) {
    // Chuyển đổi chuỗi ISO 8601 thành đối tượng Date

    if (isoDateString.length <= 0) return "Chưa xác định";
    const ngayThang = new Date(isoDateString);

    // Lấy ngày, tháng, năm, giờ từ đối tượng Date
    const day = ngayThang.getDate();
    const month = ngayThang.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = ngayThang.getFullYear();
    const hour = ngayThang.getHours() + 7;
    const minute = ngayThang.getMinutes();

    // Tạo chuỗi kết quả
    const minuteString = minute !== 0 ? minute + " phút" : "";
    const chuoiNgayThang =
      `Ngày ${day} tháng ${month}, ${hour} giờ ` + minuteString;

    return chuoiNgayThang;
  }

  formatVNCurrency(num: number): string {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  }
}
