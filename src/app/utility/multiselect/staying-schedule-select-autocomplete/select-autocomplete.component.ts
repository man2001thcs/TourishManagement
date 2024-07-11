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
import { Observable, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { State as StayingScheduleListState } from "./select-autocomplete.store.reducer";
import * as StayingScheduleListActions from "./select-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getStayingScheduleList,
  getSysError,
} from "./select-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { StayingSchedule } from "src/app/model/baseModel";
import { HttpClient } from "@angular/common/http";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "app-staying-schedule-select-autocomplete",
  templateUrl: "select-autocomplete.component.html",
  styleUrls: ["select-autocomplete.component.css"],
})
export class StayingScheduleSelectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  stayingScheduleCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: any }>();

  @Input() data_selected!: StayingSchedule | undefined;
  @Input() currentContactId = "";
  @Input() key: string = "";
  @Input() type = 0;

  stayingScheduleIdList: string[] = [];
  stayingScheduleNameList: string[] = [];
  stayingScheduleType = 0;

  data!: StayingSchedule[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  stayingScheduleListState!: Observable<any>;
  filteredStayingSchedules!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("stayingScheduleInput")
  stayingScheduleInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<StayingScheduleListState>,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.filteredStayingSchedules = this.stayingScheduleCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.stayingScheduleListState = this.store
      .select(getStayingScheduleList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredStayingSchedules.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          StayingScheduleListActions.getStayingScheduleList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              type: this.stayingScheduleType,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.stayingScheduleListState.subscribe((state) => {
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
      StayingScheduleListActions.getStayingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          type: this.stayingScheduleType,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(StayingScheduleListActions.resetStayingScheduleList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    this.stayingScheduleType = this.type;
    if (this.data_selected !== undefined) {
      this.stayingScheduleIdList.push(this.data_selected.id ?? "");
      this.stayingScheduleNameList.push(this.data_selected.name ?? "");
    }

    this.getCurrentContact();
  }

  getCurrentContact() {
    if (this.currentContactId.length > 0) {
      this.http
        .get("/api/GetStayingSchedule/" + this.currentContactId)
        .subscribe((state: any) => {
          if (state) {
            this.stayingScheduleIdList.push(state.data.id ?? "");
            this.stayingScheduleNameList.push(state.data.name ?? "");
          }
        });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our stayingSchedule
    if (value) {
      this.stayingScheduleNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.stayingScheduleCtrl.setValue(null);
  }

  remove(stayingSchedule: string): void {
    const index = this.stayingScheduleNameList.indexOf(stayingSchedule);
    if (index >= 0) {
      this.stayingScheduleNameList.splice(index, 1);
      this.stayingScheduleIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({
      data: {
        idList: this.stayingScheduleIdList,
        nameList: this.stayingScheduleNameList,
      },
    });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.stayingScheduleIdList = [];
    this.stayingScheduleNameList = [];

    this.stayingScheduleIdList.push(event.option.value.id);
    this.stayingScheduleNameList.push(event.option.value.name);

    this.stayingScheduleInput.nativeElement.value = "";
    this.stayingScheduleCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          StayingScheduleListActions.getStayingScheduleList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              pageSize: this.pageSize,
              type: this.stayingScheduleType,
            },
          })
        );
      }
    }
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 1) {
      this.stayingScheduleType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.stayingScheduleType = 2;
    }

    this.stayingScheduleNameList = [];
    this.stayingScheduleIdList = [];

    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      StayingScheduleListActions.getStayingScheduleList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.stayingScheduleType,
        },
      })
    );
  }

  onDisplayAtr(stayingSchedule: StayingSchedule): string {
    return "";
  }

  onDisplayName(input: string): string {
    if (input.length > 40) return input.substring(0, 40) + "...";
    else return input;
  }
  
  isChecked(stayingSchedule: StayingSchedule): boolean {
    let stayingScheduleExist = this.stayingScheduleIdList.find(
      (stayingScheduleId) => stayingScheduleId === stayingSchedule.id
    );
    if (stayingScheduleExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
