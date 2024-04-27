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
import { State as MovingContactListState } from "./moving_contact-list.store.reducer";
import {
  getMovingContactList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./moving_contact-list.store.selector";
import * as MovingContactListActions from "./moving_contact-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { MovingContactDetailComponent } from "../moving_contact_detail/moving_contact-detail.component";
import { MovingContactCreateComponent } from "../moving_contact_create/moving_contact-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { MovingContact } from "src/app/model/baseModel";

@Component({
  selector: "app-moving_contact-list",
  templateUrl: "./moving_contact-list.component.html",
  styleUrls: ["./moving_contact-list.component.css"],
})
export class MovingContactListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  MovingContactList!: MovingContact[];
  subscriptions: Subscription[] = [];

  MovingContactListState!: Observable<any>;
  MovingContactDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  type = 0;

  displayedColumns: string[] = [
    "id",
    "branchName",
    "hotlineNumber",
    "supportEmail",
    "headQuarterAddress",
    "discountFloat",
    "discountAmount",

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
    private store: Store<MovingContactListState>
  ) {
    this.MovingContactListState = this.store.select(getMovingContactList);
    this.MovingContactDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.MovingContactListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.MovingContactList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.MovingContactDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              MovingContactListActions.getMovingContactList({
                payload: {
                  search: this.searchPhase,
                  page: this.pageIndex + 1,
                  type: this.type,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(MovingContactListActions.initial());

    this.store.dispatch(
      MovingContactListActions.getMovingContactList({
        payload: {
          page: this.pageIndex + 1,
          type: this.type,
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
    this.store.dispatch(MovingContactListActions.resetMovingContactList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(MovingContactDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        MovingContactListActions.getMovingContactList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
            type: this.type,
          },
        })
      );

      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(MovingContactCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        MovingContactListActions.getMovingContactList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase,
            type: this.type,
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
          MovingContactListActions.deleteMovingContact({
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
      MovingContactListActions.getMovingContactList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.type,
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
      MovingContactListActions.getMovingContactList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: this.type,
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
          MovingContactListActions.getMovingContactList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
              type: this.type,
            },
          })
        );
        this.messageService.openLoadingDialog();
      } else if (sortState.direction === "desc") {
        this.store.dispatch(
          MovingContactListActions.getMovingContactList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
              search: this.searchPhase,
              type: this.type,
            },
          })
        );
        this.messageService.openLoadingDialog();
      }
    } else {
    }
  }

  getIndex(element: MovingContact) {
    return this.MovingContactList.findIndex((el) => el.id === element.id) + 1;
  }

  onChangeType($event: number){
    this.type = $event;
    this.pageIndex = 0;

    this.MovingContactList = [];
    this.messageService.openLoadingDialog();
    this.store.dispatch(
      MovingContactListActions.getMovingContactList({
        payload: {
          type: this.type,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
        },
      })
    );
  }
}
