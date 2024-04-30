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

import { State as MovingContactListState } from "./select-autocomplete.store.reducer";
import * as MovingContactListActions from "./select-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getMovingContactList,
  getSysError,
} from "./select-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { MovingContact } from "src/app/model/baseModel";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "app-moving-contact-select-autocomplete",
  templateUrl: "select-autocomplete.component.html",
  styleUrls: ["select-autocomplete.component.css"],
})
export class MovingContactSelectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  movingContactCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: any }>();

  @Input() data_selected!: MovingContact | undefined;
  @Input() key: string = "";
  @Input() type = 0;

  movingContactIdList: string[] = [];
  movingContactNameList: string[] = [];
  movingContactType = 0;

  data!: MovingContact[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  movingContactListState!: Observable<any>;
  filteredMovingContacts!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("movingContactInput")
  movingContactInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<MovingContactListState>,
    private messageService: MessageService
  ) {
    this.filteredMovingContacts = this.movingContactCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.movingContactListState = this.store
      .select(getMovingContactList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredMovingContacts.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          MovingContactListActions.getMovingContactList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              type: this.movingContactType,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.movingContactListState.subscribe((state) => {
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
      MovingContactListActions.getMovingContactList({
        payload: {
          search: this.searchWord.toLowerCase(),
          type: this.movingContactType,
          page: this.pageIndex + 1,
          pageSize: 6,
        },
      })
    );
  }

  ngOnDestroy(): void {
    console.log("Destroy");
    this.store.dispatch(MovingContactListActions.resetMovingContactList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    this.movingContactType = this.type;
    if (this.data_selected !== undefined) {
      this.movingContactIdList.push(this.data_selected.id ?? "");
      this.movingContactNameList.push(this.data_selected.branchName ?? "");
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our movingContact
    if (value) {
      this.movingContactNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.movingContactCtrl.setValue(null);
  }

  remove(movingContact: string): void {
    const index = this.movingContactNameList.indexOf(movingContact);
    if (index >= 0) {
      this.movingContactNameList.splice(index, 1);
      this.movingContactIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({ data: {"idList": this.movingContactIdList, "nameList": this.movingContactNameList }});
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.movingContactIdList = [];
    this.movingContactNameList = [];

    this.movingContactIdList.push(event.option.value.id);
    this.movingContactNameList.push(event.option.value.branchName);

    this.movingContactInput.nativeElement.value = "";
    this.movingContactCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          MovingContactListActions.getMovingContactList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              type: this.movingContactType,
              pageSize: 6,
            },
          })
        );
      }
    }
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 1) {
      this.movingContactType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.movingContactType = 2;
    }

    this.movingContactNameList = [];
    this.movingContactIdList = [];

    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      MovingContactListActions.getMovingContactList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          type: this.movingContactType,
          pageSize: 6,
        },
      })
    );
  }

  onDisplayAtr(movingContact: MovingContact): string {
    return "";
  }

  isChecked(movingContact: MovingContact): boolean {
    let movingContactExist = this.movingContactIdList.find(
      (movingContactId) => movingContactId === movingContact.id
    );
    if (movingContactExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
