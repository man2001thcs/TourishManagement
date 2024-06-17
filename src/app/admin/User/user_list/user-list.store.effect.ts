import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { UserListStoreService } from "./user-list.store.service";
import * as UserListAction from "./user-list.store.action";
import { UserListUnionActions } from "./user-list.store.action";

@Injectable()
export class UserListEffects {
  constructor(
    private action: Actions<UserListAction.UserListUnionActions>,
    private storeService: UserListStoreService
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

  deleteUser: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(UserListAction.deleteUser),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteUser(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return UserListAction.deleteUserSuccess({
                response: response,
              });
            } else {
              return UserListAction.deleteUserFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              UserListAction.deleteUserSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteUserListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserListAction.deleteUserSuccess)),
    { dispatch: false }
  );

  deleteUserListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserListAction.deleteUserFailed)),
    { dispatch: false }
  );

  deleteUserListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(UserListAction.deleteUserSystemFailed)),
    { dispatch: false }
  );

  //getUserListSuccess
}
