import { AdminService } from "../../service/admin.service";

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
import { State as GuestMessageConHistoryListState } from "./chat_con_his_list.store.reducer";
import {
  getGuestMessageConHistoryList,
  getMessage,
  getSysError,
} from "./chat_con_his_list.store.selector";
import * as GuestMessageConHistoryListActions from "./chat_con_his_list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { GuestMessageConHistory } from "src/app/model/baseModel";
import { Router } from "@angular/router";
import { SignalRService } from "src/app/utility/user_service/signalr.service";

@Component({
  selector: "app-chat-his-con-list",
  templateUrl: "./chat_con_his_list.component.html",
  styleUrls: ["./chat_con_his_list.component.css"],
})
export class GuestMessageConHistoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  guestMessageConHistoryList!: GuestMessageConHistory[];
  subscriptions: Subscription[] = [];

  searchPhase = "";

  guestMessageConHistoryListState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "guestName",
    "guestEmail",
    "guestPhoneNumber",
    "isOpen",
    "createDate",
    "edit",
  ];
  @ViewChild(MatPaginator) paraginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clickedRows = new Set<any>();

  length = 0;
  pageSize = 5;
  pageSizeOpstion = [5, 10];
  pageIndex = 0;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<GuestMessageConHistoryListState>,
    private signalRService: SignalRService,
    private router: Router
  ) {
    this.guestMessageConHistoryListState = this.store.select(
      getGuestMessageConHistoryList
    );
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.store.dispatch(GuestMessageConHistoryListActions.initial());

    this.subscriptions.push(
      this.guestMessageConHistoryListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.guestMessageConHistoryList = state.data;
          this.length = state.count;
        }
      })
    );

    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: this.pageIndex + 1,
          type: 1,
          search: this.searchPhase,
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
          this.messageService.closeLoadingDialog();
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );

    this.signalRNotification();
    this.subscriptions.push(
      this.signalRService.ConnFeedObservable.subscribe((notify: any) => {
        console.log(notify);
      })
    );
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(
      GuestMessageConHistoryListActions.resetGuestMessageConHistoryList()
    );
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {}

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

  handlePageEvent(e: PageEvent) {
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: this.pageIndex + 1,
          type: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
        },
      })
    );
  }

  search() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: this.pageIndex + 1,
          type: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
        },
      })
    );
  }

  announceSortChange(sortState: Sort) {
    this.pageIndex = 0;
    this.pageSize = 5;
    this.messageService.openLoadingDialog();
    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          sortBy: sortState.active,
          sortDirection: sortState.direction
        },
      })
    );
  }

  getIndex(elementId: string) {
    return (
      this.guestMessageConHistoryList.findIndex((el) => el.id === elementId) + 1
    );
  }

  getStatus(input: number) {
    if (input == 2) return "Đang mở";
    else if (input == 0) return "Đã đóng";
    else if (input == 1) return "Đang bận";
    return "";
  } 

  connectStatus(input: number) {
    if (input == 2) return "Kết nối";
    else if (input == 0) return "Đã đóng";
    else if (input == 1) return "Đang bận";
    return "";
  } 

  onClickConnect(id: string) {
    this.router.navigate(["admin/chat/display/" + id]);
  }

  signalRNotification() {
    this.signalRService.startConnection("/api/guest/message").then(() => {
      // 2 - register for ALL relay
      this.signalRService.listenToClientFeeds("NotifyNewCon");
    });
  }

}
