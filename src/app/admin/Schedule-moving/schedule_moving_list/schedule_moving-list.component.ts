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
import { State as MovingScheduleListState } from "./schedule_moving-list.store.reducer";
import {
  getMovingScheduleList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./schedule_moving-list.store.selector";
import * as MovingScheduleListActions from "./schedule_moving-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { MovingScheduleDetailComponent } from "../schedule_moving_detail/schedule_moving-detail.component";
import { MovingScheduleCreateComponent } from "../schedule_moving_create/schedule_moving-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { MovingSchedule } from "src/app/model/baseModel";
import { InterestModalComponent } from "src/app/utility/change-interest-modal/change-interest-modal.component";
import { ScheduleChangeModalComponent } from "src/app/utility/change-schedule-modal/change-schedule-modal.component";

@Component({
  selector: "app-movingScheduleList",
  templateUrl: "./schedule_moving-list.component.html",
  styleUrls: ["./schedule_moving-list.component.css"],
})
export class MovingScheduleListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  movingScheduleList!: MovingSchedule[];
  subscriptions: Subscription[] = [];

  movingScheduleListState!: Observable<any>;
  movingScheduleDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "name",
    "branchName",
    "singlePrice",
    "vehicleType",
    "startingPlace",
    "headingPlace",
    "createDate",
    "edit",
    "interest",
    "schedule",
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
    private store: Store<MovingScheduleListState>
  ) {
    this.movingScheduleListState = this.store.select(getMovingScheduleList);
    this.movingScheduleDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.movingScheduleListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.movingScheduleList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.movingScheduleDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              MovingScheduleListActions.getMovingScheduleList({
                payload: {
                  search: this.searchPhase,
                  page: this.pageIndex + 1,
                  pageSize: this.pageSize,
                  type: 0,
                  sortBy: this.sortColumn,
                  sortDirection: this.sortDirection,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(MovingScheduleListActions.initial());

    this.store.dispatch(
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: 0,
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
    this.store.dispatch(MovingScheduleListActions.resetMovingScheduleList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(MovingScheduleDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(
        MovingScheduleListActions.getMovingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
            type: 0,
            sortBy: this.sortColumn,
            sortDirection: this.sortDirection,
          },
        })
      );

      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MovingScheduleCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        MovingScheduleListActions.getMovingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
            type: 0,
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
          MovingScheduleListActions.deleteMovingSchedule({
            payload: {
              id: id,
            },
          })
        );
      }
    });
  }

  async openScheduleDialog(schedule: MovingSchedule) {
    const ref = this.dialog.open(ScheduleChangeModalComponent, {
      data: {
        movingScheduleId: schedule.id,
        disabled: false,
      },
    });

    await ref.afterClosed().subscribe((result) => {
      this.store.dispatch(
        MovingScheduleListActions.getMovingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
            type: 0,
            sortBy: this.sortColumn,
            sortDirection: this.sortDirection,
          },
        })
      );

      this.messageService.openLoadingDialog();
    });
  }

  addData(): void {}

  handlePageEvent(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.store.dispatch(
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: 0,
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
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: 0,
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
      MovingScheduleListActions.getMovingScheduleList({
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

  getIndex(element: MovingSchedule) {
    return this.movingScheduleList.findIndex((el) => el.id === element.id) + 1;
  }

  isScheduleNotify(schedule: MovingSchedule) {
    if (
      schedule.scheduleInterestList !== null &&
      schedule.scheduleInterestList !== undefined
    ) {
      if (schedule.scheduleInterestList?.length > 0) {
        if (schedule.scheduleInterestList[0].interestStatus < 4) return true;
      }
    }

    return false;
  }

  openInterestDialog(schedule: MovingSchedule): void {
    const title = this.isScheduleNotify(schedule)
      ? "Bạn có muốn hủy theo dõi?"
      : "Bạn có muốn theo dõi dịch vụ này?";
    const dialogRef = this.dialog.open(InterestModalComponent, {
      data: {
        resourceId: schedule.id,
        resourceType: "MovingSchedule",
        title: title,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(
        MovingScheduleListActions.getMovingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
            search: this.searchPhase,
            type: 0,
            sortBy: this.sortColumn,
            sortDirection: this.sortDirection,
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  convertInterestToString(schedule: MovingSchedule): string {
    if (
      schedule.scheduleInterestList !== null &&
      schedule.scheduleInterestList !== undefined
    ) {
      if (schedule.scheduleInterestList.length <= 0) return "Không quan tâm";
      switch (schedule.scheduleInterestList[0].interestStatus) {
        case 0:
          return "Theo dõi với tư cách người tạo";
        case 1:
          return "Theo dõi với tư cách người chỉnh sửa";
        case 2:
          return "Đã quan tâm";
        case 3:
          return "Người dùng";
        case 4:
          return "Không quan tâm";
        default:
          return "Không quan tâm";
      }
    }
    return "Không quan tâm";
  }
}
