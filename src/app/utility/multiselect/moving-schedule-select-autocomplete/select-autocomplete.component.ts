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
import { HttpClient } from "@angular/common/http";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "app-moving-schedule-select-autocomplete",
  templateUrl: "select-autocomplete.component.html",
  styleUrls: ["select-autocomplete.component.css"],
})
export class MovingScheduleSelectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingScheduleCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: any }>();

  @Input() data_selected!: MovingSchedule | undefined;
  @Input() currentContactId = "";
  @Input() key: string = "";
  @Input() type = 0;

  movingScheduleIdList: string[] = [];
  movingScheduleNameList: string[] = [];
  movingScheduleType = 0;

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
  movingScheduleListState!: Observable<any>;
  filteredMovingSchedules!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("movingScheduleInput")
  movingScheduleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<MovingScheduleListState>,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.filteredMovingSchedules =
      this.movingScheduleCtrl.valueChanges.pipe(debounceTime(400));

    this.movingScheduleListState = this.store
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
              type: this.movingScheduleType,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.movingScheduleListState.subscribe((state) => {
        if (state) {
          this.messageService.closeLoadingDialog();
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
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          type: this.movingScheduleType,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
        },
      })
    );

  }

  ngOnDestroy(): void {
    
    this.store.dispatch(
      MovingScheduleListActions.resetMovingScheduleList()
    );

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    this.movingScheduleType = this.type;
    if (this.data_selected !== undefined) {
      this.movingScheduleIdList.push(this.data_selected.id ?? "");
      this.movingScheduleNameList.push(this.data_selected.name ?? "");
    }

    this.getCurrentContact();
  }

  getCurrentContact() {
    if (this.currentContactId.length > 0) {
      this.http
        .get("/api/GetMovingSchedule/" + this.currentContactId)
        .subscribe((state: any) => {
          if (state) {
            
            this.movingScheduleIdList.push(state.data.id ?? "");
            this.movingScheduleNameList.push(state.data.name?? "");
          }
        });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our movingSchedule
    if (value) {
      this.movingScheduleNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.movingScheduleCtrl.setValue(null);
  }

  remove(movingSchedule: string): void {
    const index = this.movingScheduleNameList.indexOf(movingSchedule);
    if (index >= 0) {
      this.movingScheduleNameList.splice(index, 1);
      this.movingScheduleIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({
      data: {
        idList: this.movingScheduleIdList,
        nameList: this.movingScheduleNameList,
      },
    });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.movingScheduleIdList = [];
    this.movingScheduleNameList = [];

    this.movingScheduleIdList.push(event.option.value.id);
    this.movingScheduleNameList.push(event.option.value.branchName);

    this.movingScheduleInput.nativeElement.value = "";
    this.movingScheduleCtrl.setValue(null);
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
              pageSize: this.pageSize,
              type: this.movingScheduleType,
            },
          })
        );
      }
    }
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 0) {
      this.movingScheduleType = 0;
    }
    if (parseInt($event.target.value) === 1) {
      this.movingScheduleType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.movingScheduleType = 2;
    }

    this.movingScheduleNameList = [];
    this.movingScheduleIdList = [];

    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      MovingScheduleListActions.getMovingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.movingScheduleType,
        },
      })
    );
  }

  onDisplayAtr(movingSchedule: MovingSchedule): string {
    return "";
  }

  onDisplayName(input: string): string {
    if (input.length > 30) return input.substring(0, 30) + "...";
    else return input;
  }

  isChecked(movingSchedule: MovingSchedule): boolean {
    let movingScheduleExist = this.movingScheduleIdList.find(
      (movingScheduleId) => movingScheduleId === movingSchedule.id
    );
    if (movingScheduleExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
