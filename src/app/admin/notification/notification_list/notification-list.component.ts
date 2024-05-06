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
import { State as NotificationListState } from "./notification-list.store.reducer";
import {
  getNotificationList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./notification-list.store.selector";
import * as NotificationListActions from "./notification-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { NotificationDetailComponent } from "../notification_detail/notification-detail.component";
import { NotificationCreateComponent } from "../notification_create/notification-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { Notification } from "src/app/model/baseModel";

@Component({
  selector: "app-notificationList",
  templateUrl: "./notification-list.component.html",
  styleUrls: ["./notification-list.component.css"],
})
export class NotificationListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  notificationList!: Notification[];
  subscriptions: Subscription[] = [];

  notificationListState!: Observable<any>;
  notificationDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "content",
    "contentCode",
    "isRead",
    "isDeleted",
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
  searchPhase = "";

  sortColumn: string = "createDate";
  sortDirection: string = "desc";

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<NotificationListState>
  ) {
    this.notificationListState = this.store.select(getNotificationList);
    this.notificationDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.notificationListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.notificationList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.notificationDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              NotificationListActions.getNotificationList({
                payload: {
                  page: this.pageIndex + 1,
                  pageSize: this.pageSize,
                  search: this.searchPhase,
                  sortBy: this.sortColumn,
                  sortDirection: this.sortDirection,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(NotificationListActions.initial());

    this.store.dispatch(
      NotificationListActions.getNotificationList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
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
    this.store.dispatch(NotificationListActions.resetNotificationList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(NotificationDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        NotificationListActions.getNotificationList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(NotificationCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        NotificationListActions.getNotificationList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
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
        title: "Bạn có muốn xóa đối tác này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          NotificationListActions.deleteNotification({
            payload: {
              id: id,
            },
          })
        );
        this.messageService.openLoadingDialog();
      }
    });
  }

  addData(): void {}

  handlePageEvent(e: PageEvent) {
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.store.dispatch(
      NotificationListActions.getNotificationList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  search() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      NotificationListActions.getNotificationList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
  }

  announceSortChange(sortState: Sort) {
    this.pageIndex = 0;
    this.sortColumn = sortState.active;
    this.sortDirection = sortState.direction;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      NotificationListActions.getNotificationList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          sortBy: sortState.active,
          sortDirection: sortState.direction,
        },
      })
    );
  }

  getIndex(element: Notification) {
    return this.notificationList.findIndex((el) => el.id === element.id) + 1;
  }
}
