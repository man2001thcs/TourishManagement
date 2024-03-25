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

import { State as UserListState } from "./multiselect-autocomplete.store.reducer";
import * as UserListActions from "./multiselect-autocomplete.store.action";
import { Store } from "@ngrx/store";
import {
  getMessage,
  getUserList,
  getSysError,
} from "./multiselect-autocomplete.store.selector";
import { MessageService } from "../../user_service/message.service";
import { User } from "src/app/model/baseModel";

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: "user-multiselect-autocomplete",
  templateUrl: "multiselect-autocomplete.component.html",
  styleUrls: ["multiselect-autocomplete.component.css"],
})
export class UserMultiselectAutocompleteComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userCtrl = new FormControl("");

  @Output() result = new EventEmitter<{ data: Array<string> }>();

  @Input() data_selected!: User | undefined;
  @Input() key: string = "";

  userIdList: string[] = [];
  userNameList: string[] = [];

  data!: User[];
  length: number = 0;
  pageIndex = 0;
  canLoadMore = true;
  isLoading = false;
  pageSize = 6;
  currentTotal = 0;

  searchWord = "";
  newSearch = true;

  subscriptions: Subscription[] = [];
  userListState!: Observable<any>;
  filteredUsers!: Observable<string | null>;

  errorMessageState!: Observable<any>;
  errorSystemState!: Observable<any>;

  @ViewChild("userInput")
  userInput!: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<UserListState>,
    private messageService: MessageService
  ) {
    this.filteredUsers = this.userCtrl.valueChanges.pipe(
      debounceTime(400)
    );

    this.userListState = this.store
      .select(getUserList)
      .pipe(debounceTime(400));

    this.errorMessageState = this.store.select(getMessage);
    this.errorSystemState = this.store.select(getSysError);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.filteredUsers.subscribe((state) => {
        // Reset
        this.pageIndex = 0;
        this.newSearch = true;
        this.searchWord = state ?? "";
        this.isLoading = true;
        this.canLoadMore = true;
        this.currentTotal = 0;

        this.store.dispatch(
          UserListActions.getUserList({
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
      this.userListState.subscribe((state) => {
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
      UserListActions.getUserList({
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
    this.store.dispatch(UserListActions.resetUserList());

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnChanges(): void {
    if (this.data_selected !== undefined) {
      this.userIdList.push(this.data_selected.id ?? "");
      this.userNameList.push(this.data_selected.fullName);
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();

    // Add our user
    if (value) {
      this.userNameList.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.userCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.userNameList.indexOf(user);
    if (index >= 0) {
      this.userNameList.splice(index, 1);
      this.userIdList.splice(index, 1);
    }
    this.emitAdjustedData();
  }

  emitAdjustedData = (): void => {
    this.result.emit({ data: this.userIdList });
  };

  selected(event: MatAutocompleteSelectedEvent): void {
    this.userIdList = [];
    this.userNameList = [];

    this.userIdList.push(event.option.value.id);
    this.userNameList.push(event.option.value.fullName);

    this.userInput.nativeElement.value = "";
    this.userCtrl.setValue(null);
    this.emitAdjustedData();
  }

  onScroll($event: any) {
    if ($event.reachEnd) {
      if (this.canLoadMore && !this.isLoading) {
        this.isLoading = true;
        this.pageIndex++;
        this.store.dispatch(
          UserListActions.getUserList({
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

  onDisplayAtr(user: User): string {
    return "";
  }

  isChecked(user: User): boolean {
    let userExist = this.userIdList.find(
      (userId) => userId === user.id
    );
    if (userExist) return true;
    return false;
  }

  cancelLoading() {
    this.isLoading = false;
  }
}
