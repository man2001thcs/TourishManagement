import { COMMA, ENTER } from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, Subscription, of, timer } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { State as RestHouseContactListState } from "./select-autocomplete.store.reducer";
import * as RestHouseContactListActions from "./select-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getRestHouseContactList,
  getSysError,
} from "./select-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { RestHouseContact } from "src/app/model/baseModel";
import { HttpClient } from "@angular/common/http";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "app-staying-contact-select-autocomplete",
  templateUrl: "select-autocomplete.component.html",
  styleUrls: ["select-autocomplete.component.css"],
})
export class RestHouseContactSelectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  restHouseContactCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: any }>();

  @Input() data_selected!: RestHouseContact | undefined;
  @Input() currentContactId = "";
  @Input() key: string = "";
  @Input() type = 0;

  restHouseContactIdList: string[] = [];
  restHouseContactNameList: string[] = [];
  restHouseContactType = 0;

  data!: RestHouseContact[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  restHouseContactListState!: Observable<any>;
  filteredRestHouseContacts!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("restHouseContactInput")
  restHouseContactInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<RestHouseContactListState>,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.filteredRestHouseContacts =
      this.restHouseContactCtrl.valueChanges.pipe(debounceTime(400));

    this.restHouseContactListState = this.store
      .select(getRestHouseContactList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredRestHouseContacts.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          RestHouseContactListActions.getRestHouseContactList({
            payload: {
              search: (state ?? "").toLowerCase(),
              page: 1,
              type: this.restHouseContactType,
              pageSize: 6,
            },
          })
        );
      })
    );

    this.subscriptions.push(
      this.restHouseContactListState.subscribe((state) => {
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
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          search: this.searchWord.toLowerCase(),
          type: this.restHouseContactType,
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
        },
      })
    );

    this.messageService.openLoadingDialog();
  }

  ngOnDestroy(): void {
    
    this.store.dispatch(
      RestHouseContactListActions.resetRestHouseContactList()
    );

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes["type"]) {
      this.restHouseContactType = this.type;

      this.restHouseContactIdList = [];
      this.restHouseContactNameList = [];
      this.data = [];
      this.canLoadMore = true;
      this.isLoading = false;
      this.currentTotal = 0;
      this.newSearch = true;

      this.store.dispatch(
        RestHouseContactListActions.getRestHouseContactList({
          payload: {
            search: this.searchWord.toLowerCase(),
            type: this.restHouseContactType,
            page: this.pageIndex + 1,
            pageSize: this.pageSize,
          },
        })
      );
    }
    
    if (this.data_selected !== undefined) {
      this.restHouseContactIdList.push(this.data_selected.id ?? "");
      this.restHouseContactNameList.push(this.data_selected.placeBranch ?? "");
    }

    this.getCurrentContact();
  }

  getCurrentContact() {
    if (this.currentContactId.length > 0) {
      this.http
        .get("/api/GetRestHouseContact/" + this.currentContactId)
        .subscribe((state: any) => {
          if (state) {
            
            this.restHouseContactIdList.push(state.data.id ?? "");
            this.restHouseContactNameList.push(state.data.placeBranch ?? "");
          }
        });
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our restHouseContact
    if (value) {
      this.restHouseContactNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.restHouseContactCtrl.setValue(null);
  }

  remove(restHouseContact: string): void {
    const index = this.restHouseContactNameList.indexOf(restHouseContact);
    if (index >= 0) {
      this.restHouseContactNameList.splice(index, 1);
      this.restHouseContactIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({
      data: {
        idList: this.restHouseContactIdList,
        nameList: this.restHouseContactNameList,
      },
    });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.restHouseContactIdList = [];
    this.restHouseContactNameList = [];

    this.restHouseContactIdList.push(event.option.value.id);
    this.restHouseContactNameList.push(event.option.value.placeBranch);

    this.restHouseContactInput.nativeElement.value = "";
    this.restHouseContactCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onDisplayName(input: string): string {
    if (input.length > 30) return input.substring(0, 30) + "...";
    else return input;
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          RestHouseContactListActions.getRestHouseContactList({
            payload: {
              search: this.searchWord.toLowerCase(),
              page: this.pageIndex + 1,
              pageSize: this.pageSize,
              type: this.restHouseContactType,
            },
          })
        );
      }
    }
  }

  changeType($event: any) {
    if (parseInt($event.target.value) === 1) {
      this.restHouseContactType = 1;
    } else if (parseInt($event.target.value) === 2) {
      this.restHouseContactType = 2;
    }

    this.restHouseContactNameList = [];
    this.restHouseContactIdList = [];

    this.newSearch = true;
    this.pageIndex = 0;

    this.store.dispatch(
      RestHouseContactListActions.getRestHouseContactList({
        payload: {
          search: this.searchWord.toLowerCase(),
          page: this.pageIndex + 1,
          pageSize: this.pageSize,
          type: this.restHouseContactType,
        },
      })
    );
  }

  onDisplayAtr(restHouseContact: RestHouseContact): string {
    return "";
  }

  isChecked(restHouseContact: RestHouseContact): boolean {
    let restHouseContactExist = this.restHouseContactIdList.find(
      (restHouseContactId) => restHouseContactId === restHouseContact.id
    );
    if (restHouseContactExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
