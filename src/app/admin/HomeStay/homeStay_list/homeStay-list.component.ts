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
import { State as HomeStayListState } from "./homeStay-list.store.reducer";
import {
  getHomeStayList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./homeStay-list.store.selector";
import * as HomeStayListActions from "./homeStay-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { HomeStayDetailComponent } from "../homeStay_detail/homeStay-detail.component";
import { HomeStayCreateComponent } from "../homeStay_create/homeStay-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { HomeStay } from "src/app/model/baseModel";

@Component({
  selector: "app-homeStayList",
  templateUrl: "./homeStay-list.component.html",
  styleUrls: ["./homeStay-list.component.css"],
})
export class HomeStayListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  homeStayList!: HomeStay[];
  subscriptions: Subscription[] = [];

  homeStayListState!: Observable<any>;
  homeStayDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  searchPhase = "";

  displayedColumns: string[] = [
    "id",
    "placeBranch",
    "hotlineNumber",
    "supportEmail",
    "headQuarterAddress",
    "discountFloat",
    "discountAmount",
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

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<HomeStayListState>
  ) {
    this.homeStayListState = this.store.select(getHomeStayList);
    this.homeStayDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.homeStayListState.subscribe((state) => {
        if (state) {         
          this.messageService.closeLoadingDialog();
          this.homeStayList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.homeStayDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              HomeStayListActions.getHomeStayList({
                payload: {
                  page: this.pageIndex + 1,
                  search: this.searchPhase
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(HomeStayListActions.initial());
    this.store.dispatch(
      HomeStayListActions.getHomeStayList({
        payload: {
          page: this.pageIndex + 1,
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
    this.store.dispatch(HomeStayListActions.resetHomeStayList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(HomeStayDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        HomeStayListActions.getHomeStayList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(HomeStayCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        HomeStayListActions.getHomeStayList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase
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
        this.messageService.openLoadingDialog();
        this.store.dispatch(
          HomeStayListActions.deleteHomeStay({
            payload: {
              id: id,
            },
          })
        );
      }
    });
  }

  addData(): void {}

  search() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      HomeStayListActions.getHomeStayList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase
        },
      })
    );
  }

  handlePageEvent(e: PageEvent) {
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      HomeStayListActions.getHomeStayList({
        payload: {
          page: this.pageIndex + 1,
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
        this.messageService.openLoadingDialog();
        this.store.dispatch(
          HomeStayListActions.getHomeStayList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase
            },
          })
        );
      } else if (sortState.direction === "desc") {
        this.messageService.openLoadingDialog();
        this.store.dispatch(
          HomeStayListActions.getHomeStayList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase
            },
          })
        );
      }
    } else {
    }
  }

  getIndex(elementId: string) {
    return this.homeStayList.findIndex((el) => el.id === elementId) + 1;
  }
}
