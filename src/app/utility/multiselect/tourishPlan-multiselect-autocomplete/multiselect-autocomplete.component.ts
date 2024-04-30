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

import { State as TourishPlanListState } from "./multiselect-autocomplete.store.reducer";
import * as TourishPlanListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getTourishPlanList,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { TourishPlan } from "src/app/model/baseModel";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "tourishPlan-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class TourishPlanMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tourishPlanCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: Array<string> }>();

  @Input() data_selected!: TourishPlan | undefined;
  @Input() key: string = "";

  tourishPlanIdList: string[] = [];
  tourishPlanNameList: string[] = [];

  data!: TourishPlan[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  tourishPlanListState!: Observable<any>;
  filteredTourishPlans!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("tourishPlanInput")
  tourishPlanInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<TourishPlanListState>,
    private messageService: MessageService
  ) {
    this.filteredTourishPlans = this.tourishPlanCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.tourishPlanListState = this.store
      .select(getTourishPlanList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredTourishPlans.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          TourishPlanListActions.getTourishPlanList({
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
      this.tourishPlanListState.subscribe((state) => {
        if (state) {
          if (state.data)
            this.currentTotal = this.currentTotal + state.data.length;
          if (this.currentTotal >= state.count) this.canLoadMore = false;

          // New search
          if (this.newSearch || this.currentTotal === state.data.length) {
            this.data = [];
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
            this.messageService.closeAllDialog();
            this.messageService.openSystemFailNotifyDialog(state);
          }
        }
      })
    );

    this.store.dispatch(
      TourishPlanListActions.getTourishPlanList({
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
    this.store.dispatch(TourishPlanListActions.resetTourishPlanList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    if (this.data_selected !== undefined) {
      this.tourishPlanIdList.push(this.data_selected.id ?? "");
      this.tourishPlanNameList.push(this.data_selected.tourName);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our tourishPlan
    if (value) {
      this.tourishPlanNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tourishPlanCtrl.setValue(null);
  }

  remove(tourishPlan: string): void {
    const index = this.tourishPlanNameList.indexOf(tourishPlan);
    if (index >= 0) {
      this.tourishPlanNameList.splice(index, 1);
      this.tourishPlanIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({ data: this.tourishPlanIdList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tourishPlanIdList = [];
    this.tourishPlanNameList = [];

    this.tourishPlanIdList.push(event.option.value.id);
    this.tourishPlanNameList.push(event.option.value.tourName);

    this.tourishPlanInput.nativeElement.value = "";
    this.tourishPlanCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          TourishPlanListActions.getTourishPlanList({
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

  onDisplayAtr(tourishPlan: TourishPlan): string {
    return "";
  }

  onDisplayString(input: string): string {
    if (input.length > 30) return input.substring(0, 30);
    else return input;
  }

  isChecked(tourishPlan: TourishPlan): boolean {
    let tourishPlanExist = this.tourishPlanIdList.find(
      (tourishPlanId) => tourishPlanId === tourishPlan.id
    );
    if (tourishPlanExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
