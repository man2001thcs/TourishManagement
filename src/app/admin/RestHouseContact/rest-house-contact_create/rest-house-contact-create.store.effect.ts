import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RestHouseContactStoreService } from './rest-house-contact-create.store.service';
import * as RestHouseContactAction from './rest-house-contact-create.store.action';
import { RestHouseContactUnionActions } from './rest-house-contact-create.store.action';

@Injectable()
export class RestHouseContactCreateEffects {
  constructor(
    private action: Actions<RestHouseContactAction.RestHouseContactUnionActions>,
    private storeService: RestHouseContactStoreService
  ) {}

  createRestHouseContact: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestHouseContactAction.createRestHouseContact),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createRestHouseContact(action).pipe(
          map((response) => {
            console.log("abcd", response);
            if (response.resultCd === 0) {
              console.log(response);
              return RestHouseContactAction.createRestHouseContactSuccess({
                response: response,
              });
            } else {
              return RestHouseContactAction.createRestHouseContactFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestHouseContactAction.createRestHouseContactSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createRestHouseContactSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.createRestHouseContactSuccess)),
    { dispatch: false }
  );

  createRestHouseContactFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.createRestHouseContactFailed)),
    { dispatch: false }
  );

  createRestHouseContactSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestHouseContactAction.createRestHouseContactSystemFailed)),
    { dispatch: false }
  );

  //createRestHouseContactSuccess
}
