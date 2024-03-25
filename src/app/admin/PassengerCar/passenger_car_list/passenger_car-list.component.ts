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
import { State as PassengerCarListState } from "./passenger_car-list.store.reducer";
import {
  getPassengerCarList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./passenger_car-list.store.selector";
import * as PassengerCarListActions from "./passenger_car-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { PassengerCarDetailComponent } from "../passenger_car_detail/passenger_car-detail.component";
import { PassengerCarCreateComponent } from "../passenger_car_create/passenger_car-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { PassengerCar } from "src/app/model/baseModel";

@Component({
  selector: "app-passengerCarList",
  templateUrl: "./passenger_car-list.component.html",
  styleUrls: ["./passenger_car-list.component.css"],
})
export class PassengerCarListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  passengerCarList!: PassengerCar[];
  subscriptions: Subscription[] = [];

  passengerCarListState!: Observable<any>;
  passengerCarDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "branchName",
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
    private store: Store<PassengerCarListState>
  ) {
    this.passengerCarListState = this.store.select(getPassengerCarList);
    this.passengerCarDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.passengerCarListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.passengerCarList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.passengerCarDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              PassengerCarListActions.getPassengerCarList({
                payload: {
                  search: this.searchPhase,
                  page: this.pageIndex + 1,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(PassengerCarListActions.initial());

    this.store.dispatch(
      PassengerCarListActions.getPassengerCarList({
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
    this.store.dispatch(PassengerCarListActions.resetPassengerCarList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(PassengerCarDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        PassengerCarListActions.getPassengerCarList({
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
    const dialogRef = this.dialog.open(PassengerCarCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        PassengerCarListActions.getPassengerCarList({
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
          PassengerCarListActions.deletePassengerCar({
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
      PassengerCarListActions.getPassengerCarList({
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
      PassengerCarListActions.getPassengerCarList({
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
          PassengerCarListActions.getPassengerCarList({
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
          PassengerCarListActions.getPassengerCarList({
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

  getIndex(element: PassengerCar) {
    return this.passengerCarList.findIndex((el) => el.id === element.id) + 1;
  }
}
