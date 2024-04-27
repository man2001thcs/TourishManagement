import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RestHouseContactStoreService } from './rest-house-contact-detail.store.service';
import * as RestHouseContactAction from './rest-house-contact-detail.store.action';
import { RestHouseContactUnionActions } from './rest-house-contact-detail.store.action';

@Injectable()
export class RestHouseContactEffects {
  constructor(
    private action: Actions<RestHouseContactAction.RestHouseContactUnionActions>,
    private storeService: RestHouseContactStoreService
  ) {}

  getRestHouseContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestHouseContactAction.getRestHouseContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getRestHouseContact(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return RestHouseContactAction.getRestHouseContactSuccess({
                response: response,
              });
            } else {
              return RestHouseContactAction.getRestHouseContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestHouseContactAction.getRestHouseContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getRestHouseContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.getRestHouseContactSuccess)),
    { dispatch: false }
  );

  getRestHouseContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.getRestHouseContactFailed)),
    { dispatch: false }
  );

  getRestHouseContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.getRestHouseContactSystemFailed)),
    { dispatch: false }
  );

  editRestHouseContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestHouseContactAction.editRestHouseContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editRestHouseContact(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return RestHouseContactAction.editRestHouseContactSuccess({
                response: response,
              });
            } else {
              return RestHouseContactAction.editRestHouseContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestHouseContactAction.editRestHouseContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editRestHouseContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.editRestHouseContactSuccess)),
    { dispatch: false }
  );

  editRestHouseContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.editRestHouseContactFailed)),
    { dispatch: false }
  );

  editRestHouseContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.editRestHouseContactSystemFailed)),
    { dispatch: false }
  );

  //editRestHouseContactSuccess
}
