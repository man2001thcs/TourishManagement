import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Subscription, of, timer } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { State as TourishCategoryListState } from "./multiselect-autocomplete.store.reducer";
import * as TourishCategoryListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getTourishCategoryList,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import {
  TourishCategory,
  TourishCategoryRelation,
} from "src/app/model/baseModel";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "tourishCategory-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class TourishCategoryMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tourishCategoryCtrl = new FormControl("");

  @Output() result = new EventEmitter<{
    data: Array<TourishCategoryRelation>;
  }>();

  @Input() data_selected: Array<TourishCategoryRelation> = [];
  @Input() key: string = "";

  tourishCategoryIdList: string[] = [];
  tourishCategoryNameList: string[] = [];

  tourishCategoryRelationReturnList: Array<TourishCategoryRelation> = [];

  data!: TourishCategory[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  tourishCategoryListState!: Observable<any>;
  filteredTourishCategorys!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("tourishCategoryInput")
  tourishCategoryInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<TourishCategoryListState>,
    private messageService: MessageService
  ) {
    this.filteredTourishCategorys = this.tourishCategoryCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.tourishCategoryListState = this.store
      .select(getTourishCategoryList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredTourishCategorys.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          TourishCategoryListActions.getTourishCategoryList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.tourishCategoryListState.subscribe((state) => {
        if (state) {
          if (state.data)
            this.currentTotal = this.currentTotal + state.data.length;
          if (this.currentTotal >= state.count) this.canLoadMore = false;

          // New search
          if (this.newSearch || this.currentTotal === state.data.length) {
            if (state.data) this.data = state.data;
            this.newSearch = false;
          } else {
            if (state.data) this.data = this.data.concat(state.data);
          }

          this.length = state.count;
        }

        this.cancelLoading();
      })
    );

    this.subscriptions.push(
      this.errorMessageState.subscribe((state) => {
        if (state) {
          this.messageService.openMessageNotifyDialog(state);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state) => {
        if (state) {
          this.messageService.openSystemFailNotifyDialog(state);
        }
      })
    );

    this.store.dispatch(
      TourishCategoryListActions.getTourishCategoryList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: 6,
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(TourishCategoryListActions.resetTourishCategoryList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    this.tourishCategoryRelationReturnList = [];
    if (this.data_selected.length > 0) {
      this.tourishCategoryRelationReturnList = [...this.data_selected];
      this.data_selected.forEach((e) => {
        this.tourishCategoryNameList.push(e.tourishCategory.name);
      });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our tourishCategory
    if (value) {
      this.tourishCategoryNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tourishCategoryCtrl.setValue(null);
  }

  remove(tourishCategory: string): void {
    const index = this.tourishCategoryNameList.indexOf(tourishCategory);
    if (index >= 0) {
      this.tourishCategoryNameList.splice(index, 1);
      this.tourishCategoryIdList.splice(index, 1);
    }

    const index1 = this.tourishCategoryRelationReturnList.findIndex(
      (e) => e.tourishCategory.name === tourishCategory
    );

    console.log(index1);

    if (index >= 0) {
      this.tourishCategoryRelationReturnList.splice(index1, 1);
    }

    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    let returnList: TourishCategoryRelation[] = [];
    this.tourishCategoryRelationReturnList.forEach((element) => {
      const relation: TourishCategoryRelation = {
        tourishCategory: element.tourishCategory,
      };
      returnList = [...returnList, relation];
    });
    this.result.emit({ data: returnList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tourishCategoryIdList.push(event.option.value.id);
    this.tourishCategoryNameList.push(event.option.value.name);

    const tourRelation: TourishCategoryRelation = {
      tourishCategory: event.option.value,
    };

    this.tourishCategoryRelationReturnList = [
      ...this.tourishCategoryRelationReturnList,
      tourRelation,
    ];

    this.tourishCategoryInput.nativeElement.value = "";
    this.tourishCategoryCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          TourishCategoryListActions.getTourishCategoryList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              pageSize: 6,
            },
          })
        );
      }
    }
  }

  onDisplayAtr(tourishCategory: TourishCategory): string {
    return "";
  }

  isChecked(tourishCategory: TourishCategory): boolean {
    let tourishCategoryExist = this.tourishCategoryIdList.find(
      (tourishCategoryId) => tourishCategoryId === tourishCategory.id
    );
    if (tourishCategoryExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
