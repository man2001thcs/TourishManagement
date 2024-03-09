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
import { State as HotelListState } from "./hotel-list.store.reducer";
import {
  getHotelList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./hotel-list.store.selector";
import * as HotelListActions from "./hotel-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { HotelDetailComponent } from "../hotel_detail/hotel-detail.component";
import { HotelCreateComponent } from "../hotel_create/hotel-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { Hotel } from "src/app/model/baseModel";

@Component({
  selector: "app-hotelList",
  templateUrl: "./hotel-list.component.html",
  styleUrls: ["./hotel-list.component.css"],
})
export class HotelListComponent implements OnInit, AfterViewInit, OnDestroy {
  hotelList!: Hotel[];
  subscriptions: Subscription[] = [];
  searchPhase = "";

  hotelListState!: Observable<any>;
  hotelDeleteState!: Observable<any>;
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

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<HotelListState>
  ) {
    this.hotelListState = this.store.select(getHotelList);
    this.hotelDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.hotelListState.subscribe((state) => {
        if (state) {
          console.log("abcg: ", state);
          this.messageService.closeLoadingDialog();
          this.hotelList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.hotelDeleteState.subscribe((state) => {
        if (state) {
          console.log("abcd: ", state);
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.messageService.openLoadingDialog();
            this.store.dispatch(
              HotelListActions.getHotelList({
                payload: {
                  page: this.pageIndex + 1,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(HotelListActions.initial());

    this.store.dispatch(
      HotelListActions.getHotelList({
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
    this.store.dispatch(HotelListActions.resetHotelList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(HotelDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        HotelListActions.getHotelList({
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
    const dialogRef = this.dialog.open(HotelCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        HotelListActions.getHotelList({
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
        this.messageService.openLoadingDialog();
        this.store.dispatch(
          HotelListActions.deleteHotel({
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
      HotelListActions.getHotelList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
        },
      })
    );
  }

  handlePageEvent(e: PageEvent) {
    // this.length = e.length;

    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    console.log(this.pageIndex);

    this.store.dispatch(
      HotelListActions.getHotelList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
        },
      })
    );
    this.messageService.openLoadingDialog();
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    console.log(sortState);
    if (sortState.active === "placeBranch") {
      if (sortState.direction === "asc") {
        this.store.dispatch(
          HotelListActions.getHotelList({
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
          HotelListActions.getHotelList({
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
