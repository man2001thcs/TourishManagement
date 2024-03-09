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
import { State as RestaurantListState } from "./restaurant-list.store.reducer";
import {
  getRestaurantList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./restaurant-list.store.selector";
import * as RestaurantListActions from "./restaurant-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { RestaurantDetailComponent } from "../restaurant_detail/restaurant-detail.component";
import { RestaurantCreateComponent } from "../restaurant_create/restaurant-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { Restaurant } from "src/app/model/baseModel";

@Component({
  selector: "app-restaurantList",
  templateUrl: "./restaurant-list.component.html",
  styleUrls: ["./restaurant-list.component.css"],
})
export class RestaurantListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  restaurantList!: Restaurant[];
  subscriptions: Subscription[] = [];

  restaurantListState!: Observable<any>;
  restaurantDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

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
  searchPhase = "";

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<RestaurantListState>
  ) {
    this.restaurantListState = this.store.select(getRestaurantList);
    this.restaurantDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.restaurantListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.restaurantList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.restaurantDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              RestaurantListActions.getRestaurantList({
                payload: {
                  page: this.pageIndex + 1,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(RestaurantListActions.initial());

    this.store.dispatch(
      RestaurantListActions.getRestaurantList({
        payload: {
          page: this.pageIndex + 1,
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
    this.store.dispatch(RestaurantListActions.resetRestaurantList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(RestaurantDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        RestaurantListActions.getRestaurantList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RestaurantCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        RestaurantListActions.getRestaurantList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
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
          RestaurantListActions.deleteRestaurant({
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
      RestaurantListActions.getRestaurantList({
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
      RestaurantListActions.getRestaurantList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
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
          RestaurantListActions.getRestaurantList({
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
          RestaurantListActions.getRestaurantList({
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
}
