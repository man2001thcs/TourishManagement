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
import { State as UserListState } from "./user-list.store.reducer";
import {
  getUserList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./user-list.store.selector";
import * as UserListActions from "./user-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { UserDetailComponent } from "../user_detail/user-detail.component";

import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { User } from "src/app/model/baseModel";

@Component({
  selector: "app-userList",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"],
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  userList!: User[];
  subscriptions: Subscription[] = [];
  userType = 1;
  selectTab = 0;

  userListState!: Observable<any>;
  userDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "userName",
    "phoneNumber",
    "email",
    "address",
    "role",

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
  sortColumn: string = "createDate";
  sortDirection: string = "desc";

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<UserListState>
  ) {
    this.userListState = this.store.select(getUserList);
    this.userDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.userListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.userList = state.data ?? [];
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.userDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              UserListActions.getUserList({
                payload: {
                  page: this.pageIndex + 1,
                  pageSize: this.pageSize,
                  type: this.userType,
                  sortBy: this.sortColumn,
                  sortDirection: this.sortDirection,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(UserListActions.initial());

    this.store.dispatch(
      UserListActions.getUserList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.userType,
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
    this.store.dispatch(UserListActions.resetUserList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(UserDetailComponent, {
      data: { id: id, type: this.userType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(
        UserListActions.getUserList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            type: this.userType,
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
        title: "Bạn có muốn xóa người dùng này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          UserListActions.deleteUser({
            payload: {
              id: id,
            },
          })
        );
      }
    });
  }

  addData(): void {}

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.messageService.openLoadingDialog();

    this.store.dispatch(
      UserListActions.getUserList({
        payload: {
          type: this.userType,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
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
      UserListActions.getUserList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          sortBy: sortState.active,
          sortDirection: sortState.direction,
        },
      })
    );
  }

  onChangeUserType($event: number) {
    this.userType = $event - 1;
    this.pageIndex = 0;

    this.userList = [];
    this.messageService.openLoadingDialog();
    this.store.dispatch(
      UserListActions.getUserList({
        payload: {
          type: this.userType,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          sortBy: this.sortColumn,
          sortDirection: this.sortDirection,
        },
      })
    );
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
      `Ngày ${day} tháng ${month} năm ${year}, ${hour} giờ ` + minuteString;

    return chuoiNgayThang;
  }

  getIndex(elementId: string) {
    return this.userList.findIndex((el) => el.id === elementId) + 1;
  }

  getRolePhase(input: number) {
    if (input === 0) return "Tài khoản mới chờ xác nhận mail";
    else if (input === 1) return "Người dùng";
    else if (input === 2) return "Nhân viên quản lý chờ xác thực";
    else if (input === 3) return "Nhân viên quản lý";
    else if (input === -1) return "Tài khoản bị khóa";
    return "Người dùng";
  }
}
