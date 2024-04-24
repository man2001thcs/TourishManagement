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

import { State as MovingScheduleListState } from "./select-autocomplete.store.reducer";
import * as MovingScheduleListActions from "./select-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getMovingScheduleList,
  getSysError,
} from "./select-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { MovingSchedule } from "src/app/model/baseModel";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "movingschedule-select-autocomplete",
  templateUrl: "select-autocomplete.component.html",
  styleUrls: ["select-autocomplete.component.css"],
})
export class MovingScheduleSelectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingscheduleCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: Array<string> }>();

  @Input() data_selected!: MovingSchedule | undefined;
  @Input() key: string = "";

  movingscheduleIdList: string[] = [];
  movingscheduleNameList: string[] = [];
movingscheduleType = 1;

  data!: MovingSchedule[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  movingscheduleListState!: Observable<any>;
  filteredMovingSchedules!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("movingscheduleInput")
  movingscheduleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<MovingScheduleListState>,
    private messageService: MessageService
  ) {
    this.filteredMovingSchedules = this.movingscheduleCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.movingscheduleListState = this.store
      .select(getMovingScheduleList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredMovingSchedules.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          MovingScheduleListActions.getMovingScheduleList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              type: this.movingscheduleType,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.movingscheduleListState.subscribe((state) => {
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
      this.errorMessageState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.closeAllDialog();
          this.messageService.openMessageNotifyDialog(state.code);
        }
      })
    );

    this.subscriptions.push(
      this.errorSystemState.subscribe((state: any) => {
        if (state) {
          this.messageService.closeLoadingDialog();
          this.messageService.openFailNotifyDialog(state.message);
        }
      })
    );

    this.store.dispatch(
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          type: this.movingscheduleType,
          page: this.pageIndex + 1,
          pageSize: 6,
        },
      })
    );
    
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingScheduleListActions.resetMovingScheduleList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    if (this.data_selected !== undefined) {
      this.movingscheduleIdList.push(this.data_selected.id ?? "");
      this.movingscheduleNameList.push(this.data_selected.name ?? "");
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our movingschedule
    if (value) {
      this.movingscheduleNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.movingscheduleCtrl.setValue(null);
  }

  remove(movingschedule: string): void {
    const index = this.movingscheduleNameList.indexOf(movingschedule);
    if (index >= 0) {
      this.movingscheduleNameList.splice(index, 1);
      this.movingscheduleIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({ data: this.movingscheduleIdList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.movingscheduleIdList = [];
    this.movingscheduleNameList = [];

    this.movingscheduleIdList.push(event.option.value.id);
    this.movingscheduleNameList.push(event.option.value.fullName);

    this.movingscheduleInput.nativeElement.value = "";
    this.movingscheduleCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          MovingScheduleListActions.getMovingScheduleList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              type: this.movingscheduleType,
              pageSize: 6,
            },
          })
        );
      }
    }
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 1) {
      this.movingscheduleType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.movingscheduleType = 2;
    }

    this.movingscheduleNameList = [];
    this.movingscheduleIdList = [];
    
    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          type: this.movingscheduleType,
          pageSize: 6,
        }})
    );
  }

  onDisplayAtr(movingschedule: MovingSchedule): string {
    return "";
  }

  isChecked(movingschedule: MovingSchedule): boolean {
    let movingscheduleExist = this.movingscheduleIdList.find(
      (movingscheduleId) => movingscheduleId === movingschedule.id
    );
    if (movingscheduleExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
