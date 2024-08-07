import { AdminService } from "../../service/admin.service";
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
import { Observable, Subscription } from "rxjs";
import { State as TourishCategoryListState } from "./tourish_category-list.store.reducer";
import {
  getTourishCategoryList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./tourish_category-list.store.selector";
import * as TourishCategoryListActions from "./tourish_category-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { TourishCategoryDetailComponent } from "../tourish_category_detail/tourish_category-detail.component";
import { TourishCategoryCreateComponent } from "../tourish_category_create/tourish_category-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-category-list",
  templateUrl: "./tourish_category-list.component.html",
  styleUrls: ["./tourish_category-list.component.css"],
})
export class TourishCategoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  tourishCategoryList!: TourishCategory[];
  subscriptions: Subscription[] = [];

  searchPhase = "";

  tourishCategoryListState!: Observable<any>;
  tourishCategoryDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "name",
    "description",
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
    private store: Store<TourishCategoryListState>
  ) {
    this.tourishCategoryListState = this.store.select(getTourishCategoryList);
    this.tourishCategoryDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.tourishCategoryListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.tourishCategoryList = state.data ?? [];
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.tourishCategoryDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              TourishCategoryListActions.getTourishCategoryList({
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

    this.store.dispatch(TourishCategoryListActions.initial());

    this.store.dispatch(
      TourishCategoryListActions.getTourishCategoryList({
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
          this.messageService.closeLoadingDialog();
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(TourishCategoryListActions.resetTourishCategoryList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(TourishCategoryDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(
        TourishCategoryListActions.getTourishCategoryList({
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

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TourishCategoryCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      

      this.store.dispatch(
        TourishCategoryListActions.getTourishCategoryList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
            sortBy: this.sortColumn,
            sortDirection: this.sortDirection,
          },
        })
      );
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
        title: "Bạn có muốn xóa thể loại này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          TourishCategoryListActions.deleteTourishCategory({
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
      TourishCategoryListActions.getTourishCategoryList({
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

  search() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      TourishCategoryListActions.getTourishCategoryList({
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
      TourishCategoryListActions.getTourishCategoryList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: 0,
          sortBy: sortState.active,
          sortDirection: sortState.direction,
        },
      })
    );
  }

  getIndex(elementId: string) {
    return this.tourishCategoryList.findIndex((el) => el.id === elementId) + 1;
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
}
