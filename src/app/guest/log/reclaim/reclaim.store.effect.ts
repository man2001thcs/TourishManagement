import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { UserStoreService } from './reclaim.store.service';
import * as UserAction from './reclaim.store.action';
import { UserUnionActions } from './reclaim.store.action';

@Injectable()
export class ReclaimUserEffects {
  constructor(
    private action: Actions<UserAction.UserUnionActions>,
    private storeService: UserStoreService
  ) {}

  reclaimUser: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType( UserAction.reclaimUser),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.reclaimUser(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return  UserAction.reclaimUserSuccess({
                response: response,
              });
            } else {
              return  UserAction.reclaimUserFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of( UserAction.reclaimUserSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  reclaimUserSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.reclaimUserSuccess)),
    { dispatch: false }
  );

  reclaimUserFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.reclaimUserFailed)),
    { dispatch: false }
  );

  reclaimUserSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.reclaimUserSystemFailed)),
    { dispatch: false }
  );

  assignPassword: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType( UserAction.assignPassword),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.assignPassword(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return  UserAction.assignPasswordSuccess({
                response: response,
              });
            } else {
              return  UserAction.assignPasswordFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of( UserAction.assignPasswordSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  assignPasswordSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.assignPasswordSuccess)),
    { dispatch: false }
  );

  assignPasswordFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.assignPasswordFailed)),
    { dispatch: false }
  );

  assignPasswordSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType( UserAction.assignPasswordSystemFailed)),
    { dispatch: false }
  );

  //editAuthorSuccess
}
