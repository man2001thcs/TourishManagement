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
import { State as StayingScheduleListState } from "./schedule_staying-list.store.reducer";
import {
  getStayingScheduleList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./schedule_staying-list.store.selector";
import * as StayingScheduleListActions from "./schedule_staying-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { StayingScheduleDetailComponent } from "../schedule_staying_detail/schedule_staying-detail.component";
import { StayingScheduleCreateComponent } from "../schedule_staying_create/schedule_staying-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { StayingSchedule } from "src/app/model/baseModel";

@Component({
  selector: "app-stayingScheduleList",
  templateUrl: "./schedule_staying-list.component.html",
  styleUrls: ["./schedule_staying-list.component.css"],
})
export class StayingScheduleListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  stayingScheduleList!: StayingSchedule[];
  subscriptions: Subscription[] = [];

  stayingScheduleListState!: Observable<any>;
  stayingScheduleDeleteState!: Observable<any>;
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
    "status",
    "startDate",
    "endDate",
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

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<StayingScheduleListState>
  ) {
    this.stayingScheduleListState = this.store.select(getStayingScheduleList);
    this.stayingScheduleDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.stayingScheduleListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.stayingScheduleList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.stayingScheduleDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              StayingScheduleListActions.getStayingScheduleList({
                payload: {
                  search: this.searchPhase,
                  page: this.pageIndex + 1,
                  type: 0,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(StayingScheduleListActions.initial());

    this.store.dispatch(
      StayingScheduleListActions.getStayingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          type: 0,
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
    this.store.dispatch(StayingScheduleListActions.resetStayingScheduleList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(StayingScheduleDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {

      this.store.dispatch(
        StayingScheduleListActions.getStayingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
            type: 0,
          },
        })
      );

      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(StayingScheduleCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        StayingScheduleListActions.getStayingScheduleList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
            type: 0,
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
          StayingScheduleListActions.deleteStayingSchedule({
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
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.store.dispatch(
      StayingScheduleListActions.getStayingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: 0,
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
      StayingScheduleListActions.getStayingScheduleList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: 0,
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
          StayingScheduleListActions.getStayingScheduleList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
              type: 0,
            },
          })
        );
        this.messageService.openLoadingDialog();
      } else if (sortState.direction === "desc") {
        this.store.dispatch(
          StayingScheduleListActions.getStayingScheduleList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
              type: 0,
            },
          })
        );
        this.messageService.openLoadingDialog();
      }
    } else {
    }
  }

  getIndex(element: StayingSchedule) {
    return this.stayingScheduleList.findIndex((el) => el.id === element.id) + 1;
  }
}
