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
import { State as RestHouseContactListState } from "./rest-house-contact-list.store.reducer";
import {
  getRestHouseContactList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./rest-house-contact-list.store.selector";
import * as RestHouseContactListActions from "./rest-house-contact-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { RestHouseContactDetailComponent } from "../rest-house-contact_detail/rest-house-contact-detail.component";
import { RestHouseContactCreateComponent } from "../rest-house-contact_create/rest-house-contact-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { RestHouseContact } from "src/app/model/baseModel";
import { AvatarUploadModalComponent } from "src/app/utility/image_avatar_modal/imageUpload.component";

@Component({
  selector: "app-RestHouseContactList",
  templateUrl: "./rest-house-contact-list.component.html",
  styleUrls: ["./rest-house-contact-list.component.css"],
})
export class RestHouseContactListComponent implements OnInit, AfterViewInit, OnDestroy {
  RestHouseContactList!: RestHouseContact[];
  subscriptions: Subscription[] = [];

  RestHouseContactListState!: Observable<any>;
  RestHouseContactDeleteState!: Observable<any>;
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
    "avatar",
    "delete",
  ];
  @ViewChild(MatPaginator) paraginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clickedRows = new Set<any>();

  length = 0;
  pageSize = 5;
  pageSizeOpstion = [5, 10];
  pageIndex = 0;
  type = 0;

  constructor(
    private adminService: AdminService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private store: Store<RestHouseContactListState>
  ) {
    this.RestHouseContactListState = this.store.select(getRestHouseContactList);
    this.RestHouseContactDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.RestHouseContactListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.RestHouseContactList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.RestHouseContactDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              RestHouseContactListActions.getRestHouseContactList({
                payload: {
                  page: this.pageIndex + 1,
                  search: this.searchPhase,
                  type: this.type,
                },
              })
            );
          }
        }
      })
    );

    this.store.dispatch(RestHouseContactListActions.initial());
    this.store.dispatch(
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          page: this.pageIndex + 1,
          search: this.searchPhase,
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
    this.store.dispatch(RestHouseContactListActions.resetRestHouseContactList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(RestHouseContactDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        RestHouseContactListActions.getRestHouseContactList({
          payload: {
            page: this.pageIndex + 1,
            type: this.type,
            search: this.searchPhase,
          },
        })
      );
      this.messageService.openLoadingDialog();
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(RestHouseContactCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        RestHouseContactListActions.getRestHouseContactList({
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

  openAvatarDialog(id: string): void {
    const dialogRef = this.dialog.open(AvatarUploadModalComponent, {
      data: { resourceId: id, resourceType: 4},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        RestHouseContactListActions.getRestHouseContactList({
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
          RestHouseContactListActions.deleteRestHouseContact({
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
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: this.type,
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
      RestHouseContactListActions.getRestHouseContactList({
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
    this.pageIndex = 0;
    this.pageSize = 5;
    this.messageService.openLoadingDialog();
    this.store.dispatch(
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          page: 1,
          pageSize: this.pageSize,
          search: this.searchPhase,
          type: this.type,
          sortBy: sortState.active,
          sortDirection: sortState.direction
        },
      })
    );
  }

  getIndex(elementId: string) {
    return this.RestHouseContactList.findIndex((el) => el.id === elementId) + 1;
  }

  onChangeType($event: number){
    this.type = $event;
    this.pageIndex = 0;

    this.RestHouseContactList = [];
    this.messageService.openLoadingDialog();
    this.store.dispatch(
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          type: this.type,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
        },
      })
    );
  }
}
