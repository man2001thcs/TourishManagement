import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Observable, of } from "rxjs";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import { RestaurantListStoreService } from "./restaurant-list.store.service";
import * as RestaurantListAction from "./restaurant-list.store.action";
import { RestaurantListUnionActions } from "./restaurant-list.store.action";

@Injectable()
export class RestaurantListEffects {
  constructor(
    private action: Actions<RestaurantListAction.RestaurantListUnionActions>,
    private storeService: RestaurantListStoreService
  ) {}

  getRestaurantList: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestaurantListAction.getRestaurantList),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.getRestaurantList(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return RestaurantListAction.getRestaurantListSuccess({
                response: response,
              });
            } else {
              return RestaurantListAction.getRestaurantListFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              RestaurantListAction.getRestaurantListSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  getRestaurantListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantListAction.getRestaurantListSuccess)),
    { dispatch: false }
  );

  getRestaurantListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantListAction.getRestaurantListFailed)),
    { dispatch: false }
  );

  getRestaurantListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(RestaurantListAction.getRestaurantListSystemFailed)),
    { dispatch: false }
  );

  deleteRestaurant: Observable<any> = createEffect(() =>
    this.action.pipe(
      ofType(RestaurantListAction.deleteRestaurant),
      map((action) => action.payload),
      switchMap((action) => {
        return this.storeService.deleteRestaurant(action).pipe(
          map((response) => {
            
            if (response.resultCd === 0) {
              
              return RestaurantListAction.deleteRestaurantSuccess({
                response: response,
              });
            } else {
              return RestaurantListAction.deleteRestaurantFailed({
                response: response,
              });
            }
          }),
          catchError((error) => {
            return of(
              RestaurantListAction.deleteRestaurantSystemFailed({ error: error })
            );
          })
        );
      })
    )
  );

  deleteRestaurantListSuccess: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantListAction.deleteRestaurantSuccess)),
    { dispatch: false }
  );

  deleteRestaurantListFailed: Observable<any> = createEffect(
    () => this.action.pipe(ofType(RestaurantListAction.deleteRestaurantFailed)),
    { dispatch: false }
  );

  deleteRestaurantListSystemFailed: Observable<any> = createEffect(
    () =>
      this.action.pipe(ofType(RestaurantListAction.deleteRestaurantSystemFailed)),
    { dispatch: false }
  );

  //getRestaurantListSuccess
}
