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

  searchPhase= "";

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
    "delete",
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
    private store: Store<GuestMessageConHistoryListState>
  ) {
    this.guestMessageConHistoryListState = this.store.select(getGuestMessageConHistoryList);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.guestMessageConHistoryListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.guestMessageConHistoryList = state.data;
          this.length = state.count;
        }
      })
    );

    this.store.dispatch(GuestMessageConHistoryListActions.initial());

    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: this.pageIndex + 1,
          type: 1,
          search: this.searchPhase
        },
      })
    );
    this.messageService.openLoadingDialog();

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          if (state !== "" && state !== null) {
            this.messageService.closeAllDialog();
            this.messageService.openMessageNotifyDialog(state);
          }
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
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(GuestMessageConHistoryListActions.resetGuestMessageConHistoryList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    
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

  handlePageEvent(e: PageEvent) {
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.store.dispatch(
      GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
        payload: {
          page: this.pageIndex + 1,
          type: 1,
          pageSize: this.pageSize,
          search: this.searchPhase
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
          search: this.searchPhase
        },
      })
    );
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    console.log(sortState);
    if ((sortState.active = "name")) {
      if (sortState.direction === "asc") {
        this.store.dispatch(
          GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
            },
          })
        );
      } else if (sortState.direction === "desc") {
        this.store.dispatch(
          GuestMessageConHistoryListActions.getGuestMessageConHistoryList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
            },
          })
        );
      }
    } else {
    }
  }
}
