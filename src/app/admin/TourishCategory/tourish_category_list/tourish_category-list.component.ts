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
import { State as TourishCategoryListState } from "./tourish_category-list.store.reducer";
import {
  getTourishCategoryList,
  getDeleteStatus,
  getMessage,
  getSysError,
} from "./tourish_category-list.store.selector";
import * as TourishCategoryListActions from "./tourish_category-list.store.action";
import { MatDialog } from "@angular/material/dialog";
import { TourishCategoryDetailComponent } from "../tourish_category_detail/tourish_category-detail.component";
import { TourishCategoryCreateComponent } from "../tourish_category_create/tourish_category-create.component";
import { MessageService } from "src/app/utility/user_service/message.service";
import { ConfirmDialogComponent } from "src/app/utility/confirm-dialog/confirm-dialog.component";
import { TourishCategory } from "src/app/model/baseModel";

@Component({
  selector: "app-tourish-category-list",
  templateUrl: "./tourish_category-list.component.html",
  styleUrls: ["./tourish_category-list.component.css"],
})
export class TourishCategoryListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  tourishCategoryList!: TourishCategory[];
  subscriptions: Subscription[] = [];

  searchPhase= "";

  tourishCategoryListState!: Observable<any>;
  tourishCategoryDeleteState!: Observable<any>;
  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  displayedColumns: string[] = [
    "id",
    "name",
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
    private store: Store<TourishCategoryListState>
  ) {
    this.tourishCategoryListState = this.store.select(getTourishCategoryList);
    this.tourishCategoryDeleteState = this.store.select(getDeleteStatus);
    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.tourishCategoryListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.tourishCategoryList = state.data;
          this.length = state.count;
        }
      })
    );

    this.subscriptions.push(
      this.tourishCategoryDeleteState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openMessageNotifyDialog(state.messageCode);

          if (state.resultCd === 0) {
            this.store.dispatch(
              TourishCategoryListActions.getTourishCategoryList({
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

    this.store.dispatch(TourishCategoryListActions.initial());

    this.store.dispatch(
      TourishCategoryListActions.getTourishCategoryList({
        payload: {
          page: this.pageIndex + 1,
          search: this.searchPhase
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
          this.messageService.closeLoadingDialog();
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );
  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(TourishCategoryListActions.resetTourishCategoryList());
    this.messageService.closeAllDialog();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  openEditDialog(id: string): void {
    const dialogRef = this.dialog.open(TourishCategoryDetailComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {

      this.store.dispatch(
        TourishCategoryListActions.getTourishCategoryList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase
          },
        })
      );
      this.messageService.openLoadingDialog();

      console.log(result);
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TourishCategoryCreateComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      this.store.dispatch(
        TourishCategoryListActions.getTourishCategoryList({
          payload: {
            page: this.pageIndex + 1,
            search: this.searchPhase
          },
        })
      );
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
          TourishCategoryListActions.deleteTourishCategory({
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
      TourishCategoryListActions.getTourishCategoryList({
        payload: {
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          search: this.searchPhase
        },
      })
    );
  }

  search() {
    this.pageSize = 5;
    this.pageIndex = 0;

    this.messageService.openLoadingDialog();
    this.store.dispatch(
      TourishCategoryListActions.getTourishCategoryList({
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
        this.store.dispatch(
          TourishCategoryListActions.getTourishCategoryList({
            payload: {
              page: 1,
              pageSize: this.pageSize,
            },
          })
        );
      } else if (sortState.direction === "desc") {
        this.store.dispatch(
          TourishCategoryListActions.getTourishCategoryList({
            payload: {
              sortBy: "name_desc",
              page: 1,
              pageSize: this.pageSize,
            },
          })
        );
      }
    } else {
    }
  }

  getIndex(elementId: string) {
    return this.tourishCategoryList.findIndex((el) => el.id === elementId) + 1;
  }
}
