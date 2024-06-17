import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserStoreService } from './user-detail.store.service';
import * as UserAction from './user-detail.store.action';
import { UserUnionActions } from './user-detail.store.action';

@Injectable()
export class UserEffects {
  constructor(
    private action: Actions<UserAction.UserUnionActions>,
    private storeService: UserStoreService
  ) {}

  getUser: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(UserAction.getUser),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getUser(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return UserAction.getUserSuccess({
                response: response,
              });
            } else {
              return UserAction.getUserFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(UserAction.getUserSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getUserSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.getUserSuccess)),
    { dispatch: false }
  );

  getUserFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.getUserFailed)),
    { dispatch: false }
  );

  getUserSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.getUserSystemFailed)),
    { dispatch: false }
  );

  editUser: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(UserAction.editUser),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editUser(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return UserAction.editUserSuccess({
                response: response,
              });
            } else {
              return UserAction.editUserFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(UserAction.editUserSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editUserSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.editUserSuccess)),
    { dispatch: false }
  );

  editUserFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.editUserFailed)),
    { dispatch: false }
  );

  editUserSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(UserAction.editUserSystemFailed)),
    { dispatch: false }
  );

  //editUserSuccess
}
