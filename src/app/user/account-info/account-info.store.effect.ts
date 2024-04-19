import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AccountStoreService } from './account-info.store.service';
import * as AccountAction from './account-info.store.action';
import { AccountUnionActions } from './account-info.store.action';

@Injectable()
export class AccountEffects {
  constructor(
    private action: Actions<AccountAction.AccountUnionActions>,
    private storeService: AccountStoreService
  ) {}

  getAccount: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(AccountAction.getAccount),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getAccount(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return AccountAction.getAccountSuccess({
                response: response,
              });
            } else {
              return AccountAction.getAccountFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(AccountAction.getAccountSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getAccountSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.getAccountSuccess)),
    { dispatch: false }
  );

  getAccountFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.getAccountFailed)),
    { dispatch: false }
  );

  getAccountSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.getAccountSystemFailed)),
    { dispatch: false }
  );

  editAccount: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(AccountAction.editAccount),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editAccount(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return AccountAction.editAccountSuccess({
                response: response,
              });
            } else {
              return AccountAction.editAccountFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(AccountAction.editAccountSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editAccountSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.editAccountSuccess)),
    { dispatch: false }
  );

  editAccountFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.editAccountFailed)),
    { dispatch: false }
  );

  editAccountSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(AccountAction.editAccountSystemFailed)),
    { dispatch: false }
  );

  //editAccountSuccess
}
