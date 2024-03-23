import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { MultiSelectUserListStoreService } from "./multiselect-autocomplete.store.service";
import * as UserListAction from "./multiselect-autocomplete.store.action";
import { UserListUnionActions } from "./multiselect-autocomplete.store.action";

@Injectable()
export class UserAutoCompleteListEffects {
  constructor(
    private action: Actions<UserListAction.UserListUnionActions>,
    private storeService: MultiSelectUserListStoreService
  ) {}

  getUserList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(UserListAction.getUserList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getUserList(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return UserListAction.getUserListSuccess({
                response: response,
              });
            } else {
              return UserListAction.getUserListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              UserListAction.getUserListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getUserListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserListAction.getUserListSuccess)),
    { dispatch: false }
  );

  getUserListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserListAction.getUserListFailed)),
    { dispatch: false }
  );

  getUserListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(UserListAction.getUserListSystemFailed)),
    { dispatch: false }
  );
  //getUserListSuccess
}
