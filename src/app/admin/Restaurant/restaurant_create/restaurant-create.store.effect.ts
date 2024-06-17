import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { RestaurantStoreService } from './restaurant-create.store.service';
import * as RestaurantAction from './restaurant-create.store.action';
import { RestaurantUnionActions } from './restaurant-create.store.action';

@Injectable()
export class RestaurantCreateEffects {
  constructor(
    private action: Actions<RestaurantAction.RestaurantUnionActions>,
    private storeService: RestaurantStoreService
  ) {}

  createRestaurant: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestaurantAction.createRestaurant),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.createRestaurant(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return RestaurantAction.createRestaurantSuccess({
                response: response,
              });
            } else {
              return RestaurantAction.createRestaurantFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(RestaurantAction.createRestaurantSystemFailed({ error: error }));
          })
        );
      })
    )
  );

  createRestaurantSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.createRestaurantSuccess)),
    { dispatch: false }
  );

  createRestaurantFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.createRestaurantFailed)),
    { dispatch: false }
  );

  createRestaurantSystemFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantAction.createRestaurantSystemFailed)),
    { dispatch: false }
  );

  //createRestaurantSuccess
}
