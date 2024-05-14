import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Store } from "@ngrx/store";
import { Observable, Subscription, scheduled } from "rxjs";
import { State as ReceiptListState } from "./receipt-list.store.reducer";
import {
  getReceiptList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./receipt-list.store.selector";
import * as ReceiptListActions from "./receipt-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { MovingReceiptUserDetailComponent } from "../receipt_detail/receipt-detail.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import {
  FullReceipt,
  TotalReceipt,
  MovingSchedule,
} from "src/app/model/baseModel";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { TokenStorageService } from "src/app/utility/user_service/token.service";

@Component({
  selector: "app-moving-receiptList",
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
export class MovingReceiptUserListComponent implements OnInit, AfterViewInit, OnDestroy {
  receiptList!: TotalReceipt[];
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
    "name",
    "branchName",
    "singlePrice",
    //"scheduleId",
    "createDate"
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
  scheduleId = "";

  constructor(
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<ReceiptListState>,
    private tokenStorageService: TokenStorageService
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
          this.receiptList = state.data;
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
                  status: this.active,
                  movingScheduleId: this.scheduleId,
                  scheduleType: 1,
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

    this.store.dispatch(ReceiptListActions.initial());

    const email = this.tokenStorageService.getUser().email;
    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          status: this.active,
          movingScheduleId: this.scheduleId,
          scheduleType: 1,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();

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
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(ReceiptListActions.resetReceiptList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(MovingReceiptUserDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      const email = this.tokenStorageService.getUser().email;
      this.store.dispatch(
        ReceiptListActions.getReceiptList({
          payload: {
            email: email,
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            status: this.active,
            movingScheduleId: this.scheduleId,
            scheduleType: 1,
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

  openDeleteDialog(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn xóa hóa đơn này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ReceiptListActions.deleteReceipt({
            payload: {
              id: id,
            },
          })
        );
        this.messageService.openLoadingDialog();
      }
    });
  }

  addData(): void {
    console.log("abc");
  }

  tourStatusChange($event: number): void {
    this.pageIndex = 0;
    const email = this.tokenStorageService.getUser().email;
    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          status: $event,
          movingScheduleId: this.scheduleId,
          scheduleType: 1,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  getTotalPriceReceipt(
    schedule: MovingSchedule,
    fullReceipt: FullReceipt
  ): number {
    let totalPrice = schedule.singlePrice ?? 0;

    totalPrice =
      (totalPrice - fullReceipt.discountAmount) *
      fullReceipt.totalTicket *
      (1 - fullReceipt.discountFloat);

    return Math.floor(totalPrice);
  }

  getTotalPrice(schedule: MovingSchedule): number {
    return schedule.singlePrice ?? 0;
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
          status: this.active,
          movingScheduleId: this.scheduleId,
          scheduleType: 1,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  selectChangeReceipt($event: any) {
    console.log($event);
    this.scheduleId = $event.data.idList[0];
    const email = this.tokenStorageService.getUser().email;

    this.store.dispatch(
      ReceiptListActions.getReceiptList({
        payload: {
          email: email,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          movingScheduleId: this.scheduleId,
          scheduleType: 1,
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
          email: email,
          page: 1,
          pageSize: this.pageSize,
          movingScheduleId: this.scheduleId,
          status: this.active,
          scheduleType: 1,
          sortBy: sortState.active,
          sortDirection: sortState.direction,
        },
      })
    );
  }

  getIndex(elementId: string) {
    return (
      this.receiptList.findIndex((el) => el.totalReceiptId === elementId) + 1
    );
  }
}
