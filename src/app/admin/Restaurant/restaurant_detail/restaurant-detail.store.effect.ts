import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RestaurantStoreService } from './restaurant-detail.store.service';
import * as RestaurantAction from './restaurant-detail.store.action';
import { RestaurantUnionActions } from './restaurant-detail.store.action';

@Injectable()
export class RestaurantEffects {
  constructor(
    private action: Actions<RestaurantAction.RestaurantUnionActions>,
    private storeService: RestaurantStoreService
  ) {}

  getRestaurant: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestaurantAction.getRestaurant),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getRestaurant(action).pipe(
          map((response) => {
            if (response.resultCd === 0) {
              return RestaurantAction.getRestaurantSuccess({
                response: response,
              });
            } else {
              return RestaurantAction.getRestaurantFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestaurantAction.getRestaurantSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  getRestaurantSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.getRestaurantSuccess)),
    { dispatch: false }
  );

  getRestaurantFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.getRestaurantFailed)),
    { dispatch: false }
  );

  getRestaurantSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.getRestaurantSystemFailed)),
    { dispatch: false }
  );

  editRestaurant: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestaurantAction.editRestaurant),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.editRestaurant(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return RestaurantAction.editRestaurantSuccess({
                response: response,
              });
            } else {
              return RestaurantAction.editRestaurantFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestaurantAction.editRestaurantSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  editRestaurantSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.editRestaurantSuccess)),
    { dispatch: false }
  );

  editRestaurantFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.editRestaurantFailed)),
    { dispatch: false }
  );

  editRestaurantSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.editRestaurantSystemFailed)),
    { dispatch: false }
  );

  //editRestaurantSuccess
}
