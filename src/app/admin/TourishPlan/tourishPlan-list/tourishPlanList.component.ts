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
    private router: Router,
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<TourishPlanListState>
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
                  search: this.searchPhase,
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
          search: this.searchPhase,
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
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.store.dispatch(
      TourishPlanListActions.getTourishPlanList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
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
        },
      })
    );
  }

  onClickEdit(id: string) {
    this.router.navigate(["admin/tourish-plan/detail/" + id + "/edit"]);
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
          TourishPlanListActions.getTourishPlanList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
            },
          })
        );
        this.messageService.openLoadingDialog();
      } else if (sortState.direction === "desc") {
        this.store.dispatch(
          TourishPlanListActions.getTourishPlanList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
            },
          })
        );
        this.messageService.openLoadingDialog();
      }
    } else {
    }
  }

  getIndex(elementId: string) {
    return this.tourishPlanList.findIndex((el) => el.id === elementId) + 1;
  }
}
