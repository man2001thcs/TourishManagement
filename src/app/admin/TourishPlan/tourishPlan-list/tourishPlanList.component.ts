import { AdminService } from "../../service/admin.service";
import { HashService } from "../../../utility/user_service/hash.service";
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
import { TourishPlan } from "./tourishPlanList.component.model";
import { catchError, map, startWith, switchMap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { State as TourishPlanListState } from "./tourishPlanList.store.reducer";
import {
  getTourishPlanList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./tourishPlanList.store.selector";
import * as TourishPlanListActions from "./tourishPlanList.store.action";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { InterestModalComponent } from "src/app/utility/change-interest-modal/change-interest-modal.component";

@Component({
  selector: "app-tourishPlanList",
  templateUrl: "./tourishPlanList.component.html",
  styleUrls: ["./tourishPlanList.component.css"],
})
export class TourishPlanListAdminComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  tourishPlanList!: TourishPlan[];
  subscriptions: Subscription[] = [];

  tourishPlanListState!: Observable<any>;
  tourishPlanDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  searchPhase = "";

  displayedColumns: string[] = [
    "id",
    "tourName",

    "startingPoint",
    "endPoint",

    "supportNumber",
    "totalTicket",
    "remainTicket",

    "createDate",
    "startDate",
    "endDate",
    "edit",
    "interest",
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
    private router: Router,
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<TourishPlanListState>,
    private http: HttpClient
  ) {
    this.tourishPlanListState = this.store.select(getTourishPlanList);
    this.tourishPlanDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.tourishPlanListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.tourishPlanList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.tourishPlanDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);
          if (state.resultCd === 0) {
            this.store.dispatch(
              TourishPlanListActions.getTourishPlanList({
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

    this.store.dispatch(TourishPlanListActions.initial());

    this.store.dispatch(
      TourishPlanListActions.getTourishPlanList({
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
      this.errorMessageState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state);
          this.messageService.closeLoadingDialog();
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.openSystemFailNotifyDialog(state);
          this.messageService.closeLoadingDialog();
        }
      })
    );
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(TourishPlanListActions.resetTourishPlanList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  openInterestDialog(tour: TourishPlan): void {
    const title = this.isTourNotify(tour)
      ? "Bạn có muốn hủy theo dõi?"
      : "Bạn có muốn theo dõi tour này?";
    const dialogRef = this.dialog.open(InterestModalComponent, {
      data: { resourceId: tour.id, resourceType: "TourishPlan", title: title },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.store.dispatch(
        TourishPlanListActions.getTourishPlanList({
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

  openDeleteDialog(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "Bạn có muốn xóa tour này không?",
      },
    });

    ref.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          TourishPlanListActions.deleteTourishPlan({
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
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.store.dispatch(
      TourishPlanListActions.getTourishPlanList({
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
      TourishPlanListActions.getTourishPlanList({
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

  onClickEdit(id: string) {
    this.router.navigate(["admin/tourish-plan/detail/" + id + "/edit"]);
  }

  announceSortChange(sortState: Sort) {
    this.pageIndex = 0;
    this.sortColumn = sortState.active;
    this.sortDirection = sortState.direction;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      TourishPlanListActions.getTourishPlanList({
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

  isTourNotify(tour: TourishPlan) {
    if (
      tour.tourishInterestList !== null &&
      tour.tourishInterestList !== undefined
    ) {
      if (tour.tourishInterestList?.length > 0) {
        if (tour.tourishInterestList[0].interestStatus < 4) return true;
      }
    }

    return false;
  }

  getIndex(elementId: string) {
    return this.tourishPlanList.findIndex((el) => el.id === elementId) + 1;
  }

  getInterest(tourId: string) {
    const payload = {
      tourishPlanId: tourId,
    };
    this.http.get("/api/GetTourishPlan", { params: payload });
  }

  convertInterestToString(tour: TourishPlan): string {
    if (
      tour.tourishInterestList !== null &&
      tour.tourishInterestList !== undefined
    ) {
      switch ( tour.tourishInterestList[0].interestStatus) {
        case 0:
          return 'Theo dõi với tư cách người tạo';
        case 1:
          return 'Theo dõi với tư cách người chỉnh sửa';
        case 2:
          return 'Đã quan tâm';
        case 3:
          return 'Người dùng';
        case 4:
          return 'Không quan tâm';
        default:
          return 'Không quan tâm';
      }
    }
    return 'Không quan tâm';
  }
}
